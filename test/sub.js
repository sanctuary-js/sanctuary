'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('sub', () => {

  eq (S.show (S.sub)) ('sub :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.map (S.sub (1)) ([1, 2, 3])) ([0, 1, 2]);

});
