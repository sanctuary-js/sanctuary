'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lt_', function() {

  eq(typeof S.lt_, 'function');
  eq(S.lt_.length, 2);
  eq(S.lt_.toString(), 'lt_ :: Ord a => a -> a -> Boolean');

  eq(S.lt_(0, 0), false);
  eq(S.lt_(0, -0), false);
  eq(S.lt_(-0, 0), false);
  eq(S.lt_(-0, -0), false);
  eq(S.lt_(0, 1), true);
  eq(S.lt_(1, 0), false);
  eq(S.lt_(0, -1), false);
  eq(S.lt_(-1, 0), true);
  eq(S.lt_('a', 'a'), false);
  eq(S.lt_('a', 'z'), true);
  eq(S.lt_('z', 'a'), false);
  eq(S.lt_(new Date(0), new Date(0)), false);
  eq(S.lt_(new Date(0), new Date(1)), true);
  eq(S.lt_(new Date(1), new Date(0)), false);

});
