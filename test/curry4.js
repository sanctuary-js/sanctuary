'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('curry4', function() {

  eq(typeof S.curry4, 'function');
  eq(S.curry4.length, 5);
  eq(S.curry4.toString(), 'curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e');

  var curried = S.curry4(function(w, x, y, z) { return w + x + y + z; });
  eq(curried(1, 2, 3, 4), 10);
  eq(curried(1, 2, 3)(4), 10);
  eq(curried(1, 2)(3, 4), 10);
  eq(curried(1, 2)(3)(4), 10);
  eq(curried(1)(2, 3, 4), 10);
  eq(curried(1)(2, 3)(4), 10);
  eq(curried(1)(2)(3, 4), 10);
  eq(curried(1)(2)(3)(4), 10);

});
