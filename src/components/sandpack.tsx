import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import type { CSSProperties, PropsWithChildren } from "react";
import { useTheme } from "@/context/theme-context";
import { type GetSandpackProps, getSandpackProps } from "@/lib/sandpack";
import {
  catppuccinLatteSandpack,
  catppuccinMochaSandpack,
} from "@/lib/sandpack-themes";

export function SandpackFile({
  children,
}: PropsWithChildren<{ name: string }>) {
  return children;
}

export function Sandpack({
  editorProps,
  previewProps,
  testProps,
  template,
  ...props
}: PropsWithChildren<GetSandpackProps>) {
  const { theme } = useTheme();

  return (
    <SandpackProvider
      {...getSandpackProps({
        template,
        style: {
          "--sp-layout-height": "420px",
          "--sp-font-mono": "var(--font-mono)",
          "--sp-font-body": "var(--font-sans)",
        } as CSSProperties,
        theme:
          theme === "light" ? catppuccinLatteSandpack : catppuccinMochaSandpack,
        options: {
          classes: {
            "sp-tab-container": "outline-none!",
            "sp-code-editor": "[&_.cm-gutterElement]:text-xs",
          },
        },
        ...props,
      })}
    >
      <SandpackLayout className="border-none! rounded-none!">
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors
          wrapContent
          data-lenis-prevent
          initMode="immediate"
          {...editorProps}
        />
        {template === "test" ? (
          <SandpackTests {...testProps} />
        ) : (
          <SandpackPreview {...previewProps} />
        )}
      </SandpackLayout>
    </SandpackProvider>
  );
}
