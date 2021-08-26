export async function asyncIteratorToArray<T>(
  iterator: AsyncIterableIterator<T>
) {
  const u: Array<T> = [];
  for await (let i of iterator) u.push(i);
  return u;
}
export function iteratorToArray<T>(iterator: IterableIterator<T>) {
  const u: Array<T> = [];
  for (let i of iterator) u.push(i);
  return u;
}
