'use strict';

var S = require('./internal/sanctuary');

var Identity = require('./internal/Identity');
var eq = require('./internal/eq');


test('extract', function() {

  eq(typeof S.extract, 'function');
  eq(S.extract.length, 1);
  eq(S.extract.toString(), 'extract :: Comonad w => w a -> a');

  eq(S.extract(Identity(42)), 42);

});
