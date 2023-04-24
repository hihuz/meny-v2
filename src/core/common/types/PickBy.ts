/**
 * From `T`, pick a set of properties matching `ValueType`.
 *
 * Credit: https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
 */
export type PickBy<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]-?: T[Key] extends ValueType ? Key : never;
  }[keyof T]
>;
