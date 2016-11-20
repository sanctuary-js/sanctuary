'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('add', function() {

  eq(typeof S.add, 'function');
  eq(S.add.length, 2);

  throws(function() { S.add('xxx', 1); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
         '       ^^^^^^^^^^^^\n' +
         '            1\n' +
         '\n' +
         '1)  "xxx" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  throws(function() { S.add(1, 'xxx'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
         '                       ^^^^^^^^^^^^\n' +
         '                            1\n' +
         '\n' +
         '1)  "xxx" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  throws(function() { S.add(1, Infinity); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
         '                       ^^^^^^^^^^^^\n' +
         '                            1\n' +
         '\n' +
         '1)  Infinity :: Number, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  throws(function() { S.add(1, -Infinity); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
         '                       ^^^^^^^^^^^^\n' +
         '                            1\n' +
         '\n' +
         '1)  -Infinity :: Number, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘FiniteNumber’.\n');

  eq(S.add(1, 1), 2);
  eq(S.add(-1, -1), -2);
  eq(S.add(1.5, 1), 2.5);
  eq(S.add(-1.5, -1), -2.5);

});
