'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('reduce', function() {

  it('is a ternary function', function() {
    eq(typeof S.reduce, 'function');
    eq(S.reduce.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.reduce('xxx'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'reduce :: Foldable b => Function -> a -> b -> a\n' +
                   '                        ^^^^^^^^\n' +
                   '                           1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('folds over lists with the supplied accumulator', function() {
    eq(S.reduce(S.add, 0, [1, 2, 3, 4, 5]), 15);
    eq(S.reduce(S.add, 0, []), 0);
    eq(S.reduce(S.lift2(S.add), S.Just(0),
                [S.Just(1), S.Just(2), S.Just(3), S.Just(4), S.Just(5)]),
       S.Just(15));
  });

  it('dispatches to a "reduce" method if present', function() {
    eq(S.reduce(S.add, 10, S.Just(5)), 15);
  });

  it('is curried', function() {
    eq(S.reduce(S.add).length, 2);
    eq(S.reduce(S.add)(0).length, 1);
    eq(S.reduce(S.add)(0)([1, 2, 3, 4, 5]), 15);
  });

});
