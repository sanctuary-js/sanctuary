'use strict';

var Z = require('sanctuary-type-classes');

var S = require('..');

var eq = require('./internal/eq');


test('A', function() {

  eq(typeof S.A, 'function');
  eq(S.A.length, 2);
  eq(S.A.toString(), 'A :: (a -> b) -> a -> b');

  eq(S.A(S.inc, 1), 2);
  eq(Z.map(S.A(S.__, 100), [S.inc, Math.sqrt]), [101, 10]);

});
