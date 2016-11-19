'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('odd', function() {

  eq(typeof S.odd, 'function');
  eq(S.odd.length, 1);

  throws(function() { S.odd(-0.5); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'odd :: Integer -> Boolean\n' +
                 '       ^^^^^^^\n' +
                 '          1\n' +
                 '\n' +
                 '1)  -0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  throws(function() { S.odd(-Infinity); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'odd :: Integer -> Boolean\n' +
                 '       ^^^^^^^\n' +
                 '          1\n' +
                 '\n' +
                 '1)  -Infinity :: Number, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  eq(S.odd(1), true);
  eq(S.odd(-1), true);
  eq(S.odd(new Number(1)), true);
  eq(S.odd(new Number(-1)), true);

  eq(S.odd(0), false);
  eq(S.odd(-0), false);
  eq(S.odd(2), false);
  eq(S.odd(-2), false);
  eq(S.odd(new Number(0)), false);
  eq(S.odd(new Number(-0)), false);
  eq(S.odd(new Number(2)), false);
  eq(S.odd(new Number(-2)), false);

});
