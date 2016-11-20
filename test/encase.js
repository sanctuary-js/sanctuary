'use strict';

var S = require('..');

var eq = require('./internal/eq');
var factorial = require('./internal/factorial');
var throws = require('./internal/throws');


test('encase', function() {

  eq(typeof S.encase, 'function');
  eq(S.encase.length, 2);

  throws(function() { S.encase([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'encase :: Function -> a -> Maybe b\n' +
         '          ^^^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(S.encase(factorial, 5), S.Just(120));
  eq(S.encase(factorial, -1), S.Nothing);

});
