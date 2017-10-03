import * as S from '..';

import eq from './internal/eq';


test('lte', () => {

  eq(typeof S.lte, 'function');
  eq(S.lte.length, 1);
  eq(S.lte.toString(), 'lte :: Ord a => a -> (a -> Boolean)');

  eq(S.filter(S.lte(3))([1, 2, 3, 4, 5]), [1, 2, 3]);

});
