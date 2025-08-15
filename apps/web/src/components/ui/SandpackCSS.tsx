'use client'

import { getSandpackCssText } from '@codesandbox/sandpack-react'
import { useServerInsertedHTML } from 'next/navigation'

export function SandpackCSS() {
  useServerInsertedHTML(() => {
    return (
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: The <style> element is rendered server-side and cannot be modified by user content.
        dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
        id="sandpack"
      />
    )
  })

  return null
}
