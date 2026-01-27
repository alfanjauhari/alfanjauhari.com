import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackTests,
} from "@codesandbox/sandpack-react";
import type { CSSProperties, PropsWithChildren } from "react";
import { type GetSandpackProps, getSandpackProps } from "@/lib/sandpack";
import { sandpackTheme } from "@/lib/sandpack-themes";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SandpackConsole } from "./console";

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
  tabs = "preview console",
  ...props
}: PropsWithChildren<GetSandpackProps>) {
  return (
    <SandpackProvider
      className="catppuccin dark:catppuccin-dark"
      {...getSandpackProps({
        template,
        style: {
          "--sp-layout-height": "420px",
        } as CSSProperties,
        theme: sandpackTheme,
        options: {
          classes: {
            "sp-tab-container": "outline-none!",
            "sp-code-editor": "[&_.cm-gutterElement]:text-xs",
          },
          initMode: "user-visible",
        },
        tabs,
        ...props,
      })}
    >
      <SandpackLayout className="border-none! rounded-none! not-prose">
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors
          wrapContent
          data-lenis-prevent
          className="md:flex-2!"
          {...editorProps}
        />
        <Tabs
          className="md:flex-1 p-0 gap-0 h-(--sp-layout-height) bg-(--sp-colors-surface1) w-full"
          defaultValue="console"
        >
          <TabsList className="bg-transparent p-0 border-b border-b-foreground w-full">
            {tabs.split(" ").map((tab) => {
              return (
                <TabsTrigger asChild value={tab} key={tab}>
                  <Button
                    variant="ghost"
                    className="h-auto p-2 border-0 bg-transparent! hover:bg-transparent! text-xs font-mono shadow-none! w-auto border-r! border-r-white! last:border-r-0!"
                  >
                    {tab.toUpperCase()}
                  </Button>
                </TabsTrigger>
              );
            })}
          </TabsList>
          <TabsContent
            value="preview"
            // if the tabs doesn't have a runner such as preview or test
            // we should render this preview so the console/other tab that required runner
            // will be running correctly
            forceMount={!tabs.includes("test") ? true : undefined}
          >
            <SandpackPreview
              className="min-h-full"
              showRestartButton
              {...previewProps}
            />
          </TabsContent>
          <TabsContent
            value="test"
            forceMount={tabs.includes("test") ? true : undefined}
          >
            <SandpackTests className="min-h-full" {...testProps} />
          </TabsContent>
          <TabsContent
            value="console"
            forceMount={tabs.includes("console") ? true : undefined}
            className="overflow-y-auto"
          >
            <div className="sandpack-console bg-(--colors-surface1) h-full">
              <SandpackConsole />
            </div>
          </TabsContent>
        </Tabs>
      </SandpackLayout>
    </SandpackProvider>
  );
}
