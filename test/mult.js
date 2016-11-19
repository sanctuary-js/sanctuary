'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('mult', function() {

  eq(typeof S.mult, 'function');
  eq(S.mult.length, 2);

  throws(function() { S.mult('xxx', 2); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'mult :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                 '        ^^^^^^^^^^^^\n' +
                 '             1\n' +
                 '\n' +
                 '1)  "xxx" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

  throws(function() { S.mult(2, 'xxx'); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'mult :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                 '                        ^^^^^^^^^^^^\n' +
                 '                             1\n' +
                 '\n' +
                 '1)  "xxx" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

  throws(function() { S.mult(2, Infinity); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'mult :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                 '                        ^^^^^^^^^^^^\n' +
                 '                             1\n' +
                 '\n' +
                 '1)  Infinity :: Number, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

  throws(function() { S.mult(2, -Infinity); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'mult :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                 '                        ^^^^^^^^^^^^\n' +
                 '                             1\n' +
                 '\n' +
                 '1)  -Infinity :: Number, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

  eq(S.mult(4, 2), 8);
  eq(S.mult(4, -2), -8);
  eq(S.mult(-4, -2), 8);
  eq(S.mult(1.5, 3), 4.5);
  eq(S.mult(-1.5, 3), -4.5);
  eq(S.mult(-1.5, -3), 4.5);

});
