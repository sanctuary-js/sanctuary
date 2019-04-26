'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('mult', () => {

  eq (S.show (S.mult)) ('mult :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.mult (4) (2)) (8);
  eq (S.mult (4) (-2)) (-8);
  eq (S.mult (-4) (-2)) (8);
  eq (S.mult (1.5) (3)) (4.5);
  eq (S.mult (-1.5) (3)) (-4.5);
  eq (S.mult (-1.5) (-3)) (4.5);

});
