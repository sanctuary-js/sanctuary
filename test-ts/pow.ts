import * as S from '..';

import eq from './internal/eq';


test('pow', () => {

  eq(typeof S.pow, 'function');
  eq(S.pow.length, 1);
  eq(S.pow.toString(), 'pow :: FiniteNumber -> (FiniteNumber -> FiniteNumber)');

  eq(S.pow(2)(8), 64);
  eq(S.map(S.pow(2))([-3, -2, -1, 0, 1, 2, 3]), [9, 4, 1, 0, 1, 4, 9]);
  eq(S.map(S.pow(0.5))([1, 4, 9, 16, 25]), [1, 2, 3, 4, 5]);

});
