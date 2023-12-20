'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('swap', () => {

  eq (String (S.swap), 'swap :: Pair a b -> Pair b a');

  eq (S.swap (S.Pair ('foo') (42)), S.Pair (42) ('foo'));

});
