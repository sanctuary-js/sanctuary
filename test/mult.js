'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('mult', () => {

  eq (typeof S.mult) ('function');
  eq (S.mult.length) (1);
  eq (S.show (S.mult)) ('mult :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.mult (4) (2)) (8);
  eq (S.mult (4) (-2)) (-8);
  eq (S.mult (-4) (-2)) (8);
  eq (S.mult (1.5) (3)) (4.5);
  eq (S.mult (-1.5) (3)) (-4.5);
  eq (S.mult (-1.5) (-3)) (4.5);

});
