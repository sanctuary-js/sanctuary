'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('div', () => {

  eq (String (S.div), 'div :: NonZeroFiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.map (S.div (2)) ([0, 1, 2, 3]), [0, 0.5, 1, 1.5]);

});
