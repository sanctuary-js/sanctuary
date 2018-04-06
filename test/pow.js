'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('pow', function() {

  eq (typeof S.pow) ('function');
  eq (S.pow.length) (1);
  eq (String (S.pow)) ('pow :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.pow (2) (8)) (64);
  eq (S.map (S.pow (2)) ([-3, -2, -1, 0, 1, 2, 3])) ([9, 4, 1, 0, 1, 4, 9]);
  eq (S.map (S.pow (0.5)) ([1, 4, 9, 16, 25])) ([1, 2, 3, 4, 5]);

});
