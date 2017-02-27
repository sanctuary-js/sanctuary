'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('takeWhile', function() {

  eq(typeof S.takeWhile, 'function');
  eq(S.takeWhile.length, 2);
  eq(S.takeWhile.toString(), 'takeWhile :: (Foldable f, Alternative f) => (a -> Boolean) -> f a -> f a');

  eq(S.takeWhile(S.odd, [3, 3, 3, 7, 6, 3, 5, 4]), [3, 3, 3, 7]);
  eq(S.takeWhile(S.even, [3, 3, 3, 7, 6, 3, 5, 4]), []);
  eq(S.takeWhile(S.odd, []), []);

  eq(S.takeWhile(S.odd, S.Just(1)), S.Just(1));
  eq(S.takeWhile(S.even, S.Just(1)), S.Nothing);
  eq(S.takeWhile(S.odd, S.Nothing), S.Nothing);

});
