# @alfanjauhari/solid-prosemirror

A small SolidJS rich-text editor built on ProseMirror. It provides a styled editor component, a focused HTML schema, five default toolbar tools, and a lower-level editor API.

## Requirements

- Node.js 24.19 or newer
- SolidJS 1.9 or newer
- A browser environment for editor initialization
- Tailwind CSS and Tailwind Typography for the component's visual styling

## Installation

Install the package and its peer dependencies:

```sh
pnpm add @alfanjauhari/solid-prosemirror \
  @prosemirror-adapter/solid lucide-solid solid-js \
  prosemirror-commands prosemirror-history prosemirror-keymap \
  prosemirror-model prosemirror-state prosemirror-view
```

## Quick Start

Import the component and the extracted ProseMirror base styles:

```tsx
import { RichTextEditor } from "@alfanjauhari/solid-prosemirror";
import "@alfanjauhari/solid-prosemirror/style.css";

export function Editor() {
  return (
    <RichTextEditor
      defaultValue="<p>Hello <strong>world</strong></p>"
      onChange={(html) => console.log(html)}
    />
  );
}
```

The editor initializes in `onMount`, so its shell can be server-rendered safely. In an islands framework, hydrate the component on the client before expecting editing behavior.

## Styling

The CSS entry contains ProseMirror's baseline selection and document styles. The component layout uses Tailwind utility classes and the Typography plugin's `prose` classes, so import the CSS entry and configure Tailwind separately:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Adjust this path relative to your stylesheet. */
@source "../../node_modules/@alfanjauhari/solid-prosemirror/dist";
```

The component expects Tailwind color utilities for `input`, `muted`, and `foreground`. Map those names to your design tokens, for example:

```css
:root {
  --input: oklch(0.9 0 0);
  --muted: oklch(0.96 0 0);
  --foreground: oklch(0.2 0 0);
}

@theme inline {
  --color-input: var(--input);
  --color-muted: var(--muted);
  --color-foreground: var(--foreground);
}
```

Without this Tailwind setup, editing still works, but the toolbar and editor shell will not have their intended appearance.

## Component API

### `RichTextEditor`

| Prop           | Type                     | Description                                                                |
| -------------- | ------------------------ | -------------------------------------------------------------------------- |
| `defaultValue` | `string`                 | Initial HTML. Read once when the editor mounts.                            |
| `onChange`     | `(html: string) => void` | Called after the document changes. It is not called for the initial value. |
| `tools`        | `RichTextTool[]`         | Toolbar tools. Defaults to `defaultTools`.                                 |
| `class`        | `string`                 | Additional classes for the outer editor container.                         |

The component is uncontrolled. Changing `defaultValue` after mount does not replace the current document.

### Default Tools

| Tool          | Keyboard shortcut |
| ------------- | ----------------- |
| Bold          | `Mod-b`           |
| Italic        | `Mod-i`           |
| Underline     | `Mod-u`           |
| Strikethrough | `Mod-Shift-x`     |
| Blockquote    | None              |

Pass a subset or reordered list through `tools`:

```tsx
import { defaultTools, RichTextEditor } from "@alfanjauhari/solid-prosemirror";

const compactTools = defaultTools.filter((tool) =>
  ["bold", "italic", "blockquote"].includes(tool.id),
);

<RichTextEditor tools={compactTools} />;
```

A custom tool implements this contract:

```ts
interface RichTextTool {
  id: string;
  title: string;
  icon: Component<{ class?: string }>;
  run: (view: EditorView) => void;
  isActive: (state: EditorState) => boolean;
}
```

Custom tools operate against the package's fixed exported `schema`.

## Supported HTML

The editor intentionally supports a narrow schema:

| Kind         | Supported content                              |
| ------------ | ---------------------------------------------- |
| Blocks       | Paragraphs and blockquotes                     |
| Inline nodes | Text and hard breaks                           |
| Marks        | Strong, emphasis, underline, and strikethrough |

`<div>` elements are parsed as paragraphs. Unsupported content such as headings, lists, links, images, tables, and code blocks can be dropped or normalized when initial HTML is parsed and serialized.

## Low-Level API

Use `@alfanjauhari/solid-prosemirror/core` when you need direct access to the `EditorView` or want to build your own toolbar:

```tsx
import { createEditor, defaultTools } from "@alfanjauhari/solid-prosemirror/core";
import { onCleanup, onMount } from "solid-js";

export function BareEditor() {
  let element!: HTMLDivElement;

  onMount(() => {
    const view = createEditor(element, "<p>Hello</p>", {
      tools: defaultTools,
      onChange: (html) => console.log(html),
      onActiveChange: (ids) => console.log(ids),
    });

    onCleanup(() => view.destroy());
  });

  return <div ref={element} />;
}
```

The root and `/core` entries export `createEditor`, `defaultTools`, `schema`, `EditorCallbacks`, and `RichTextTool`. The root additionally exports `RichTextEditor` and its props.

## Security

The package emits HTML but does not sanitize it for later rendering. Sanitize persisted or untrusted output before inserting it with `innerHTML`.

## Development

From the monorepo root:

```sh
pnpm --filter @alfanjauhari/solid-prosemirror build
pnpm --filter @alfanjauhari/solid-prosemirror typecheck
```

This package is licensed under the [MIT License](./LICENSE).
