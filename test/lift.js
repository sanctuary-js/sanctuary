'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('lift', function() {

  eq(typeof S.lift, 'function');
  eq(S.lift.length, 2);
  eq(S.lift.toString(), 'lift :: Functor f => (a -> b) -> f a -> f b');

  eq(S.lift(S.mult(2), S.Just(3)), S.Just(6));
  eq(S.lift(S.mult(2), S.Nothing), S.Nothing);

  eq(S.lift(S.mult(2), S.Left(3)), S.Left(3));
  eq(S.lift(S.mult(2), S.Right(3)), S.Right(6));

  eq(S.lift(S.mult(2), [1, 2, 3]), [2, 4, 6]);
  eq(S.lift(S.mult(2), []), []);

  eq(S.lift(S.not, S.even)(42), false);
  eq(S.lift(S.not, S.even)(43), true);

});
