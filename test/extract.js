'use strict';

var Identity = require ('sanctuary-identity');

var S = require ('./internal/sanctuary');

var eq = require ('./internal/eq');


test ('extract', function() {

  eq (typeof S.extract) ('function');
  eq (S.extract.length) (1);
  eq (S.show (S.extract)) ('extract :: Comonad w => w a -> a');

  eq (S.extract (Identity (42))) (42);

});
