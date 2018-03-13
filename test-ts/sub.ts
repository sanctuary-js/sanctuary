import * as S from '..';

import eq from './internal/eq';


test('sub', () => {

  eq(typeof S.sub, 'function');
  eq(S.sub.length, 2);
  eq(S.sub.toString(), 'sub :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq(S.map(S.sub(1))([1, 2, 3]), [0, 1, 2]);

});
