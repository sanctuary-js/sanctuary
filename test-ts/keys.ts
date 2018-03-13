import * as S from '..';

import eq from './internal/eq';


test('keys', () => {

  eq(typeof S.keys, 'function');
  eq(S.keys.length, 1);
  eq(S.keys.toString(), 'keys :: StrMap a -> Array String');

  eq(S.keys({}), []);
  eq(S.keys({a: 1, b: 2, c: 3}).sort(), ['a', 'b', 'c']);

  const proto = {a: 1, b: 2};
  const obj = Object.create(proto);
  obj.c = 3;
  obj.d = 4;

  eq(S.keys(obj).sort(), ['c', 'd']);

});
