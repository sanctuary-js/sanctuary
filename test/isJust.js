'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('isJust', function() {

  eq(typeof S.isJust, 'function');
  eq(S.isJust.length, 1);

  throws(function() { S.isJust([1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'isJust :: Maybe a -> Boolean\n' +
                 '          ^^^^^^^\n' +
                 '             1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Maybe a’.\n'));

  eq(S.isJust(S.Nothing), false);
  eq(S.isJust(S.Just(42)), true);

});
