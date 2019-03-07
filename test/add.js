'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('add', () => {

  eq (typeof S.add) ('function');
  eq (S.add.length) (1);
  eq (S.show (S.add)) ('add :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.add (1) (1)) (2);
  eq (S.add (-1) (-1)) (-2);
  eq (S.add (1.5) (1)) (2.5);
  eq (S.add (-1.5) (-1)) (-2.5);

});
