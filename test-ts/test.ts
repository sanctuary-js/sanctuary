import * as S from '..';

import eq from './internal/eq';


test('test', () => {

  eq(typeof S.test, 'function');
  eq(S.test.length, 2);
  eq(S.test.toString(), 'test :: RegExp -> String -> Boolean');

  eq(S.test(/^a/)('abacus'), true);
  eq(S.test(/^a/)('banana'), false);

  const pattern = /x/g;
  eq(pattern.lastIndex, 0);
  eq(S.test(pattern)('xyz'), true);
  eq(pattern.lastIndex, 0);
  eq(S.test(pattern)('xyz'), true);

});
