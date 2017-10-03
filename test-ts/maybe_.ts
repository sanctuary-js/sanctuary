import * as S from '..';

import eq from './internal/eq';
import factorial from './internal/factorial';


test('maybe_', () => {

  eq(typeof S.maybe_, 'function');
  eq(S.maybe_.length, 3);
  eq(S.maybe_.toString(), 'maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b');

  eq(S.maybe_(() => factorial(10))(Math.sqrt)(S.Nothing), 3628800);
  eq(S.maybe_(() => factorial(10))(Math.sqrt)(S.Just(9)), 3);

  let count = 0;
  eq(S.maybe_(() => count += 1)(Math.sqrt)(S.Just(9)), 3);
  eq(count, 0);

});
