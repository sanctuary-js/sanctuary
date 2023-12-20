'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('fst', () => {

  eq (String (S.fst), 'fst :: Pair a b -> a');

  eq (S.fst (S.Pair ('foo') (42)), 'foo');

});
