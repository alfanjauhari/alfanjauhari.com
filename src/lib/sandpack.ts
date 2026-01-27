import type {
  CodeEditorProps,
  PreviewProps,
  SandpackProviderProps,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import {
  Children,
  type ComponentProps,
  isValidElement,
  type ReactNode,
} from "react";

export interface SandpackProps extends SandpackProviderProps {
  editorProps?: CodeEditorProps;
  previewProps?: PreviewProps;
  testProps?: ComponentProps<typeof SandpackTests>;
  tabs?: "preview console" | "preview" | "console test" | "console" | "test";
}

export const COMMON_FILES = {
  "tsconfig.json": {
    code: JSON.stringify({
      include: ["./**/*"],
      compilerOptions: {
        strict: true,
        esModuleInterop: true,
        lib: ["dom", "es2015"],
        jsx: "react-jsx",
      },
    }),
    hidden: true,
    readOnly: true,
  },
};

export function getFiles(children: ReactNode) {
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

  return Object.fromEntries(fileEntries);
}

export const TestTemplateSandpack: (
  props: SandpackProps,
) => SandpackProviderProps = ({ files: _files, children, ...props }) => {
  const files = getFiles(children);

  return {
    files: {
      "package.json": {
        code: JSON.stringify({
          dependencies: {},
          devDependencies: { typescript: "^5.9.0" },
          main: Object.keys(files)[0],
        }),
        hidden: true,
        readOnly: true,
      },
      ...COMMON_FILES,
      ...files,
    },
    customSetup: {
      environment: "parcel",
    },
    ...props,
  };
};

export const ReactTemplateSandpack: (
  props: SandpackProps,
) => SandpackProviderProps = ({ files: _files, children, ...props }) => {
  const files = getFiles(children);

  return {
    files: {
      "package.json": {
        code: JSON.stringify({
          dependencies: {
            react: "^19.0.0",
            "react-dom": "^19.0.0",
            "react-scripts": "^4.0.0",
          },
          devDependencies: {
            "@types/react": "^19.0.0",
            "@types/react-dom": "^19.0.0",
            typescript: "^4.0.0",
          },
          main: "/index.tsx",
        }),
        hidden: true,
        readOnly: true,
      },
      ...COMMON_FILES,
      "/index.tsx": {
        code: `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
        hidden: true,
        readOnly: true,
      },
      "/public/index.html": {
        code: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>`,
        hidden: true,
        readOnly: true,
      },
      ...files,
    },
    customSetup: {
      environment: "create-react-app-typescript",
    },
    ...props,
  };
};

export type GetSandpackProps = Omit<SandpackProps, "template"> & {
  template: "react" | "test" | "vanilla-ts";
};

export function getSandpackProps({
  template,
  files: _files,
  children,
  tabs,
  ...props
}: GetSandpackProps) {
  switch (template) {
    case "test":
      return TestTemplateSandpack({ children, ...props });
    case "react":
      return ReactTemplateSandpack({ children, ...props });
    default:
      return {
        template: "vanilla-ts" as const,
        files: getFiles(children),
        ...props,
      };
  }
}
