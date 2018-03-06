'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('curry4', function() {

  eq (typeof S.curry4) ('function');
  eq (S.curry4.length) (1);
  eq (String (S.curry4)) ('curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e');

  eq (S.curry4 (function(w, x, y, z) { return w + x + y + z; }) ('w') ('x') ('y') ('z')) ('wxyz');

});
