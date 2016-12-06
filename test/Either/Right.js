'use strict';

var S = require('../..');

var eq = require('../internal/eq');
var parseHex = require('../internal/parseHex');
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

    // Value-based equality:
    eq(S.Right(0).equals(S.Right(-0)), false);
    eq(S.Right(-0).equals(S.Right(0)), false);
    eq(S.Right(NaN).equals(S.Right(NaN)), true);
    eq(S.Right([1, 2, 3]).equals(S.Right([1, 2, 3])), true);
    eq(S.Right(new Number(42)).equals(S.Right(new Number(42))), true);
    eq(S.Right(new Number(42)).equals(42), false);
  });

  test('"extend" method', function() {
    eq(S.Right(42).extend.length, 1);
    eq(S.Right(42).extend(function(x) { return x.value / 2; }), S.Right(21));

    // associativity
    var w = S.Right(42);
    function f(x) { return x.value + 1; }
    function g(x) { return x.value * x.value; }
    eq(w.extend(g).extend(f), w.extend(function(_w) { return f(_w.extend(g)); }));

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

  test('Semigroup', function() {
    var a = S.Right('foo');
    var b = S.Right('bar');
    var c = S.Right('baz');

    // associativity
    eq(a.concat(b).concat(c).equals(a.concat(b.concat(c))), true);
  });

  test('Functor', function() {
    var a = S.Right(9);
    var f = S.inc;
    var g = Math.sqrt;

    // identity
    eq(a.map(S.I).equals(a), true);

    // composition
    eq(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)), true);
  });

  test('Apply', function() {
    var a = S.Right(S.inc);
    var b = S.Right(Math.sqrt);
    var c = S.Right(9);

    // composition
    eq(a.map(function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }).ap(b).ap(c).equals(a.ap(b.ap(c))), true);
  });

  test('Applicative', function() {
    var a = S.Right(null);
    var b = S.Right(S.inc);
    var f = S.inc;
    var x = 7;

    // identity
    eq(a.of(S.I).ap(b).equals(b), true);

    // homomorphism
    eq(a.of(f).ap(a.of(x)).equals(a.of(f(x))), true);

    // interchange
    eq(a.of(function(f) { return f(x); }).ap(b).equals(b.ap(a.of(x))), true);
  });

  test('Chain', function() {
    var a = S.Right('0x0100');
    var f = parseHex;
    var g = squareRoot;

    // associativity
    eq(a.chain(f).chain(g).equals(a.chain(function(x) { return f(x).chain(g); })), true);
  });

  test('Monad', function() {
    var a = S.Right(null);
    var f = squareRoot;
    var x = 25;

    // left identity
    eq(a.of(x).chain(f).equals(f(x)), true);

    // right identity
    eq(a.chain(a.of).equals(a), true);
  });

});
