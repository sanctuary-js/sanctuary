'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('insertBy', function() {

  eq(typeof S.insertBy, 'function');
  eq(S.insertBy.length, 3);
  eq(S.insertBy.toString(), 'insertBy :: (Applicative f, Foldable f, Monoid f) => (a -> a -> Ordering) -> a -> f a -> f a');

  eq(S.insertBy(S.compare, 6, []), [6]);
  eq(S.insertBy(S.compare, 6, [4, 2, 7, 5]), [4, 2, 6, 7, 5]);

});
