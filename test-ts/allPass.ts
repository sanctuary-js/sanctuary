import * as S from '..';

import eq from './internal/eq';


test('allPass', () => {

  eq(typeof S.allPass, 'function');
  eq(S.allPass.length, 2);
  eq(S.allPass.toString(), 'allPass :: Array (a -> Boolean) -> a -> Boolean');

  eq(S.allPass([])('abacus'), true);
  eq(S.allPass([S.test(/a/), S.test(/b/), S.test(/c/)])('abacus'), true);
  eq(S.allPass([S.test(/a/), S.test(/b/), S.test(/c/)])('banana'), false);

  let e = false;
  eq(S.allPass([S.test(/a/), _ => e = true])('monkey'), false);
  eq(e, false);

});
