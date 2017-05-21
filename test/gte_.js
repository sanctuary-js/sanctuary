'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('gte_', function() {

  eq(typeof S.gte_, 'function');
  eq(S.gte_.length, 2);
  eq(S.gte_.toString(), 'gte_ :: Ord a => a -> a -> Boolean');

  eq(S.gte_(0, 1), false);
  eq(S.gte_(1, 1), true);
  eq(S.gte_(2, 1), true);

  eq(S.gte_(S.Just(0), S.Just(1)), false);
  eq(S.gte_(S.Just(1), S.Just(1)), true);
  eq(S.gte_(S.Just(2), S.Just(1)), true);

});
