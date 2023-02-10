export function omit<
  TObject extends object = Record<string, unknown>,
  K extends keyof TObject = keyof TObject,
>(object: TObject, omittedKey: K[]): Omit<TObject, K> {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !omittedKey.includes(key as K)),
  ) as unknown as Omit<TObject, K>;
}
