'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('zero', function() {

  eq (typeof S.zero) ('function');
  eq (S.zero.length) (1);
  eq (String (S.zero)) ('zero :: Plus f => TypeRep f -> f a');

  eq (S.zero (Array)) ([]);
  eq (S.zero (Object)) ({});
  eq (S.zero (S.Maybe)) (S.Nothing);

});
