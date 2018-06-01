'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('fst', function() {

  eq (typeof S.fst) ('function');
  eq (S.fst.length) (1);
  eq (S.show (S.fst)) ('fst :: Pair a b -> a');

  eq (S.fst (S.Pair ('foo') (42))) ('foo');

});
