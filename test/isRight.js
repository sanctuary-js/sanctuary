'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('isRight', function() {

  eq(typeof S.isRight, 'function');
  eq(S.isRight.length, 1);

  throws(function() { S.isRight([1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'isRight :: Either a b -> Boolean\n' +
                 '           ^^^^^^^^^^\n' +
                 '               1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Either a b’.\n'));

  eq(S.isRight(S.Left(42)), false);
  eq(S.isRight(S.Right(42)), true);

});
