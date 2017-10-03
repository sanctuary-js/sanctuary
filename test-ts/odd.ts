import * as S from '..';

import eq from './internal/eq';


test('odd', () => {

  eq(typeof S.odd, 'function');
  eq(S.odd.length, 1);
  eq(S.odd.toString(), 'odd :: Integer -> Boolean');

  eq(S.odd(1), true);
  eq(S.odd(-1), true);

  eq(S.odd(0), false);
  eq(S.odd(2), false);
  eq(S.odd(-2), false);

});
