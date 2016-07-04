'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gte_', function() {

  eq(typeof S.gte_, 'function');
  eq(S.gte_.length, 2);
  eq(S.gte_.toString(), 'gte_ :: Ord a => a -> a -> Boolean');

  eq(S.gte_(0, 0), true);
  eq(S.gte_(0, -0), true);
  eq(S.gte_(-0, 0), true);
  eq(S.gte_(-0, -0), true);
  eq(S.gte_(0, 1), false);
  eq(S.gte_(1, 0), true);
  eq(S.gte_(0, -1), true);
  eq(S.gte_(-1, 0), false);
  eq(S.gte_('a', 'a'), true);
  eq(S.gte_('a', 'z'), false);
  eq(S.gte_('z', 'a'), true);
  eq(S.gte_(new Date(0), new Date(0)), true);
  eq(S.gte_(new Date(0), new Date(1)), false);
  eq(S.gte_(new Date(1), new Date(0)), true);

});
