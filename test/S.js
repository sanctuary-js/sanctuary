'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('S', function() {

  eq(typeof S.S, 'function');
  eq(S.S.length, 3);
  eq(S.S.toString(), 'S :: (a -> b -> c) -> (a -> b) -> a -> c');

  eq(S.S(S.add, Math.sqrt, 100), 110);

});
