import * as S from '..';

import eq from './internal/eq';


test('gte', () => {

  eq(typeof S.gte, 'function');
  eq(S.gte.length, 1);
  eq(S.gte.toString(), 'gte :: Ord a => a -> (a -> Boolean)');

  eq(S.filter(S.gte(3))([1, 2, 3, 4, 5]), [3, 4, 5]);

});
