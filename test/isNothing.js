'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('isNothing', function() {

  it('is a unary function', function() {
    eq(typeof S.isNothing, 'function');
    eq(S.isNothing.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.isNothing([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'isNothing :: Maybe a -> Boolean\n' +
                   '             ^^^^^^^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));
  });

  it('returns true when applied to Nothing', function() {
    eq(S.isNothing(S.Nothing), true);
  });

  it('returns false when applied to a Just', function() {
    eq(S.isNothing(S.Just(42)), false);
  });

});
