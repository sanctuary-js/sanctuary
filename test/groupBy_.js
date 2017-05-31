'use strict';

var jsc = require('jsverify');

var S = require('..');

var eq = require('./internal/eq');


test('groupBy_', function() {

  eq(typeof S.groupBy_, 'function');
  eq(S.groupBy_.length, 2);
  eq(S.groupBy_.toString(), 'groupBy_ :: ((a, a) -> Boolean) -> Array a -> Array (Array a)');

  function productsOf3(a, b) {
    return a * b % 3 === 0;
  }

  function zeroSum(x, y) {
    return x + y === 0;
  }

  eq(S.groupBy_(productsOf3)([]), []);
  eq(S.groupBy_(productsOf3)([1, 2, 3, 4, 5, 6, 7, 8, 9]), [[1], [2, 3], [4], [5, 6], [7], [8, 9]]);
  eq(S.groupBy_(S.equals, [1, 1, 2, 1, 1]), [[1, 1], [2], [1, 1]]);
  eq(S.groupBy_(zeroSum)([2, -3, 3, 3, 3, 4, -4, 4]), [[2], [-3, 3, 3, 3], [4, -4], [4]]);

  jsc.assert(jsc.forall('nat -> nat -> bool', 'array nat', function(f, xs) {
    return S.equals(S.join(S.groupBy_(function(x, y) { return f(x)(y); }, xs)),
                    xs);
  }), {tests: 100});

});
