'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('head', function() {

  it('is a unary function', function() {
    eq(typeof S.head, 'function');
    eq(S.head.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.head({length: -1}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'head :: List a -> Maybe a\n' +
                   '        ^^^^^^\n' +
                   '          1\n' +
                   '\n' +
                   '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Nothing if applied to empty list', function() {
    eq(S.head([]), S.Nothing);
  });

  it('returns Just the head of a nonempty list', function() {
    eq(S.head(['foo', 'bar', 'baz']), S.Just('foo'));
  });

});
