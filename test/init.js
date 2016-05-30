'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('init', function() {

  it('is a unary function', function() {
    eq(typeof S.init, 'function');
    eq(S.init.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.init({length: -1}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'init :: List a -> Maybe (List a)\n' +
                   '        ^^^^^^\n' +
                   '          1\n' +
                   '\n' +
                   '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Nothing if applied to empty list', function() {
    eq(S.init([]), S.Nothing);
  });

  it('returns Just the initial elements of a nonempty list', function() {
    eq(S.init(['foo', 'bar', 'baz']), S.Just(['foo', 'bar']));
  });

});
