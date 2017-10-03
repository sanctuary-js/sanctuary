import * as S from '..';

import eq from './internal/eq';


test('negate', () => {

  eq(typeof S.negate, 'function');
  eq(S.negate.length, 1);
  eq(S.negate.toString(), 'negate :: ValidNumber -> ValidNumber');

  eq(S.negate(0.5), -0.5);
  eq(S.negate(-0.5), 0.5);

});
