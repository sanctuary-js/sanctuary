'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('reduce', function() {

  eq(typeof S.reduce, 'function');
  eq(S.reduce.length, 3);
  eq(S.reduce.toString(), 'reduce :: Foldable f => (a -> b -> a) -> a -> f b -> a');

  eq(S.reduce(S.add, 0, []), 0);
  eq(S.reduce(S.add, 0, [1, 2, 3, 4, 5]), 15);
  eq(S.reduce(S.add, 10, S.Just(5)), 15);
  eq(S.reduce(S.lift2(S.add), S.Just(0), [S.Just(1), S.Just(2), S.Just(3), S.Just(4), S.Just(5)]), S.Just(15));

});
