'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('swap', function() {

  eq (typeof S.swap) ('function');
  eq (S.swap.length) (1);
  eq (S.show (S.swap)) ('swap :: Pair a b -> Pair b a');

  eq (S.swap (S.Pair ('foo') (42))) (S.Pair (42) ('foo'));

});
