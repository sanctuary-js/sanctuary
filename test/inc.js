'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('inc', function() {

  eq(typeof S.inc, 'function');
  eq(S.inc.length, 1);

  throws(function() { S.inc('xxx'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'inc :: FiniteNumber -> FiniteNumber\n' +
         '       ^^^^^^^^^^^^\n' +
         '            1\n' +
         '\n' +
         '1)  "xxx" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  throws(function() { S.inc(Infinity); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'inc :: FiniteNumber -> FiniteNumber\n' +
         '       ^^^^^^^^^^^^\n' +
         '            1\n' +
         '\n' +
         '1)  Infinity :: Number, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  throws(function() { S.inc(-Infinity); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'inc :: FiniteNumber -> FiniteNumber\n' +
         '       ^^^^^^^^^^^^\n' +
         '            1\n' +
         '\n' +
         '1)  -Infinity :: Number, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  eq(S.inc(1), 2);
  eq(S.inc(-1), 0);
  eq(S.inc(1.5), 2.5);
  eq(S.inc(-1.5), -0.5);

});
