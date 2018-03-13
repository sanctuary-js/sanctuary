import * as S from '..';

import eq from './internal/eq';


test('curry4', () => {

  eq(typeof S.curry4, 'function');
  eq(S.curry4.length, 5);
  eq(S.curry4.toString(), 'curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e');

  const curried = S.curry4(function(w: number, x: number, y: number, z: number) { return w + x + y + z; });
  eq(curried(1)(2)(3)(4), 10);

});
