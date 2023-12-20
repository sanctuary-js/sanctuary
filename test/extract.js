'use strict';

const {deepStrictEqual: eq} = require ('assert');

const Identity = require ('sanctuary-identity');

const S = require ('./internal/sanctuary');


test ('extract', () => {

  eq (String (S.extract), 'extract :: Comonad w => w a -> a');

  eq (S.extract (Identity (42)), 42);

});
