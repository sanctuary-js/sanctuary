'use strict';

var throws = require('assert').throws;

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('maybe_', function() {

  eq(typeof S.maybe_, 'function');
  eq(S.maybe_.length, 3);

  throws(function() { S.maybe_(0, R.length); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'maybe_ :: Function -> Function -> Maybe a -> b\n' +
                 '          ^^^^^^^^\n' +
                 '             1\n' +
                 '\n' +
                 '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  throws(function() { S.maybe_(R.always(0), [1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'maybe_ :: Function -> Function -> Maybe a -> b\n' +
                 '                      ^^^^^^^^\n' +
                 '                         1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  throws(function() { S.maybe_(R.always(0), R.length, [1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'maybe_ :: Function -> Function -> Maybe a -> b\n' +
                 '                                  ^^^^^^^\n' +
                 '                                     1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Maybe a’.\n'));

  eq(S.maybe_(R.always(0), R.length, S.Nothing), 0);
  eq(S.maybe_(R.always(0), R.length, S.Just([1, 2, 3])), 3);

  var count = 0;
  eq(S.maybe_(function() { return count += 1; }, Math.sqrt, S.Just(9)), 3);
  eq(count, 0);

});
