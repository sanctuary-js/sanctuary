import * as S from '..';

import eq from './internal/eq';


test('curry3', () => {

  eq(typeof S.curry3, 'function');
  eq(S.curry3.length, 4);
  eq(S.curry3.toString(), 'curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d');

  const curried = S.curry3(function(x: number, y: number, z: number) { return x + y + z; });
  eq(curried(1)(2)(3), 6);

});
