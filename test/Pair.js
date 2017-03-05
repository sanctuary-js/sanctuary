'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('Pair', function() {

  eq (typeof S.Pair) ('function');
  eq (S.Pair.length) (1);
  eq (S.show (S.Pair)) ('Pair :: a -> b -> Pair a b');

  eq (S.Pair ('foo') (42)) (S.Pair ('foo') (42));

});
