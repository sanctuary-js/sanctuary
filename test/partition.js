'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('partition', function() {

  eq(typeof S.partition, 'function');
  eq(S.partition.length, 2);
  eq(S.partition.toString(), 'partition :: (Applicative f, Foldable f, Semigroup f) => (a -> Either b c) -> f a -> Pair (f b) (f c)');

  eq(S.partition(S.tagBy(S.even), []), [[], []]);
  eq(S.partition(S.tagBy(S.even), [1, 2, 3, 4, 5]), [[1, 3, 5], [2, 4]]);

});
