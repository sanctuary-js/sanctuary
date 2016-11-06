'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('take', function() {

  it('is a binary function', function() {
    eq(typeof S.take, 'function');
    eq(S.take.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.take(0.5); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'take :: Integer -> List a -> Maybe (List a)\n' +
                   '        ^^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Integer’.\n'));

    throws(function() { S.take(0, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'take :: Integer -> List a -> Maybe (List a)\n' +
                   '                   ^^^^^^\n' +
                   '                     1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Nothing if n is greater than collection length', function() {
    eq(S.take(6, ['a', 'b', 'c', 'd', 'e']), S.Nothing);
    eq(S.take(6, 'abcde'), S.Nothing);
  });

  it('returns Nothing if n is negative', function() {
    eq(S.take(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing);
    eq(S.take(-1, ['a', 'b', 'c', 'd', 'e']), S.Nothing);
    eq(S.take(-0, 'abcdefg'), S.Nothing);
    eq(S.take(-1, 'abcde'), S.Nothing);
    eq(S.take(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing);
  });

  it('returns an empty collection if n is 0', function() {
    eq(S.take(0, ['a', 'b', 'c', 'd', 'e']), S.Just([]));
    eq(S.take(0, 'abcde'), S.Just(''));
  });

  it('returns Just the first two elements from the collection', function() {
    eq(S.take(2, ['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b']));
    eq(S.take(2, 'abcdefg'), S.Just('ab'));
  });

  it('returns Just the whole collection if n is equal to array length', function() {
    eq(S.take(5, ['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b', 'c', 'd', 'e']));
    eq(S.take(7, 'abcdefg'), S.Just('abcdefg'));
  });

});
