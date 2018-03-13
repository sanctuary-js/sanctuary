import * as S from '..';

import eq from './internal/eq';


test('gt', () => {

  eq(typeof S.gt, 'function');
  eq(S.gt.length, 1);
  eq(S.gt.toString(), 'gt :: Ord a => a -> (a -> Boolean)');

  eq(S.filter(S.gt(3))([1, 2, 3, 4, 5]), [4, 5]);

});
