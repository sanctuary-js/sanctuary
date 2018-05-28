'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('product', function() {

  eq (typeof S.product) ('function');
  eq (S.product.length) (1);
  eq (S.show (S.product)) ('product :: Foldable f => f FiniteNumber -> FiniteNumber');

  eq (S.product ([])) (1);
  eq (S.product ([0, 1, 2, 3])) (0);
  eq (S.product ([1, 2, 3, 4, 5])) (120);
  eq (S.product ([1, 2, 3, 4, -5])) (-120);

  eq (S.product (S.Nothing)) (1);
  eq (S.product (S.Just (42))) (42);

  eq (S.product (S.Left ('xxx'))) (1);
  eq (S.product (S.Right (42))) (42);

});
