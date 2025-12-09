import {
  type CodeEditorProps,
  type PreviewProps,
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  type SandpackProviderProps,
} from "@codesandbox/sandpack-react";
import {
  Children,
  type CSSProperties,
  isValidElement,
  type PropsWithChildren,
} from "react";
import { useTheme } from "@/context/theme-context";
import {
  catppuccinLatteSandpack,
  catppuccinMochaSandpack,
} from "@/lib/sandpack-themes";
import { cn } from "@/lib/utils";

export interface SandpackProps extends SandpackProviderProps {
  editorProps?: CodeEditorProps;
  previewProps?: PreviewProps;
}

export function SandpackFile({
  children,
}: PropsWithChildren<{ name: string }>) {
  return children;
}

export function Sandpack({
  editorProps,
  previewProps,
  children,
  files: _files,
  ...props
}: PropsWithChildren<SandpackProps>) {
  const { theme } = useTheme();

  const fileEntries = Children.toArray(children)
    .map((child) => {
      if (!isValidElement<{ name: string; children: string }>(child)) {
        return null;
      }

      return [child.props.name, child.props.children];
    })
    .filter((child): child is [string, string] => {
      return child !== null;
    });

  const files = Object.fromEntries(fileEntries);

  return (
    <SandpackProvider
      style={
        {
          "--sp-layout-height": "420px",
        } as CSSProperties
      }
      template="react-ts"
      theme={
        theme === "light" ? catppuccinLatteSandpack : catppuccinMochaSandpack
      }
      options={{
        classes: {
          "sp-tab-container": "outline-none!",
          "sp-code-editor": cn("[&_.cm-gutterElement]:text-xs"),
        },
      }}
      files={files}
      {...props}
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
        <SandpackPreview {...previewProps} />
      </SandpackLayout>
    </SandpackProvider>
  );
}
