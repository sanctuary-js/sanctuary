import * as S from '..';

import eq from './internal/eq';


test('pluck', () => {

  eq(typeof S.pluck, 'function');
  eq(S.pluck.length, 2);
  eq(S.pluck.toString(), 'pluck :: Functor f => String -> f a -> f b');

  eq(S.pluck('x')([]), []);
  eq(S.pluck('x')([{x: 1}, {x: 2}, {x: 3}]), [1, 2, 3]);

  eq(S.pluck('x')(S.Nothing), S.Nothing);
  eq(S.pluck('x')(S.Just({x: 1, y: 2, z: 3})), S.Just(1));

});
