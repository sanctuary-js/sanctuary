'use strict';

var assert = require('assert');
var throws = assert.throws;

var area = require('./utils').area;
var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var highArity = require('./utils').highArity;
var S = require('..');


describe('encase3', function() {

  it('is a quaternary function', function() {
    eq(typeof S.encase3, 'function');
    eq(S.encase3.length, 4);
  });

  it('type checks its arguments', function() {
    throws(function() { S.encase3([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'encase3 :: Function -> a -> b -> c -> Maybe d\n' +
                   '           ^^^^^^^^\n' +
                   '              1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('returns a Just on success', function() {
    eq(S.encase3(area, 3, 4, 5), S.Just(6));
  });

  it('returns Nothing on failure', function() {
    eq(S.encase3(area, 2, 2, 5), S.Nothing);
  });

  it('can be applied to a function of arbitrary arity', function() {
    eq(S.encase3(S.K(highArity), 0, 0, 42), S.Just(42));
  });

});
