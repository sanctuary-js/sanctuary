import * as S from '..';

import eq from './internal/eq';


test('fromMaybe_', () => {

  eq(typeof S.fromMaybe_, 'function');
  eq(S.fromMaybe_.length, 2);
  eq(S.fromMaybe_.toString(), 'fromMaybe_ :: (() -> a) -> Maybe a -> a');

  eq(S.fromMaybe_(() => 0)(S.Nothing), 0);
  eq(S.fromMaybe_(() => 0)(S.Just(42)), 42);

  let count = 0;
  eq(S.fromMaybe_(() => count += 1)(S.Just(42)), 42);
  eq(count, 0);

});
