'use strict';

var S = require('../..');

var eq = require('../internal/eq');
var parseHex = require('../internal/parseHex');
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

    // Value-based equality:
    eq(S.Left(0).equals(S.Left(-0)), false);
    eq(S.Left(-0).equals(S.Left(0)), false);
    eq(S.Left(NaN).equals(S.Left(NaN)), true);
    eq(S.Left([1, 2, 3]).equals(S.Left([1, 2, 3])), true);
    eq(S.Left(new Number(42)).equals(S.Left(new Number(42))), true);
    eq(S.Left(new Number(42)).equals(42), false);
  });

  test('"extend" method', function() {
    eq(S.Left('abc').extend.length, 1);
    eq(S.Left('abc').extend(function(x) { return x / 2; }), S.Left('abc'));

    // associativity
    var w = S.Left('abc');
    function f(x) { return x.value + 1; }
    function g(x) { return x.value * x.value; }
    eq(w.extend(g).extend(f), w.extend(function(_w) { return f(_w.extend(g)); }));

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

  test('Semigroup', function() {
    var a = S.Left('foo');
    var b = S.Left('bar');
    var c = S.Left('baz');

    // associativity
    eq(a.concat(b).concat(c).equals(a.concat(b.concat(c))), true);
  });

  test('Functor', function() {
    var a = S.Left('Cannot divide by zero');
    var f = S.inc;
    var g = Math.sqrt;

    // identity
    eq(a.map(S.I).equals(a), true);

    // composition
    eq(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)), true);
  });

  test('Apply', function() {
    var a = S.Left('Cannot divide by zero');
    var b = S.Left('Cannot divide by zero');
    var c = S.Left('Cannot divide by zero');

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
    var a = S.Left('Cannot divide by zero');
    var b = S.Left('Cannot divide by zero');
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
    var a = S.Left('Cannot divide by zero');
    var f = parseHex;
    var g = squareRoot;

    // associativity
    eq(a.chain(f).chain(g).equals(a.chain(function(x) { return f(x).chain(g); })), true);
  });

  test('Monad', function() {
    var a = S.Left('Cannot divide by zero');
    var f = squareRoot;
    var x = 25;

    // left identity
    eq(a.of(x).chain(f).equals(f(x)), true);

    // right identity
    eq(a.chain(a.of).equals(a), true);
  });

});
