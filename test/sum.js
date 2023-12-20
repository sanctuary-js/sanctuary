import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('sum', () => {

  eq (String (S.sum), 'sum :: Foldable f => f FiniteNumber -> FiniteNumber');

  eq (S.sum ([]), 0);
  eq (S.sum ([0, 1, 2, 3]), 6);
  eq (S.sum ([1, 2, 3, 4, 5]), 15);
  eq (S.sum ([1, 2, 3, 4, -5]), 5);

  eq (S.sum (S.Nothing), 0);
  eq (S.sum (S.Just (42)), 42);

  eq (S.sum (S.Left ('xxx')), 0);
  eq (S.sum (S.Right (42)), 42);

});
