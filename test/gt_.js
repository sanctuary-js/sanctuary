'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gt_', function() {

  eq(typeof S.gt_, 'function');
  eq(S.gt_.length, 2);
  eq(S.gt_.toString(), 'gt_ :: Ord a => a -> a -> Boolean');

  eq(S.gt_(0, 1), false);
  eq(S.gt_(1, 1), false);
  eq(S.gt_(2, 1), true);

  eq(S.gt_(S.Just(0), S.Just(1)), false);
  eq(S.gt_(S.Just(1), S.Just(1)), false);
  eq(S.gt_(S.Just(2), S.Just(1)), true);

});
