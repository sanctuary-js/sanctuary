import * as S from '..';

import add_ from './internal/add_';
import eq from './internal/eq';


test('curry2', () => {

  eq(typeof S.curry2, 'function');
  eq(S.curry2.length, 3);
  eq(S.curry2.toString(), 'curry2 :: ((a, b) -> c) -> a -> b -> c');

  const curried = S.curry2(add_);
  eq(curried(1)(2), 3);

});
