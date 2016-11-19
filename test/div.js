'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('div', function() {

  eq(typeof S.div, 'function');
  eq(S.div.length, 2);

  throws(function() { S.div('xxx', 1); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber\n' +
                 '       ^^^^^^^^^^^^\n' +
                 '            1\n' +
                 '\n' +
                 '1)  "xxx" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

  throws(function() { S.div(1, 'xxx'); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber\n' +
                 '                       ^^^^^^^^^^^^^^^^^^^\n' +
                 '                                1\n' +
                 '\n' +
                 '1)  "xxx" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘NonZeroFiniteNumber’.\n'));

  throws(function() { S.div(1, 0); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber\n' +
                 '                       ^^^^^^^^^^^^^^^^^^^\n' +
                 '                                1\n' +
                 '\n' +
                 '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘NonZeroFiniteNumber’.\n'));

  throws(function() { S.div(1, -0); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber\n' +
                 '                       ^^^^^^^^^^^^^^^^^^^\n' +
                 '                                1\n' +
                 '\n' +
                 '1)  -0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘NonZeroFiniteNumber’.\n'));

  eq(S.div(8, 2), 4);
  eq(S.div(8, -2), -4);
  eq(S.div(-8, -2), 4);
  eq(S.div(1.5, 2), 0.75);
  eq(S.div(1.5, -2), -0.75);
  eq(S.div(-1.5, -2), 0.75);

});
