'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('negate', () => {

  eq (String (S.negate)) ('negate :: ValidNumber -> ValidNumber');

  eq (S.negate (0.5)) (-0.5);
  eq (S.negate (-0.5)) (0.5);

});
