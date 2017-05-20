'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lte', function() {

  eq(typeof S.lte, 'function');
  eq(S.lte.length, 2);
  eq(S.lte.toString(), 'lte :: Ord a => a -> a -> Boolean');

  eq(S.lte(0, 0), true);
  eq(S.lte(0, -0), true);
  eq(S.lte(-0, 0), true);
  eq(S.lte(-0, -0), true);
  eq(S.lte(0, 1), false);
  eq(S.lte(1, 0), true);
  eq(S.lte(0, -1), true);
  eq(S.lte(-1, 0), false);
  eq(S.lte('a', 'a'), true);
  eq(S.lte('a', 'z'), false);
  eq(S.lte('z', 'a'), true);
  eq(S.lte(new Date(0), new Date(0)), true);
  eq(S.lte(new Date(0), new Date(1)), false);
  eq(S.lte(new Date(1), new Date(0)), true);

});
