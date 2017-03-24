'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('sortBy', function() {

  eq(typeof S.sortBy, 'function');
  eq(S.sortBy.length, 2);
  eq(S.sortBy.toString(), 'sortBy :: (Applicative f, Foldable f, Monoid f) => (a -> a -> Ordering) -> f a -> f a');

  eq(S.sortBy(S.compare, []), []);
  eq(S.sortBy(S.compare, [4, 2, 7, 5]), [2, 4, 5, 7]);

});
