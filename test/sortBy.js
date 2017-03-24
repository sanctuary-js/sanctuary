'use strict';

var S = require('..');

var eq = require('./internal/eq');

test('sortBy', function() {
  function lower(a) {
    return function(b) {
      var aa = a.toLowerCase();
      var bb = b.toLowerCase();
      return aa < bb ? -1 : aa > bb ? 1 : a < b ? -1 : a > b ? 1 : 0;
    };
  }

  function increasingOrder(a) {
    return function(b) {
      return a < b ? -1 : 1;
    };
  }

  function decreasingOrder(a) {
    return function(b) {
      return b < a ? -1 : b > a ? 1 : 0;
    };
  }

  eq(typeof S.sortBy, 'function');
  eq(S.sortBy.length, 2);
  eq(S.sortBy.toString(), 'sortBy :: (a -> a -> Ordering) -> Array a -> Array a');

  eq(S.sortBy(increasingOrder)([]), []);
  eq(S.sortBy(increasingOrder)([4, 2, 7, 5]), [2, 4, 5, 7]);
  eq(S.sortBy(decreasingOrder)([2, 2, 3, 3]), [3, 3, 2, 2]);
  eq(S.sortBy(lower)(['alice', 'Carin', 'bob', 'Bob']), ['alice', 'Bob', 'bob', 'Carin']);

});
