'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('max', function() {

  eq(typeof S.max, 'function');
  eq(S.max.length, 2);

  throws(function() { S.max(/x/); },
         errorEq(TypeError,
                 'Type-class constraint violation\n' +
                 '\n' +
                 'max :: Ord a => a -> a -> a\n' +
                 '       ^^^^^    ^\n' +
                 '                1\n' +
                 '\n' +
                 '1)  /x/ :: RegExp\n' +
                 '\n' +
                 '‘max’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n'));

  throws(function() { S.max(NaN); },
         errorEq(TypeError,
                 'Type-class constraint violation\n' +
                 '\n' +
                 'max :: Ord a => a -> a -> a\n' +
                 '       ^^^^^    ^\n' +
                 '                1\n' +
                 '\n' +
                 '1)  NaN :: Number\n' +
                 '\n' +
                 '‘max’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n'));

  throws(function() { S.max(new Date('XXX')); },
         errorEq(TypeError,
                 'Type-class constraint violation\n' +
                 '\n' +
                 'max :: Ord a => a -> a -> a\n' +
                 '       ^^^^^    ^\n' +
                 '                1\n' +
                 '\n' +
                 '1)  new Date(NaN) :: Date\n' +
                 '\n' +
                 '‘max’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n'));

  eq(S.max(10, 2), 10);
  eq(S.max(2, 10), 10);
  eq(S.max(0.1, 0.01), 0.1);
  eq(S.max(0.01, 0.1), 0.1);
  eq(S.max(Infinity, -Infinity), Infinity);
  eq(S.max(-Infinity, Infinity), Infinity);

  eq(S.max(new Date(10), new Date(2)), new Date(10));
  eq(S.max(new Date(2), new Date(10)), new Date(10));

  eq(S.max('abc', 'xyz'), 'xyz');
  eq(S.max('xyz', 'abc'), 'xyz');
  eq(S.max('10', '2'), '2');
  eq(S.max('2', '10'), '2');
  eq(S.max('A', 'a'), 'a');
  eq(S.max('a', 'A'), 'a');

});
