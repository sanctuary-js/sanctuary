'use strict';

var S = require('../..');

var eq = require('../internal/eq');
var squareRoot = require('../internal/squareRoot');
var throws = require('../internal/throws');


suite('Left', function() {

  test('data constructor', function() {
    eq(typeof S.Left, 'function');
    eq(S.Left.length, 1);
    eq(S.Left(42)['@@type'], 'sanctuary/Either');
    eq(S.Left(42).constructor, S.Either);
    eq(S.Left(42).isLeft, true);
    eq(S.Left(42).isRight, false);
  });

  test('"ap" method', function() {
    eq(S.Left('abc').ap.length, 1);
    eq(S.Left('abc').ap(S.Left('xyz')), S.Left('abc'));
    eq(S.Left('abc').ap(S.Right(42)), S.Left('abc'));

    throws(function() { S.Left('abc').ap([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#ap :: Either a Function -> Either a b -> Either a c\n' +
           '                                  ^^^^^^^^^^\n' +
           '                                      1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Either a b’.\n');
  });

  test('"bimap" method', function() {
    eq(S.Left('abc').bimap.length, 2);
    eq(S.Left('abc').bimap(S.toUpper, S.inc), S.Left('ABC'));

    throws(function() { S.Left('abc').bimap(null, null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#bimap :: Either a b -> Function -> Function -> Either c d\n' +
           '                              ^^^^^^^^\n' +
           '                                 1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');

    throws(function() { S.Left('abc').bimap(S.toUpper, null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#bimap :: Either a b -> Function -> Function -> Either c d\n' +
           '                                          ^^^^^^^^\n' +
           '                                             1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"chain" method', function() {
    eq(S.Left('abc').chain.length, 1);
    eq(S.Left('abc').chain(squareRoot), S.Left('abc'));

    throws(function() { S.Left('abc').chain([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#chain :: Either a b -> Function -> Either a c\n' +
           '                              ^^^^^^^^\n' +
           '                                 1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"concat" method', function() {
    eq(S.Left('abc').concat.length, 1);
    eq(S.Left('abc').concat(S.Left('def')), S.Left('abcdef'));
    eq(S.Left('abc').concat(S.Right('xyz')), S.Right('xyz'));

    throws(function() { S.Left('abc').concat([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
           '                                                             ^^^^^^^^^^\n' +
           '                                                                 1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Either a b’.\n');

    throws(function() { S.Left(/xxx/).concat(null); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
           '                  ^^^^^^^^^^^                         ^\n' +
           '                                                      1\n' +
           '\n' +
           '1)  /xxx/ :: RegExp\n' +
           '\n' +
           '‘Either#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');

    throws(function() { S.Left([1, 2, 3]).concat(S.Left(/xxx/)); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
           '                  ^^^^^^^^^^^                                       ^\n' +
           '                                                                    1\n' +
           '\n' +
           '1)  /xxx/ :: RegExp\n' +
           '\n' +
           '‘Either#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');

    throws(function() { S.Left([1, 2, 3]).concat(S.Right(/xxx/)); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
           '                               ^^^^^^^^^^^                            ^\n' +
           '                                                                      1\n' +
           '\n' +
           '1)  /xxx/ :: RegExp\n' +
           '\n' +
           '‘Either#concat’ requires ‘b’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');
  });

  test('"equals" method', function() {
    eq(S.Left(42).equals.length, 1);
    eq(S.Left(42).equals(S.Left(42)), true);
    eq(S.Left(42).equals(S.Left('42')), false);
    eq(S.Left(42).equals(S.Right(42)), false);
    eq(S.Left(42).equals(null), false);
  });

  test('"extend" method', function() {
    eq(S.Left('abc').extend.length, 1);
    eq(S.Left('abc').extend(function(x) { return x / 2; }), S.Left('abc'));

    throws(function() { S.Left('abc').extend(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#extend :: Either a b -> Function -> Either a b\n' +
           '                               ^^^^^^^^\n' +
           '                                  1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"map" method', function() {
    eq(S.Left('abc').map.length, 1);
    eq(S.Left('abc').map(Math.sqrt), S.Left('abc'));

    throws(function() { S.Left('abc').map([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#map :: Either a b -> Function -> Either a c\n' +
           '                            ^^^^^^^^\n' +
           '                               1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"reduce" method', function() {
    eq(S.Left('abc').reduce.length, 2);
    eq(S.Left('abc').reduce(function(xs, x) { return xs.concat([x]); }, [42]), [42]);

    throws(function() { S.Left('abc').reduce(null, null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#reduce :: Either a b -> Function -> c -> c\n' +
           '                               ^^^^^^^^\n' +
           '                                  1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"sequence" method', function() {
    eq(S.Left('abc').sequence.length, 1);
    eq(S.Left('abc').sequence(S.Maybe.of), S.Just(S.Left('abc')));
  });

  test('"toString" method', function() {
    eq(S.Left('abc').toString.length, 0);
    eq(S.Left('abc').toString(), 'Left("abc")');
  });

  test('"inspect" method', function() {
    eq(S.Left('abc').inspect.length, 0);
    eq(S.Left('abc').inspect(), 'Left("abc")');
  });

});
