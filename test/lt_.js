'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lt_', function() {

  eq(typeof S.lt_, 'function');
  eq(S.lt_.length, 2);
  eq(S.lt_.toString(), 'lt_ :: Ord a => a -> a -> Boolean');

  eq(S.lt_(0, 1), true);
  eq(S.lt_(1, 1), false);
  eq(S.lt_(2, 1), false);

  eq(S.lt_(S.Just(0), S.Just(1)), true);
  eq(S.lt_(S.Just(1), S.Just(1)), false);
  eq(S.lt_(S.Just(2), S.Just(1)), false);

});
