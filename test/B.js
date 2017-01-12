'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('B', function() {

  eq(typeof S.B, 'function');
  eq(S.B.length, 3);
  eq(S.B.toString(), 'B :: (b -> c) -> (a -> b) -> a -> c');

  eq(S.B(S.mult(2), S.inc, 20), 42);

});
