'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('isJust', function() {

  it('is a unary function', function() {
    eq(typeof S.isJust, 'function');
    eq(S.isJust.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.isJust([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'isJust :: Maybe a -> Boolean\n' +
                   '          ^^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));
  });

  it('returns true when applied to a Just', function() {
    eq(S.isJust(S.Just(42)), true);
  });

  it('returns false when applied to Nothing', function() {
    eq(S.isJust(S.Nothing), false);
  });

});
