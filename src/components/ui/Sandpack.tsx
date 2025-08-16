import type { SandpackProviderProps } from '@codesandbox/sandpack-react'
import { fileReader } from '@/libs/file-reader'
import { ClientSandpack } from './ClientSandpack'

export interface SandpackProps extends Omit<SandpackProviderProps, 'files'> {
  files: string[]
}

export async function Sandpack({ files: filePaths, ...props }: SandpackProps) {
  const files = await Promise.all(
    filePaths.map(async (path) => {
      const key = path.split('/').pop() || ''
      const content = await fileReader(path)

      return {
        key,
        content,
      }
    }),
  ).then((files) =>
    Object.fromEntries(files.map((file) => [file.key, file.content])),
  )

  return <ClientSandpack files={files} {...props} />
}
