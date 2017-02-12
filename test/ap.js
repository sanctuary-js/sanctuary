'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('ap', function() {

  eq(typeof S.ap, 'function');
  eq(S.ap.length, 2);
  eq(S.ap.toString(), 'ap :: Apply f => f (a -> b) -> f a -> f b');

  eq(S.ap([], []), []);
  eq(S.ap([], [1, 2, 3]), []);
  eq(S.ap([S.inc], []), []);
  eq(S.ap([S.inc], [1, 2, 3]), [2, 3, 4]);
  eq(S.ap([S.dec, Math.sqrt], [1, 4, 9]), [0, 3, 8, 1, 2, 3]);
  eq(S.ap(S.Nothing, S.Nothing), S.Nothing);
  eq(S.ap(S.Nothing, S.Just(9)), S.Nothing);
  eq(S.ap(S.Just(Math.sqrt), S.Nothing), S.Nothing);
  eq(S.ap(S.Just(Math.sqrt), S.Just(9)), S.Just(3));

});
