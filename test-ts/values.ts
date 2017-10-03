import * as S from '..';

import eq from './internal/eq';


test('values', () => {

  eq(typeof S.values, 'function');
  eq(S.values.length, 1);
  eq(S.values.toString(), 'values :: StrMap a -> Array a');

  eq(S.values({}), []);
  eq(S.values({a: 1, b: 2, c: 3}).sort(), [1, 2, 3]);

  const proto = {a: 1, b: 2};
  const obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.values(obj).sort(), [3, 4]);

});
