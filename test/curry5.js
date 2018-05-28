'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('curry5', function() {

  eq (typeof S.curry5) ('function');
  eq (S.curry5.length) (1);
  eq (S.show (S.curry5)) ('curry5 :: ((a, b, c, d, e) -> r) -> a -> b -> c -> d -> e -> r');

  eq (S.curry5 (function(v, w, x, y, z) { return v + w + x + y + z; }) ('v') ('w') ('x') ('y') ('z')) ('vwxyz');

});
