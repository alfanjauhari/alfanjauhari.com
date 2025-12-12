/**
 * Creates an object composed of the picked object properties.
 *
 * @example pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 * @template TObject The type of the object.
 * @template K The keys to pick from the object.
 * @param {TObject} object The source object.
 * @param {K[]} pickedKey The property paths to pick.
 * @returns {Pick<TObject, K>} Returns the new object.
 */
export function pick<
  TObject extends object = Record<string, unknown>,
  K extends keyof TObject = keyof TObject,
>(object: TObject, pickedKey: K[]): Pick<TObject, K> {
  return Object.fromEntries(
    pickedKey.map((key) => [key, object?.[key]]),
  ) as unknown as Pick<TObject, K>;
}
