'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gt_', function() {

  eq(typeof S.gt_, 'function');
  eq(S.gt_.length, 2);
  eq(S.gt_.toString(), 'gt_ :: Ord a => a -> a -> Boolean');

  eq(S.gt_(0, 0), false);
  eq(S.gt_(0, -0), false);
  eq(S.gt_(-0, 0), false);
  eq(S.gt_(-0, -0), false);
  eq(S.gt_(0, 1), false);
  eq(S.gt_(1, 0), true);
  eq(S.gt_(0, -1), true);
  eq(S.gt_(-1, 0), false);
  eq(S.gt_('a', 'a'), false);
  eq(S.gt_('a', 'z'), false);
  eq(S.gt_('z', 'a'), true);
  eq(S.gt_(new Date(0), new Date(0)), false);
  eq(S.gt_(new Date(0), new Date(1)), false);
  eq(S.gt_(new Date(1), new Date(0)), true);

});
