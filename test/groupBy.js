'use strict';

var jsc = require ('jsverify');

var S = require ('..');

var eq = require ('./internal/eq');
var equals = require ('./internal/equals');


test ('groupBy', function() {

  eq (typeof S.groupBy) ('function');
  eq (S.groupBy.length) (1);
  eq (S.show (S.groupBy)) ('groupBy :: (a -> a -> Boolean) -> Array a -> Array (Array a)');

  function productsOf3(x) {
    return function(y) {
      return x * y % 3 === 0;
    };
  }

  function zeroSum(x) {
    return function(y) {
      return x + y === 0;
    };
  }

  eq (S.groupBy (productsOf3) ([])) ([]);
  eq (S.groupBy (productsOf3) ([1, 2, 3, 4, 5, 6, 7, 8, 9])) ([[1], [2, 3], [4], [5, 6], [7], [8, 9]]);
  eq (S.groupBy (equals) ([1, 1, 2, 1, 1])) ([[1, 1], [2], [1, 1]]);
  eq (S.groupBy (zeroSum) ([2, -3, 3, 3, 3, 4, -4, 4])) ([[2], [-3, 3, 3, 3], [4, -4], [4]]);

  jsc.assert (jsc.forall ('nat -> nat -> bool', 'array nat', function(f, xs) {
    var lhs = S.join (S.groupBy (f) (xs));
    var rhs = xs;
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
