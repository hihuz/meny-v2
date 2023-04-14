export class CoreAssert {
  public static notEmpty<T>(value: T | null | undefined, exception: Error): T {
    if (value === null || value === undefined) {
      throw exception;
    }

    return value;
  }
}
