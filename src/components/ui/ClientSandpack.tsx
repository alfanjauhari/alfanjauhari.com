import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  type SandpackProviderProps,
} from '@codesandbox/sandpack-react'
import { githubLight } from '@codesandbox/sandpack-themes'
import type { CSSProperties } from 'react'

export function ClientSandpack(props: SandpackProviderProps) {
  return (
    <SandpackProvider
      theme={{
        ...githubLight,
        font: {
          size: '14px',
          body: 'Fira Code Variable',
          mono: 'Fira Code Variable',
        },
      }}
      style={
        {
          '--sp-layout-height': '420px',
        } as CSSProperties
      }
      {...props}
    >
      <SandpackLayout className="!border-none">
        <SandpackCodeEditor
          showLineNumbers
          showInlineErrors
          showTabs
          wrapContent
          className="prevent-lenis"
        />
        <SandpackPreview showNavigator />
      </SandpackLayout>
    </SandpackProvider>
  )
}
