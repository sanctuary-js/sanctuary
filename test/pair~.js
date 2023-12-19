'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('pair', () => {

  eq (String (S.pair)) ('pair :: (a -> b -> c) -> Pair a b -> c');

  eq (S.pair (S.concat) (S.Pair ('foo') ('bar'))) ('foobar');

});
