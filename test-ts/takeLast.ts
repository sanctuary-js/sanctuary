import * as S from '..';

import eq from './internal/eq';


test('takeLast', () => {

  eq(typeof S.takeLast, 'function');
  eq(S.takeLast.length, 2);
  eq(S.takeLast.toString(), 'takeLast :: Integer -> List a -> Maybe (List a)');

  eq(S.takeLast(0)([1, 2, 3, 4, 5]), S.Just([]));
  eq(S.takeLast(1)([1, 2, 3, 4, 5]), S.Just([5]));
  eq(S.takeLast(2)([1, 2, 3, 4, 5]), S.Just([4, 5]));
  eq(S.takeLast(3)([1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
  eq(S.takeLast(4)([1, 2, 3, 4, 5]), S.Just([2, 3, 4, 5]));
  eq(S.takeLast(5)([1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
  eq(S.takeLast(6)([1, 2, 3, 4, 5]), S.Nothing);

  eq(S.takeLast(0)('12345'), S.Just(''));
  eq(S.takeLast(1)('12345'), S.Just('5'));
  eq(S.takeLast(2)('12345'), S.Just('45'));
  eq(S.takeLast(3)('12345'), S.Just('345'));
  eq(S.takeLast(4)('12345'), S.Just('2345'));
  eq(S.takeLast(5)('12345'), S.Just('12345'));
  eq(S.takeLast(6)('12345'), S.Nothing);

  eq(S.takeLast(-1)([1, 2, 3, 4, 5]), S.Nothing);

});
