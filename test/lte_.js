'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lte_', function() {

  eq(typeof S.lte_, 'function');
  eq(S.lte_.length, 2);
  eq(S.lte_.toString(), 'lte_ :: Ord a => a -> a -> Boolean');

  eq(S.lte_(0, 0), true);
  eq(S.lte_(0, -0), true);
  eq(S.lte_(-0, 0), true);
  eq(S.lte_(-0, -0), true);
  eq(S.lte_(0, 1), true);
  eq(S.lte_(1, 0), false);
  eq(S.lte_(0, -1), false);
  eq(S.lte_(-1, 0), true);
  eq(S.lte_('a', 'a'), true);
  eq(S.lte_('a', 'z'), true);
  eq(S.lte_('z', 'a'), false);
  eq(S.lte_(new Date(0), new Date(0)), true);
  eq(S.lte_(new Date(0), new Date(1)), true);
  eq(S.lte_(new Date(1), new Date(0)), false);

});
