'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('find', function() {

  it('is a binary function', function() {
    eq(typeof S.find, 'function');
    eq(S.find.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.find([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'find :: Function -> Array a -> Maybe a\n' +
                   '        ^^^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.find(R.T, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'find :: Function -> Array a -> Maybe a\n' +
                   '                    ^^^^^^^\n' +
                   '                       1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array a’.\n'));
  });

  it('returns Just the first element satisfying the predicate', function() {
    eq(S.find(R.T, [null]), S.Just(null));
    eq(S.find(function(n) { return n >= 0; }, [-1, 0, 1]), S.Just(0));
  });

  it('returns Nothing if no element satisfies the predicate', function() {
    eq(S.find(R.T, []), S.Nothing);
    eq(S.find(R.F, [1, 2, 3]), S.Nothing);
  });

});
