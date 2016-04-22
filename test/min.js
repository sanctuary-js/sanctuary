'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('min', function() {

  it('is a binary function', function() {
    eq(typeof S.min, 'function');
    eq(S.min.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.min(/x/); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'min :: Ord a => a -> a -> a\n' +
                   '       ^^^^^    ^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  /x/ :: RegExp\n' +
                   '\n' +
                   '‘min’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.min(NaN); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'min :: Ord a => a -> a -> a\n' +
                   '       ^^^^^    ^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  NaN :: Number\n' +
                   '\n' +
                   '‘min’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.min(new Date('XXX')); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'min :: Ord a => a -> a -> a\n' +
                   '       ^^^^^    ^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  new Date(NaN) :: Date\n' +
                   '\n' +
                   '‘min’ requires ‘a’ to satisfy the Ord type-class constraint; the value at position 1 does not.\n'));
  });

  it('can be applied to (valid) numbers', function() {
    eq(S.min(10, 2), 2);
    eq(S.min(2, 10), 2);
    eq(S.min(0.1, 0.01), 0.01);
    eq(S.min(0.01, 0.1), 0.01);
    eq(S.min(Infinity, -Infinity), -Infinity);
    eq(S.min(-Infinity, Infinity), -Infinity);
  });

  it('can be applied to (valid) dates', function() {
    eq(S.min(new Date(10), new Date(2)), new Date(2));
    eq(S.min(new Date(2), new Date(10)), new Date(2));
  });

  it('can be applied to strings', function() {
    eq(S.min('abc', 'xyz'), 'abc');
    eq(S.min('xyz', 'abc'), 'abc');
    eq(S.min('10', '2'), '10');
    eq(S.min('2', '10'), '10');
    eq(S.min('A', 'a'), 'A');
    eq(S.min('a', 'A'), 'A');
  });

  it('is curried', function() {
    eq(S.min(10).length, 1);
    eq(S.min(10)(2), 2);
  });

});
