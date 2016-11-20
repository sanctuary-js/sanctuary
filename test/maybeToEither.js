'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('maybeToEither', function() {

  eq(typeof S.maybeToEither, 'function');
  eq(S.maybeToEither.length, 2);

  throws(function() { S.maybeToEither('left', 1); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'maybeToEither :: a -> Maybe b -> Either a b\n' +
         '                      ^^^^^^^\n' +
         '                         1\n' +
         '\n' +
         '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Maybe b’.\n');

  eq(S.maybeToEither('error msg', S.Nothing), S.Left('error msg'));
  eq(S.maybeToEither('error msg', S.Just(42)), S.Right(42));

});
