import * as S from '..';

import eq from './internal/eq';


test('prop', () => {

  eq(typeof S.prop, 'function');
  eq(S.prop.length, 2);
  eq(S.prop.toString(), 'prop :: String -> a -> b');

  eq(S.prop('a')({a: 0, b: 1}), 0);
  eq(S.prop('0')([1, 2, 3]), 1);
  eq(S.prop('length')('abc'), 3);
  eq(S.prop('x')(Object.create({x: 1, y: 2})), 1);
  eq(S.prop('global')(/x/g), true);

});
