'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('drop', function() {

  it('is a binary function', function() {
    eq(typeof S.drop, 'function');
    eq(S.drop.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.drop(0.5); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'drop :: Integer -> List a -> Maybe (List a)\n' +
                   '        ^^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Integer’.\n'));

    throws(function() { S.drop(0, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'drop :: Integer -> List a -> Maybe (List a)\n' +
                   '                   ^^^^^^\n' +
                   '                     1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Nothing if n is greater than collection length', function() {
    eq(S.drop(6, ['a', 'b', 'c', 'd', 'e']), S.Nothing);
    eq(S.drop(6, 'abcde'), S.Nothing);
  });

  it('returns Nothing if n is negative', function() {
    eq(S.drop(-3, ['a', 'b', 'c', 'd', 'e']), S.Nothing);
    eq(S.drop(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing);
    eq(S.drop(-3, 'abcde'), S.Nothing);
    eq(S.drop(-0, 'abcde'), S.Nothing);
    eq(S.drop(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing);
  });

  it('returns an empty collection if n is equal to collection length', function() {
    eq(S.drop(5, ['a', 'b', 'c', 'd', 'e']), S.Just([]));
    eq(S.drop(5, 'abcde'), S.Just(''));
  });

  it('returns Just the last three elements from the collection', function() {
    eq(S.drop(2, ['a', 'b', 'c', 'd', 'e']), S.Just(['c', 'd', 'e']));
    eq(S.drop(4, 'abcdefg'), S.Just('efg'));
  });

  it('returns Just the whole collection if n is zero', function() {
    eq(S.drop(0, ['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b', 'c', 'd', 'e']));
    eq(S.drop(0, 'abcdefg'), S.Just('abcdefg'));
  });

  it('is curried', function() {
    eq(S.drop(3).length, 1);
    eq(S.drop(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['d', 'e']));
  });

});
