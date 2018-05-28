'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('negate', function() {

  eq (typeof S.negate) ('function');
  eq (S.negate.length) (1);
  eq (S.show (S.negate)) ('negate :: ValidNumber -> ValidNumber');

  eq (S.negate (0.5)) (-0.5);
  eq (S.negate (-0.5)) (0.5);

});
