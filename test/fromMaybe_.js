'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('fromMaybe_', function() {

  eq(typeof S.fromMaybe_, 'function');
  eq(S.fromMaybe_.length, 2);
  eq(S.fromMaybe_.toString(), 'fromMaybe_ :: (() -> a) -> Maybe a -> a');

  eq(S.fromMaybe_(function() { return 0; }, S.Nothing), 0);
  eq(S.fromMaybe_(function() { return 0; }, S.Just(42)), 42);

  var count = 0;
  eq(S.fromMaybe_(function() { return count += 1; }, S.Just(42)), 42);
  eq(count, 0);

});
