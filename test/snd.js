'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('snd', () => {

  eq (String (S.snd), 'snd :: Pair a b -> b');

  eq (S.snd (S.Pair ('foo') (42)), 42);

});
