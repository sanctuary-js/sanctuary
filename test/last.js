'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('last', function() {

  it('is a unary function', function() {
    eq(typeof S.last, 'function');
    eq(S.last.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.last({length: -1}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'last :: List a -> Maybe a\n' +
                   '        ^^^^^^\n' +
                   '          1\n' +
                   '\n' +
                   '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Nothing if applied to empty list', function() {
    eq(S.last([]), S.Nothing);
  });

  it('returns Just the last element of a nonempty list', function() {
    eq(S.last(['foo', 'bar', 'baz']), S.Just('baz'));
  });

});
