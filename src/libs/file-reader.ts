import { promises as fs } from 'node:fs'

export async function fileReader(path: string) {
  const text = await fs.readFile(path, 'utf-8')

  return text
}
