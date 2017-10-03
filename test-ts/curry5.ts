import * as S from '..';

import eq from './internal/eq';


test('curry5', () => {

  eq(typeof S.curry5, 'function');
  eq(S.curry5.length, 6);
  eq(S.curry5.toString(), 'curry5 :: ((a, b, c, d, e) -> r) -> a -> b -> c -> d -> e -> r');

  const curried = S.curry5(function(v: number, w: number, x: number, y: number, z: number) { return v + w + x + y + z; });
  eq(curried(1)(2)(3)(4)(5), 15);

});
