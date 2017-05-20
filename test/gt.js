'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gt', function() {

  eq(typeof S.gt, 'function');
  eq(S.gt.length, 2);
  eq(S.gt.toString(), 'gt :: Ord a => a -> a -> Boolean');

  eq(S.gt(0, 0), false);
  eq(S.gt(0, -0), false);
  eq(S.gt(-0, 0), false);
  eq(S.gt(-0, -0), false);
  eq(S.gt(0, 1), true);
  eq(S.gt(1, 0), false);
  eq(S.gt(0, -1), false);
  eq(S.gt(-1, 0), true);
  eq(S.gt('a', 'a'), false);
  eq(S.gt('a', 'z'), true);
  eq(S.gt('z', 'a'), false);
  eq(S.gt(new Date(0), new Date(0)), false);
  eq(S.gt(new Date(0), new Date(1)), true);
  eq(S.gt(new Date(1), new Date(0)), false);

});
