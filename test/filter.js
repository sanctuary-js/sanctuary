'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('filter', function() {

  eq(typeof S.filter, 'function');
  eq(S.filter.length, 2);
  eq(S.filter.toString(), 'filter :: (Applicative f, Foldable f, Monoid f) => (a -> Boolean) -> f a -> f a');

  eq(S.filter(S.odd, []), []);
  eq(S.filter(S.odd, [0, 2, 4, 6, 8]), []);
  eq(S.filter(S.odd, [1, 3, 5, 7, 9]), [1, 3, 5, 7, 9]);
  eq(S.filter(S.odd, [1, 2, 3, 4, 5]), [1, 3, 5]);

});
