'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('pair', () => {

  eq (S.show (S.pair)) ('pair :: (a -> b -> c) -> Pair a b -> c');

  eq (S.pair (S.concat) (S.Pair ('foo') ('bar'))) ('foobar');

});
