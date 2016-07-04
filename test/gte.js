'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gte', function() {

  eq(typeof S.gte, 'function');
  eq(S.gte.length, 2);
  eq(S.gte.toString(), 'gte :: Ord a => a -> a -> Boolean');

  eq(S.gte(0, 0), true);
  eq(S.gte(0, -0), true);
  eq(S.gte(-0, 0), true);
  eq(S.gte(-0, -0), true);
  eq(S.gte(0, 1), true);
  eq(S.gte(1, 0), false);
  eq(S.gte(0, -1), false);
  eq(S.gte(-1, 0), true);
  eq(S.gte('a', 'a'), true);
  eq(S.gte('a', 'z'), true);
  eq(S.gte('z', 'a'), false);
  eq(S.gte(new Date(0), new Date(0)), true);
  eq(S.gte(new Date(0), new Date(1)), true);
  eq(S.gte(new Date(1), new Date(0)), false);

});
