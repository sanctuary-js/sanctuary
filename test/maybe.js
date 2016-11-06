'use strict';

var throws = require('assert').throws;

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('maybe', function() {

  it('is a ternary function', function() {
    eq(typeof S.maybe, 'function');
    eq(S.maybe.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.maybe(0, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'maybe :: b -> Function -> Maybe a -> b\n' +
                   '              ^^^^^^^^\n' +
                   '                 1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.maybe(0, R.length, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'maybe :: b -> Function -> Maybe a -> b\n' +
                   '                          ^^^^^^^\n' +
                   '                             1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));
  });

  it('can be applied to Nothing', function() {
    eq(S.maybe(0, R.length, S.Nothing), 0);
  });

  it('can be applied to a Just', function() {
    eq(S.maybe(0, R.length, S.Just([1, 2, 3])), 3);
  });

});
