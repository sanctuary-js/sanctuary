'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lt', function() {

  eq(typeof S.lt, 'function');
  eq(S.lt.length, 2);
  eq(S.lt.toString(), 'lt :: Ord a => a -> a -> Boolean');

  eq(S.lt(0, 0), false);
  eq(S.lt(0, -0), false);
  eq(S.lt(-0, 0), false);
  eq(S.lt(-0, -0), false);
  eq(S.lt(0, 1), false);
  eq(S.lt(1, 0), true);
  eq(S.lt(0, -1), true);
  eq(S.lt(-1, 0), false);
  eq(S.lt('a', 'a'), false);
  eq(S.lt('a', 'z'), false);
  eq(S.lt('z', 'a'), true);
  eq(S.lt(new Date(0), new Date(0)), false);
  eq(S.lt(new Date(0), new Date(1)), false);
  eq(S.lt(new Date(1), new Date(0)), true);

});
