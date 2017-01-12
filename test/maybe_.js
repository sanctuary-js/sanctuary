'use strict';

var S = require('..');

var eq = require('./internal/eq');
var factorial = require('./internal/factorial');


test('maybe_', function() {

  eq(typeof S.maybe_, 'function');
  eq(S.maybe_.length, 3);
  eq(S.maybe_.toString(), 'maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b');

  eq(S.maybe_(function() { return factorial(10); }, Math.sqrt, S.Nothing), 3628800);
  eq(S.maybe_(function() { return factorial(10); }, Math.sqrt, S.Just(9)), 3);

  var count = 0;
  eq(S.maybe_(function() { return count += 1; }, Math.sqrt, S.Just(9)), 3);
  eq(count, 0);

});
