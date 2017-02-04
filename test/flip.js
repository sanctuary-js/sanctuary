'use strict';

var S = require('..');

var eq = require('./internal/eq');
var map = require('./internal/map');


test('flip', function() {

  eq(typeof S.flip, 'function');
  eq(S.flip.length, 3);
  eq(S.flip.toString(), 'flip :: ((a, b) -> c) -> b -> a -> c');

  eq(map(S.flip(Math.pow, 2))([1, 2, 3, 4, 5]), [1, 4, 9, 16, 25]);
  eq(S.flip(S.indexOf, ['a', 'b', 'c', 'd'], 'c'), S.Just(2));

});
