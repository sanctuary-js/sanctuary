'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('curry5', () => {

  eq (S.show (S.curry5)) ('curry5 :: ((a, b, c, d, e) -> r) -> a -> b -> c -> d -> e -> r');

  eq (S.curry5 ((v, w, x, y, z) => v + w + x + y + z) ('v') ('w') ('x') ('y') ('z')) ('vwxyz');

});
