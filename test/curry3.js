'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('curry3', function() {

  eq (typeof S.curry3) ('function');
  eq (S.curry3.length) (1);
  eq (String (S.curry3)) ('curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d');

  eq (S.curry3 (function(x, y, z) { return x + y + z; }) ('x') ('y') ('z')) ('xyz');

});
