import * as S from '..';

import eq from './internal/eq';


test('anyPass', () => {

  eq(typeof S.anyPass, 'function');
  eq(S.anyPass.length, 2);
  eq(S.anyPass.toString(), 'anyPass :: Array (a -> Boolean) -> a -> Boolean');

  eq(S.anyPass([])('narwhal'), false);
  eq(S.anyPass([S.test(/a/), S.test(/b/), S.test(/c/)])('narwhal'), true);
  eq(S.anyPass([S.test(/a/), S.test(/b/), S.test(/c/)])('gorilla'), true);

  let e = false;
  eq(S.anyPass([S.test(/a/), _ => e = true])('narwhal'), true);
  eq(e, false);

});
