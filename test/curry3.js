'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('curry3', () => {

  eq (S.show (S.curry3)) ('curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d');

  eq (S.curry3 ((x, y, z) => x + y + z) ('x') ('y') ('z')) ('xyz');

});
