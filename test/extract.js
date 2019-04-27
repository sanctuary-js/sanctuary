'use strict';

const Identity = require ('sanctuary-identity');

const S = require ('./internal/sanctuary');

const eq = require ('./internal/eq');


test ('extract', () => {

  eq (S.show (S.extract)) ('extract :: Comonad w => w a -> a');

  eq (S.extract (Identity (42))) (42);

});
