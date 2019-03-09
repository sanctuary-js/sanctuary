'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('swap', () => {

  eq (typeof S.swap) ('function');
  eq (S.swap.length) (1);
  eq (S.show (S.swap)) ('swap :: Pair a b -> Pair b a');

  eq (S.swap (S.Pair ('foo') (42))) (S.Pair (42) ('foo'));

});
