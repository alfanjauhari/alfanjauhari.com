import { Toggle } from "@radix-ui/react-toggle";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon, ItalicIcon, LinkIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  defaultValue?: string;
  onChange?: (html: string) => void;
};

function ToolbarButton({
  pressed,
  onPressedChange,
  children,
  title,
}: {
  pressed: boolean;
  onPressedChange: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={onPressedChange}
      title={title}
      className={cn(
        "inline-flex items-center justify-center size-8 rounded-md cursor-pointer transition-colors",
        pressed
          ? "bg-foreground/10 text-foreground"
          : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground/70",
      )}
    >
      {children}
    </Toggle>
  );
}

export function RichTextEditor({
  defaultValue,
  onChange,
}: RichTextEditorProps) {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        code: false,
        strike: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: defaultValue || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      forceUpdate();
    },
    onSelectionUpdate: forceUpdate,
    onTransaction: forceUpdate,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[80px] px-3 py-2 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const toggleLink = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-input rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-0.5 border-b border-input px-2 py-1.5 bg-muted/30">
        <ToolbarButton
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <BoldIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <ItalicIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          pressed={editor.isActive("link")}
          onPressedChange={toggleLink}
          title="Link"
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
