'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('curry5', () => {

  eq (typeof S.curry5) ('function');
  eq (S.curry5.length) (1);
  eq (S.show (S.curry5)) ('curry5 :: ((a, b, c, d, e) -> r) -> a -> b -> c -> d -> e -> r');

  eq (S.curry5 ((v, w, x, y, z) => v + w + x + y + z) ('v') ('w') ('x') ('y') ('z')) ('vwxyz');

});
