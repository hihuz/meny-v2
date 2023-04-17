import { CoreAssert } from '@core/common/utils/assert/CoreAssert';

describe('CoreAssert', () => {
  const AssertionError = new Error('AssertionError');

  describe('notEmpty', () => {
    describe('when the value is not empty', () => {
      it('should return it as is', () => {
        const value = 'some-value';

        const result = CoreAssert.notEmpty(value, AssertionError);

        expect(result).toEqual(value);
      });
    });

    describe('when the value is null', () => {
      it('should throw an error', () => {
        expect(() => CoreAssert.notEmpty(null, AssertionError)).toThrow(
          AssertionError,
        );
      });
    });

    describe('when expression is undefined', () => {
      it('should throw an error', () => {
        expect(() =>
          CoreAssert.notEmpty(undefined, AssertionError),
        ).toThrowError(AssertionError);
      });
    });
  });
});
