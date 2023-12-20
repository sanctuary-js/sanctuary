'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('negate', () => {

  eq (String (S.negate), 'negate :: ValidNumber -> ValidNumber');

  eq (S.negate (0.5), -0.5);
  eq (S.negate (-0.5), 0.5);

});
