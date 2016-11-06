'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');
var rem = require('./internal/rem');


describe('encase2', function() {

  it('is a ternary function', function() {
    eq(typeof S.encase2, 'function');
    eq(S.encase2.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.encase2([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'encase2 :: Function -> a -> b -> Maybe c\n' +
                   '           ^^^^^^^^\n' +
                   '              1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('returns a Just on success', function() {
    eq(S.encase2(rem, 42, 5), S.Just(2));
  });

  it('returns Nothing on failure', function() {
    eq(S.encase2(rem, 42, 0), S.Nothing);
  });

});
