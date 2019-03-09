'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('fst', () => {

  eq (typeof S.fst) ('function');
  eq (S.fst.length) (1);
  eq (S.show (S.fst)) ('fst :: Pair a b -> a');

  eq (S.fst (S.Pair ('foo') (42))) ('foo');

});
