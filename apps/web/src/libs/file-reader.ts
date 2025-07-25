export async function fileReader(path: string) {
  const file = Bun.file(path)
  const text = await file.text()

  return text
}
