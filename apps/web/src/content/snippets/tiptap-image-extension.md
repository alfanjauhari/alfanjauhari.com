---
title: Tiptap Image Extension
description: This extension extends the Tiptap image functionality to support custom image upload handling, including progress tracking and loading states. It allows for multiple images to be uploaded simultaneously while maintaining their individual states.
createdAt: 2025-08-10
---

```tsx
import {
  Image as TiptapImage,
  ImageOptions as TiptapImageOptions,
} from "@tiptap/extension-image";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import {
  findChildren,
  type NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditorState,
} from "@tiptap/react";
import { randomUUID } from "uncrypto";

import { cn } from "@/lib/utils";

import { useEditorContext } from "..";

export interface ImageOptions extends TiptapImageOptions {
  uploadFn?: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<string>;
}

export interface ImageState {
  loading: boolean;
  progress: number;
}

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    uploadImage: {
      uploadImage: (file: File) => ReturnType;
    };
  }

  interface Storage {
    image: {
      data: (
        id: string,
        state: EditorState,
      ) => {
        loading: boolean;
        progress: number;
      };
    };
  }
}

const imageUploadKey = new PluginKey<ImageState>("imageUpload");

/**
 * This function preloads an image by creating a new Image object,
 * `img.decode()` is called to ensure the image is fully loaded before appending it to the DOM.
 * If `img.decode()` is not supported, it falls back to using the `onload` event.
 *
 * @param url URL of the image to preload
 */
const preloadImage = async (url: string) => {
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = url;
  try {
    await img.decode?.();
  } catch {
    await new Promise<void>((res) => (img.onload = () => res()));
  }
};

/**
 *
 * @param props NodeViewProps containing the node and selection state
 * This component renders an image node with custom attributes and a loading indicator.
 *
 * For the loading state, it uses the `progress` that is stored in the editor's state based on the image id attribute.
 * This is useful for showing upload progress only for the images that are currently being uploaded, previousely when you have more than one image inthe editor, it will show the loading indicator for all images if the one of them is being uploaded.
 */
const ImageNodeView: React.FC<NodeViewProps> = ({ node, selected }) => {
  const { src, alt, title, width, height, id } = node.attrs;

  const editor = useEditorContext();

  const state = useEditorState({
    editor,
    selector: (state) => ({
      loading: state.editor.storage.image.data(id, state.editor.state).loading,
      progress: state.editor.storage.image.data(id, state.editor.state)
        .progress,
    }),
  });

  return (
    <NodeViewWrapper
      as="span"
      className={cn("tiptap-image relative inline-block align-bottom", {
        "is-selected": selected,
      })}
      contentEditable={false}
      data-drag-handle="true"
    >
      {state.loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40">
          <div className="h-4 w-1/2 rounded-2xl border border-neutral-400 p-0.5">
            <div
              className="h-full rounded-xl bg-neutral-500 transition-[width] ease-linear"
              style={{
                width: `${state.progress}%`,
              }}
            />
          </div>
        </div>
      )}
      <img
        alt={alt ?? ""}
        title={title ?? ""}
        width={width ?? undefined}
        height={height ?? undefined}
        src={src ?? ""}
        decoding="async"
        loading="eager"
      />
    </NodeViewWrapper>
  );
};

export const ImageExtension = TiptapImage.extend<ImageOptions>({
  addOptions() {
    return {
      inline: true,
      allowBase64: true,
      HTMLAttributes: {},
      draggable: true,
      ...this.parent?.(),
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
      },
      width: { default: null },
      height: { default: null },
    };
  },

  // This storage is used to keep track of the image upload progress and loading state by leveraging the plugin state.
  // As you can see, the data function has `id` which is the image id; `state` which is the editor state. This allows us to get the image state based on the id.
  // Previously, the image extension can not handle multiple images being uploaded at the same time, it will show the loading indicator only for the latest image being uploaded,
  // event if the previous images are still being uploaded.
  // With the Map state, we can keep track of the loading state and progress for each image based on the id attribute.
  addStorage() {
    return {
      data: (id: string, state: EditorState) => {
        const st = imageUploadKey.getState(state) as
          | Map<string, ImageState>
          | undefined;
        const row = st?.get(id);
        return row ?? { loading: false, progress: 0 };
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: imageUploadKey,
        state: {
          init: () => new Map<string, ImageState>(),
          apply(tr, value) {
            const meta = tr.getMeta(imageUploadKey) as
              | (Partial<ImageState> & { id: string; remove?: boolean })
              | undefined;
            if (!meta) return value;

            const next = new Map(value);

            if (meta.remove) {
              next.delete(meta.id);

              return next;
            }

            const curr = next.get(meta.id) || { loading: false, progress: 0 };
            next.set(meta.id, {
              loading: meta.loading ?? curr.loading,
              progress: meta.progress ?? curr.progress,
            });

            return next;
          },
        },
        // Append transaction to remove images that are no longer in the document.
        // It might be useful to remove the image from storage (S3, etc)
        // The `aliveIds` are the ids of images that are still in the document, it will be used to determine which images to remove based on
        // the key from the imageUploadKey map state.
        appendTransaction: (_tr, _old, newState) => {
          const state = imageUploadKey.getState(newState) as
            | Map<string, ImageState>
            | undefined;
          if (!state) return;
          const aliveIds = new Set(
            findChildren(newState.doc, (n) => n.type.name === this.name).map(
              (x) => x.node.attrs.id,
            ),
          );

          const toRemove: string[] = [];
          for (const id of state.keys()) {
            if (!aliveIds.has(id)) toRemove.push(id);
          }

          if (toRemove.length === 0) return;

          const tr = newState.tr;
          toRemove.forEach((id) =>
            tr.setMeta(imageUploadKey, { id, remove: true }),
          );

          return tr;
        },
      }),
    ];
  },
  addCommands() {
    /**
     * Set the metadata for an image node.
     * This is used to update the loading state and progress of the image upload based on the id
     * by setting the metadata in the ProseMirror transaction.
     *
     * @param view The editor view
     * @param meta The metadata to set
     */
    const setMeta = (
      view: typeof this.editor.view,
      meta: Partial<ImageState> & { id: string },
    ) => {
      const tr = view.state.tr.setMeta(imageUploadKey, meta);
      view.dispatch(tr);
    };

    /**
     * Set the attributes for an image node.
     * This function finds the image node by its id and sets the attributes for that node.
     * `findChildren` is used to find the image on the document based on the node type and id attribute.
     * Then, it uses `setNodeAttribute` to set each attribute in the transaction and dispatches the transaction.
     *
     * @param id The id of the image node to set attributes for.
     * @param attrs The attributes to set for the image node.
     * @returns boolean indicating whether the attributes were set successfully.
     */
    const setAttrsById = (id: string, attrs: Record<string, unknown>) => {
      const { state } = this.editor;
      const match = findChildren(
        state.doc,
        (n) => n.type.name === this.name && n.attrs.id === id,
      )[0];

      if (!match) return false;
      const tr = state.tr;

      Object.entries(attrs).forEach(([k, v]) =>
        tr.setNodeAttribute(match.pos, k, v),
      );

      this.editor.view.dispatch(tr);
      return true;
    };

    return {
      ...this.parent?.(),
      uploadImage: (file: File) => () => {
        const id = randomUUID();

        if (!this.options.uploadFn) return false;

        // It creates a blob URL for the image file to be used in the editor as a placeholder/temporary image source.
        const blobUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = blobUrl;
        // When the image is loaded, it inserts the image node into the editor with the blob URL as the temporary source then start the upload process.
        img.onload = () => {
          this.editor
            .chain()
            .insertContent({
              type: this.name,
              attrs: { id, src: blobUrl, width: img.width, height: img.height },
            })
            .run();

          const { view } = this.editor;
          setMeta(view, { loading: true, progress: 0, id });

          if (!this.options.uploadFn) return false;

          // Call the upload function with the file and a progress callback to update the loading state and progress.
          // The progress callback will update the metadata in the ProseMirror transaction.
          // Once the upload is complete, it will set the image source to the uploaded URL and
          // revoke the blob URL to free up memory.
          // It also preloads the image to ensure it is fully loaded before displaying it in the editor.
          // If the upload fails, it will set the loading state to false and progress to 0.
          // TODO: Handle errors and show a notification to the user if the upload fails.
          this.options
            .uploadFn(file, (progress) =>
              // The progress is capped at 99% so that the loading indicator does not reach 100% until the image is fully loaded. Gimmick of course!
              setMeta(view, {
                loading: true,
                progress: progress >= 99 ? 99 : progress,
                id,
              }),
            )
            .then(async (url) => {
              await preloadImage(url);

              setAttrsById(id, { src: url, id });

              setMeta(view, { loading: false, progress: 100, id });

              URL.revokeObjectURL(blobUrl);
            })
            .catch(() => setMeta(view, { loading: false, progress: 0, id }));
        };

        return true;
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
```
