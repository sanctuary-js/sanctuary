'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('match', function() {

  it('is a binary function', function() {
    eq(typeof S.match, 'function');
    eq(S.match.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.match([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'match :: RegExp -> String -> Maybe (Array (Maybe String))\n' +
                   '         ^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘RegExp’.\n'));

    throws(function() { S.match(/(?:)/, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'match :: RegExp -> String -> Maybe (Array (Maybe String))\n' +
                   '                   ^^^^^^\n' +
                   '                     1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('returns a Just containing an array of Justs', function() {
    eq(S.match(/abcd/, 'abcdefg'), S.Just([S.Just('abcd')]));
  });

  it('supports global patterns', function() {
    eq(S.match(/[a-z]a/g, 'bananas'), S.Just([S.Just('ba'), S.Just('na'), S.Just('na')]));
  });

  it('supports (optional) capturing groups', function() {
    eq(S.match(/(good)?bye/, 'goodbye'), S.Just([S.Just('goodbye'), S.Just('good')]));
    eq(S.match(/(good)?bye/, 'bye'), S.Just([S.Just('bye'), S.Nothing]));
  });

  it('returns Nothing if no match', function() {
    eq(S.match(/zzz/, 'abcdefg'), S.Nothing);
  });

});
