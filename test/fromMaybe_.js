'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('fromMaybe_', function() {

  eq(typeof S.fromMaybe_, 'function');
  eq(S.fromMaybe_.length, 2);

  throws(function() { S.fromMaybe_(0); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'fromMaybe_ :: Function -> Maybe a -> a\n' +
         '              ^^^^^^^^\n' +
         '                 1\n' +
         '\n' +
         '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.fromMaybe_(R.always(0), [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'fromMaybe_ :: Function -> Maybe a -> a\n' +
         '                          ^^^^^^^\n' +
         '                             1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Maybe a’.\n');

  eq(S.fromMaybe_(R.always(0), S.Nothing), 0);
  eq(S.fromMaybe_(R.always(0), S.Just(42)), 42);

  var count = 0;
  eq(S.fromMaybe_(function() { return count += 1; }, S.Just(42)), 42);
  eq(count, 0);

});
