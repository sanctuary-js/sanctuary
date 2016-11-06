'use strict';

var throws = require('assert').throws;

var S = require('..');

var area = require('./internal/area');
var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


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

});
