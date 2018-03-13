import * as S from '..';

import eq from './internal/eq';


test('even', () => {

  eq(typeof S.even, 'function');
  eq(S.even.length, 1);
  eq(S.even.toString(), 'even :: Integer -> Boolean');

  eq(S.even(0), true);
  eq(S.even(2), true);
  eq(S.even(-2), true);

  eq(S.even(1), false);
  eq(S.even(-1), false);

});
