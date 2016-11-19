'use strict';

var throws = require('assert').throws;

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('maybe', function() {

  eq(typeof S.maybe, 'function');
  eq(S.maybe.length, 3);

  throws(function() { S.maybe(0, [1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'maybe :: b -> Function -> Maybe a -> b\n' +
                 '              ^^^^^^^^\n' +
                 '                 1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  throws(function() { S.maybe(0, R.length, [1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'maybe :: b -> Function -> Maybe a -> b\n' +
                 '                          ^^^^^^^\n' +
                 '                             1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Maybe a’.\n'));

  eq(S.maybe(0, R.length, S.Nothing), 0);
  eq(S.maybe(0, R.length, S.Just([1, 2, 3])), 3);

});
