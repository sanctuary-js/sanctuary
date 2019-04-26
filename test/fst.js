'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('fst', () => {

  eq (S.show (S.fst)) ('fst :: Pair a b -> a');

  eq (S.fst (S.Pair ('foo') (42))) ('foo');

});
