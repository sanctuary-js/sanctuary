'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('lift', function() {

  eq(typeof S.lift, 'function');
  eq(S.lift.length, 2);

  throws(function() { S.lift('wrong'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'lift :: (Functor a, Functor b) => Function -> a -> b\n' +
         '                                  ^^^^^^^^\n' +
         '                                     1\n' +
         '\n' +
         '1)  "wrong" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(S.lift(S.mult(2), S.Just(3)), S.Just(6));
  eq(S.lift(S.mult(2), S.Nothing), S.Nothing);

  eq(S.lift(S.mult(2), S.Left(3)), S.Left(3));
  eq(S.lift(S.mult(2), S.Right(3)), S.Right(6));

  eq(S.lift(S.mult(2), [1, 2, 3]), [2, 4, 6]);
  eq(S.lift(S.mult(2), []), []);

  eq(S.lift(S.not, S.even)(42), false);
  eq(S.lift(S.not, S.even)(43), true);

});
