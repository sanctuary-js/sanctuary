'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('pair', () => {

  eq (typeof S.pair) ('function');
  eq (S.pair.length) (1);
  eq (S.show (S.pair)) ('pair :: (a -> b -> c) -> Pair a b -> c');

  eq (S.pair (S.concat) (S.Pair ('foo') ('bar'))) ('foobar');

});
