'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('pair', () => {

  eq (String (S.pair), 'pair :: (a -> b -> c) -> Pair a b -> c');

  eq (S.pair (S.concat) (S.Pair ('foo') ('bar')), 'foobar');

});
