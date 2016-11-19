'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('even', function() {

  eq(typeof S.even, 'function');
  eq(S.even.length, 1);

  throws(function() { S.even(0.5); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'even :: Integer -> Boolean\n' +
                 '        ^^^^^^^\n' +
                 '           1\n' +
                 '\n' +
                 '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  throws(function() { S.even(Infinity); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'even :: Integer -> Boolean\n' +
                 '        ^^^^^^^\n' +
                 '           1\n' +
                 '\n' +
                 '1)  Infinity :: Number, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  eq(S.even(0), true);
  eq(S.even(-0), true);
  eq(S.even(2), true);
  eq(S.even(-2), true);
  eq(S.even(new Number(0)), true);
  eq(S.even(new Number(-0)), true);
  eq(S.even(new Number(2)), true);
  eq(S.even(new Number(-2)), true);

  eq(S.even(1), false);
  eq(S.even(-1), false);
  eq(S.even(new Number(1)), false);
  eq(S.even(new Number(-1)), false);

});
