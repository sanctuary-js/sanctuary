'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('swap', () => {

  eq (S.show (S.swap)) ('swap :: Pair a b -> Pair b a');

  eq (S.swap (S.Pair ('foo') (42))) (S.Pair (42) ('foo'));

});
