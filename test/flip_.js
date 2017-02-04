'use strict';

var S = require('..');

var eq = require('./internal/eq');
var map = require('./internal/map');


test('flip_', function() {

  eq(typeof S.flip_, 'function');
  eq(S.flip_.length, 3);
  eq(S.flip_.toString(), 'flip_ :: ((a, b) -> c) -> b -> a -> c');

  eq(map(S.flip_(Math.pow, 2))([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25]);
  eq(S.flip_(S.indexOf, ['a', 'b', 'c', 'd'], 'c'), S.Just(2));

});
