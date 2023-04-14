type Sorter<T> = (a: T, b: T) => number;

const defaultSorter: Sorter<{ id: number }> = (a, b) => b.id - a.id;

export const orderItems = <T extends { id: number }>(
  items: T[],
  sorter: Sorter<T> = defaultSorter,
) => items.sort(sorter);
