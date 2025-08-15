import { join } from 'node:path'
import { Sandpack } from '@/components/ui/Sandpack'

const files = ['/sandpack-files/App.tsx', '/sandpack-files/App.module.css'].map(
  (path) =>
    join(
      process.cwd(),
      'src',
      'components',
      'contents',
      'updates',
      'web-development-with-progressive-enhancement',
      path,
    ),
)

export function FormSandpack() {
  return <Sandpack files={files} template="react-ts" />
}
