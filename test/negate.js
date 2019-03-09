'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('negate', () => {

  eq (typeof S.negate) ('function');
  eq (S.negate.length) (1);
  eq (S.show (S.negate)) ('negate :: ValidNumber -> ValidNumber');

  eq (S.negate (0.5)) (-0.5);
  eq (S.negate (-0.5)) (0.5);

});
