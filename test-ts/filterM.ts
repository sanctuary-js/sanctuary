import * as S from '..';

import eq from './internal/eq';


test('filterM', () => {

  eq(typeof S.filterM, 'function');
  eq(S.filterM.length, 2);
  eq(S.filterM.toString(), 'filterM :: (Alternative m, Monad m) => (a -> Boolean) -> m a -> m a');

  eq(S.filterM(S.odd)([]), []);
  eq(S.filterM(S.odd)([0, 2, 4, 6, 8]), []);
  eq(S.filterM(S.odd)([1, 3, 5, 7, 9]), [1, 3, 5, 7, 9]);
  eq(S.filterM(S.odd)([1, 2, 3, 4, 5]), [1, 3, 5]);
  eq(S.filterM(S.odd)(S.Nothing), S.Nothing);
  eq(S.filterM(S.odd)(S.Just(4)), S.Nothing);
  eq(S.filterM(S.odd)(S.Just(9)), S.Just(9));

});
