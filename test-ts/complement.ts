import * as S from '..';

import eq from './internal/eq';


test('complement', () => {

  eq(typeof S.complement, 'function');
  eq(S.complement.length, 2);
  eq(S.complement.toString(), 'complement :: (a -> Boolean) -> a -> Boolean');

  eq(S.complement(S.odd)(1), false);
  eq(S.complement(S.odd)(2), true);

});
