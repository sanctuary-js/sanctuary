'use strict';

var S = require('../..');

var eq = require('../internal/eq');
var squareRoot = require('../internal/squareRoot');
var throws = require('../internal/throws');


suite('Right', function() {

  test('data constructor', function() {
    eq(typeof S.Right, 'function');
    eq(S.Right.length, 1);
    eq(S.Right(42)['@@type'], 'sanctuary/Either');
    eq(S.Right(42).constructor, S.Either);
    eq(S.Right(42).isLeft, false);
    eq(S.Right(42).isRight, true);
  });

  test('"ap" method', function() {
    eq(S.Right(S.inc).ap.length, 1);
    eq(S.Right(S.inc).ap(S.Left('abc')), S.Left('abc'));
    eq(S.Right(S.inc).ap(S.Right(42)), S.Right(43));

    throws(function() { S.Right(S.inc).ap([1, 2, 3]); },
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

  test('"chain" method', function() {
    eq(S.Right(25).chain.length, 1);
    eq(S.Right(25).chain(squareRoot), S.Right(5));

    throws(function() { S.Right(25).chain(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Either#chain :: Either a b -> Function -> Either a c\n' +
           '                              ^^^^^^^^\n' +
           '                                 1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"concat" method', function() {
    eq(S.Right('abc').concat.length, 1);
    eq(S.Right('abc').concat(S.Left('xyz')), S.Right('abc'));
    eq(S.Right('abc').concat(S.Right('def')), S.Right('abcdef'));

    throws(function() { S.Right('abc').concat([1, 2, 3]); },
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

    throws(function() { S.Right(/xxx/).concat(null); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
           '                               ^^^^^^^^^^^              ^\n' +
           '                                                        1\n' +
           '\n' +
           '1)  /xxx/ :: RegExp\n' +
           '\n' +
           '‘Either#concat’ requires ‘b’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');

    throws(function() { S.Right([1, 2, 3]).concat(S.Left(/xxx/)); },
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

    throws(function() { S.Right([1, 2, 3]).concat(S.Right(/xxx/)); },
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
    eq(S.Right(42).equals.length, 1);
    eq(S.Right(42).equals(S.Right(42)), true);
    eq(S.Right(42).equals(S.Right('42')), false);
    eq(S.Right(42).equals(S.Left(42)), false);
    eq(S.Right(42).equals(null), false);
  });

  test('"extend" method', function() {
    eq(S.Right(42).extend.length, 1);
    eq(S.Right(42).extend(function(x) { return x.value / 2; }), S.Right(21));

    throws(function() { S.Right('abc').extend(null); },
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
    eq(S.Right(9).map.length, 1);
    eq(S.Right(9).map(Math.sqrt), S.Right(3));

    throws(function() { S.Right(9).map([1, 2, 3]); },
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
    eq(S.Right(5).reduce.length, 2);
    eq(S.Right(5).reduce(function(xs, x) { return xs.concat([x]); }, [42]), [42, 5]);

    throws(function() { S.Right(5).reduce(null, null); },
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
    eq(S.Right(S.Just(42)).sequence.length, 1);
    eq(S.Right(S.Just(42)).sequence(S.Maybe.of), S.Just(S.Right(42)));
  });

  test('"toString" method', function() {
    eq(S.Right([1, 2, 3]).toString.length, 0);
    eq(S.Right([1, 2, 3]).toString(), 'Right([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(S.Right([1, 2, 3]).inspect.length, 0);
    eq(S.Right([1, 2, 3]).inspect(), 'Right([1, 2, 3])');
  });

});
