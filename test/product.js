import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('product', () => {

  eq (String (S.product), 'product :: Foldable f => f FiniteNumber -> FiniteNumber');

  eq (S.product ([]), 1);
  eq (S.product ([0, 1, 2, 3]), 0);
  eq (S.product ([1, 2, 3, 4, 5]), 120);
  eq (S.product ([1, 2, 3, 4, -5]), -120);

  eq (S.product (S.Nothing), 1);
  eq (S.product (S.Just (42)), 42);

  eq (S.product (S.Left ('xxx')), 1);
  eq (S.product (S.Right (42)), 42);

});
