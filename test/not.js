'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('not', function() {

  eq(typeof S.not, 'function');
  eq(S.not.length, 1);

  eq(S.not(false), true);
  eq(S.not(true), false);
  eq(S.not(new Boolean(false)), true);
  eq(S.not(new Boolean(true)), false);

  throws(function() { S.not(0); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'not :: Boolean -> Boolean\n' +
         '       ^^^^^^^\n' +
         '          1\n' +
         '\n' +
         '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Boolean’.\n');

});
