'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('drop', function() {

  eq(typeof S.drop, 'function');
  eq(S.drop.length, 2);
  eq(S.drop.toString(), 'drop :: Integer -> Array a -> Maybe (Array a)');

  eq(S.drop(0, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
  eq(S.drop(1, [1, 2, 3, 4, 5]), S.Just([2, 3, 4, 5]));
  eq(S.drop(2, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
  eq(S.drop(3, [1, 2, 3, 4, 5]), S.Just([4, 5]));
  eq(S.drop(4, [1, 2, 3, 4, 5]), S.Just([5]));
  eq(S.drop(5, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.drop(6, [1, 2, 3, 4, 5]), S.Nothing);

  eq(S.drop(-1, [1, 2, 3, 4, 5]), S.Nothing);

});
