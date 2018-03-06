'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('mult', function() {

  eq (typeof S.mult) ('function');
  eq (S.mult.length) (1);
  eq (String (S.mult)) ('mult :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.mult (4) (2)) (8);
  eq (S.mult (4) (-2)) (-8);
  eq (S.mult (-4) (-2)) (8);
  eq (S.mult (1.5) (3)) (4.5);
  eq (S.mult (-1.5) (3)) (-4.5);
  eq (S.mult (-1.5) (-3)) (4.5);

});
