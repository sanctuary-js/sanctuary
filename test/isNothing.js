'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('isNothing', function() {

  eq(typeof S.isNothing, 'function');
  eq(S.isNothing.length, 1);

  throws(function() { S.isNothing([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'isNothing :: Maybe a -> Boolean\n' +
         '             ^^^^^^^\n' +
         '                1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Maybe a’.\n');

  eq(S.isNothing(S.Nothing), true);
  eq(S.isNothing(S.Just(42)), false);

});
