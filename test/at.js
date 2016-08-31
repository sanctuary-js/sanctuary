'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('at', function() {

  it('is a binary function', function() {
    eq(typeof S.at, 'function');
    eq(S.at.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.at(0.5); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'at :: Integer -> List a -> Maybe a\n' +
                   '      ^^^^^^^\n' +
                   '         1\n' +
                   '\n' +
                   '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Integer’.\n'));

    throws(function() { S.at(0, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'at :: Integer -> List a -> Maybe a\n' +
                   '                 ^^^^^^\n' +
                   '                   1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Just the nth element of a list', function() {
    eq(S.at(1, ['foo', 'bar', 'baz']), S.Just('bar'));
  });

  it('accepts negative offset', function() {
    eq(S.at(-1, ['foo', 'bar', 'baz']), S.Just('baz'));
  });

  it('returns Nothing if index out of bounds', function() {
    eq(S.at(3, ['foo', 'bar', 'baz']), S.Nothing);
    eq(S.at(-4, ['foo', 'bar', 'baz']), S.Nothing);
    eq(S.at(-0, ['foo', 'bar', 'baz']), S.Nothing);
  });

  it('is curried', function() {
    eq(S.at(1).length, 1);
    eq(S.at(1)(['foo', 'bar', 'baz']), S.Just('bar'));
  });

});
