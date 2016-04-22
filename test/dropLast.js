'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('dropLast', function() {

  it('is a binary function', function() {
    eq(typeof S.dropLast, 'function');
    eq(S.dropLast.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.dropLast(0.5); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'dropLast :: Integer -> List a -> Maybe (List a)\n' +
                   '            ^^^^^^^\n' +
                   '               1\n' +
                   '\n' +
                   '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Integer’.\n'));

    throws(function() { S.dropLast(0, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'dropLast :: Integer -> List a -> Maybe (List a)\n' +
                   '                       ^^^^^^\n' +
                   '                         1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns a Nothing if n is negative', function() {
    eq(S.dropLast(-3, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
    eq(S.dropLast(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
    eq(S.dropLast(-3, 'abcde'), S.Nothing());
    eq(S.dropLast(-0, 'abcde'), S.Nothing());
    eq(S.dropLast(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing());
  });

  it('returns a Just dropping the last n items for valid n; Nothing otherwise', function() {
    eq(S.dropLast(4, ['a', 'b', 'c']), S.Nothing());
    eq(S.dropLast(3, ['a', 'b', 'c']), S.Just([]));
    eq(S.dropLast(2, ['a', 'b', 'c']), S.Just(['a']));
    eq(S.dropLast(1, ['a', 'b', 'c']), S.Just(['a', 'b']));
    eq(S.dropLast(0, ['a', 'b', 'c']), S.Just(['a', 'b', 'c']));
    eq(S.dropLast(4, 'abc'), S.Nothing());
    eq(S.dropLast(3, 'abc'), S.Just(''));
    eq(S.dropLast(2, 'abc'), S.Just('a'));
    eq(S.dropLast(1, 'abc'), S.Just('ab'));
    eq(S.dropLast(0, 'abc'), S.Just('abc'));
  });

  it('is curried', function() {
    eq(S.dropLast(3).length, 1);
    eq(S.dropLast(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b']));
  });

});
