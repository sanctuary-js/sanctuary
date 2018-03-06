'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('mean', function() {

  eq (typeof S.mean) ('function');
  eq (S.mean.length) (1);
  eq (String (S.mean)) ('mean :: Foldable f => f FiniteNumber -> Maybe FiniteNumber');

  eq (S.mean ([])) (S.Nothing);
  eq (S.mean ([1, 2, 3])) (S.Just (2));
  eq (S.mean ([0.1, 0.3])) (S.Just (0.2));

  eq (S.mean (S.Nothing)) (S.Nothing);
  eq (S.mean (S.Just (42))) (S.Just (42));

  eq (S.mean (S.Left ('xxx'))) (S.Nothing);
  eq (S.mean (S.Right (42))) (S.Just (42));

});
