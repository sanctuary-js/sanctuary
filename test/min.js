'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('min', function() {

  eq(typeof S.min, 'function');
  eq(S.min.length, 2);

  throws(function() { S.min(/x/); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'min :: Ord a => a -> a -> a\n' +
         '       ^^^^^    ^\n' +
         '                1\n' +
         '\n' +
         '1)  /x/ :: RegExp\n' +
         '\n' +
         '‘min’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n');

  throws(function() { S.min(NaN); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'min :: Ord a => a -> a -> a\n' +
         '       ^^^^^    ^\n' +
         '                1\n' +
         '\n' +
         '1)  NaN :: Number\n' +
         '\n' +
         '‘min’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n');

  throws(function() { S.min(new Date('XXX')); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'min :: Ord a => a -> a -> a\n' +
         '       ^^^^^    ^\n' +
         '                1\n' +
         '\n' +
         '1)  new Date(NaN) :: Date\n' +
         '\n' +
         '‘min’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n');

  eq(S.min(10, 2), 2);
  eq(S.min(2, 10), 2);
  eq(S.min(0.1, 0.01), 0.01);
  eq(S.min(0.01, 0.1), 0.01);
  eq(S.min(Infinity, -Infinity), -Infinity);
  eq(S.min(-Infinity, Infinity), -Infinity);

  eq(S.min(new Date(10), new Date(2)), new Date(2));
  eq(S.min(new Date(2), new Date(10)), new Date(2));

  eq(S.min('abc', 'xyz'), 'abc');
  eq(S.min('xyz', 'abc'), 'abc');
  eq(S.min('10', '2'), '10');
  eq(S.min('2', '10'), '10');
  eq(S.min('A', 'a'), 'A');
  eq(S.min('a', 'A'), 'A');

});
