'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('Pair', () => {

  eq (String (S.Pair), 'Pair :: a -> b -> Pair a b');

  eq (S.Pair ('foo') (42), S.Pair ('foo') (42));

});
