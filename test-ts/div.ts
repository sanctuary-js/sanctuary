import * as S from '..';

import eq from './internal/eq';


test('div', () => {

  eq(typeof S.div, 'function');
  eq(S.div.length, 2);
  eq(S.div.toString(), 'div :: NonZeroFiniteNumber -> FiniteNumber -> FiniteNumber');

  eq(S.map(S.div(2))([0, 1, 2, 3]), [0, 0.5, 1, 1.5]);

});
