'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('curry4', () => {

  eq (S.show (S.curry4)) ('curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e');

  eq (S.curry4 ((w, x, y, z) => w + x + y + z) ('w') ('x') ('y') ('z')) ('wxyz');

});
