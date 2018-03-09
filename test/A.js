'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('A', function() {

  eq(typeof S.A, 'function');
  eq(S.A.length, 2);
  eq(S.A.toString(), 'A :: (a -> b) -> a -> b');

  eq(S.A(S.add(1), 1), 2);
  eq(S.A(Math.sqrt, 64), 8);

});
