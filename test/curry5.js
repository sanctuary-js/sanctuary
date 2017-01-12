'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('curry5', function() {

  eq(typeof S.curry5, 'function');
  eq(S.curry5.length, 6);
  eq(S.curry5.toString(), 'curry5 :: ((a, b, c, d, e) -> r) -> a -> b -> c -> d -> e -> r');

  var curried = S.curry5(function(v, w, x, y, z) { return v + w + x + y + z; });
  eq(curried(1, 2, 3, 4, 5), 15);
  eq(curried(1, 2, 3, 4)(5), 15);
  eq(curried(1, 2, 3)(4, 5), 15);
  eq(curried(1, 2, 3)(4)(5), 15);
  eq(curried(1, 2)(3, 4, 5), 15);
  eq(curried(1, 2)(3, 4)(5), 15);
  eq(curried(1, 2)(3)(4, 5), 15);
  eq(curried(1, 2)(3)(4)(5), 15);
  eq(curried(1)(2, 3, 4, 5), 15);
  eq(curried(1)(2, 3, 4)(5), 15);
  eq(curried(1)(2, 3)(4, 5), 15);
  eq(curried(1)(2, 3)(4)(5), 15);
  eq(curried(1)(2)(3, 4, 5), 15);
  eq(curried(1)(2)(3, 4)(5), 15);
  eq(curried(1)(2)(3)(4, 5), 15);
  eq(curried(1)(2)(3)(4)(5), 15);

});
