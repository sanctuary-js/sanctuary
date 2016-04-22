'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('flip', function() {

  it('is a ternary function', function() {
    eq(typeof S.flip, 'function');
    eq(S.flip.length, 3);
  });

  it('throws if applied to values of different types', function() {
    throws(function() { S.flip('wrong'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'flip :: Function -> b -> a -> c\n' +
                   '        ^^^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  "wrong" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it("flips a function's argument order", function() {
    eq(R.map(S.flip(Math.pow)(2), [1, 2, 3, 4, 5]), [1, 4, 9, 16, 25]);
    eq(S.flip(S.indexOf, ['a', 'b', 'c', 'd'], 'c'), S.Just(2));
  });

  it('is curried', function() {
    eq(S.flip(S.indexOf).length, 2);
    eq(S.flip(S.indexOf)(['a', 'b', 'c', 'd']).length, 1);
    eq(S.flip(S.indexOf)(['a', 'b', 'c', 'd'])('c'), S.Just(2));
  });

});
