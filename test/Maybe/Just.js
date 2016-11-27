'use strict';

var R = require('ramda');

var S = require('../..');

var eq = require('../internal/eq');
var throws = require('../internal/throws');


suite('Just', function() {

  test('data constructor', function() {
    eq(typeof S.Just, 'function');
    eq(S.Just.length, 1);
    eq(S.Just(42)['@@type'], 'sanctuary/Maybe');
    eq(S.Just(42).constructor, S.Maybe);
    eq(S.Just(42).isNothing, false);
    eq(S.Just(42).isJust, true);
  });

  test('"ap" method', function() {
    eq(S.Just(S.inc).ap.length, 1);
    eq(S.Just(S.inc).ap(S.Nothing), S.Nothing);
    eq(S.Just(S.inc).ap(S.Just(42)), S.Just(43));

    throws(function() { S.Just(S.inc).ap([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#ap :: Maybe Function -> Maybe a -> Maybe b\n' +
           '                              ^^^^^^^\n' +
           '                                 1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Maybe a’.\n');
  });

  test('"chain" method', function() {
    eq(S.Just([1, 2, 3]).chain.length, 1);
    eq(S.Just([1, 2, 3]).chain(S.head), S.Just(1));

    throws(function() { S.Just([1, 2, 3]).chain([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#chain :: Maybe a -> Function -> Maybe b\n' +
           '                          ^^^^^^^^\n' +
           '                             1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"concat" method', function() {
    eq(S.Just('foo').concat.length, 1);
    eq(S.Just('foo').concat(S.Nothing), S.Just('foo'));
    eq(S.Just('foo').concat(S.Just('bar')), S.Just('foobar'));

    throws(function() { S.Just('foo').concat([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
           '                                          ^^^^^^^\n' +
           '                                             1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Maybe a’.\n');

    throws(function() { S.Just(1).concat(S.Just(0)); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
           '                ^^^^^^^^^^^          ^\n' +
           '                                     1\n' +
           '\n' +
           '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
           '\n' +
           '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');

    throws(function() { S.Just(2).concat(S.Just([1, 2, 3])); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
           '                ^^^^^^^^^^^          ^\n' +
           '                                     1\n' +
           '\n' +
           '1)  2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
           '\n' +
           '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');

    throws(function() { S.Just([1, 2, 3]).concat(S.Just(3)); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
           '                ^^^^^^^^^^^                     ^\n' +
           '                                                1\n' +
           '\n' +
           '1)  3 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
           '\n' +
           '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');
  });

  test('"equals" method', function() {
    eq(S.Just(42).equals.length, 1);
    eq(S.Just(42).equals(S.Just(42)), true);
    eq(S.Just(42).equals(S.Just(43)), false);
    eq(S.Just(42).equals(S.Nothing), false);
    eq(S.Just(42).equals(null), false);

    // Value-based equality:
    eq(S.Just(0).equals(S.Just(-0)), false);
    eq(S.Just(-0).equals(S.Just(0)), false);
    eq(S.Just(NaN).equals(S.Just(NaN)), true);
    eq(S.Just([1, 2, 3]).equals(S.Just([1, 2, 3])), true);
    eq(S.Just(new Number(42)).equals(S.Just(new Number(42))), true);
    eq(S.Just(new Number(42)).equals(42), false);
  });

  test('"extend" method', function() {
    eq(S.Just(42).extend.length, 1);
    eq(S.Just(42).extend(function(x) { return x.value / 2; }), S.Just(21));

    // associativity
    var w = S.Just(42);
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w.extend(g).extend(f), w.extend(function(_w) { return f(_w.extend(g)); }));

    throws(function() { S.Just(42).extend(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#extend :: Maybe a -> Function -> Maybe a\n' +
           '                           ^^^^^^^^\n' +
           '                              1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"filter" method', function() {
    eq(S.Just(42).filter.length, 1);
    eq(S.Just(42).filter(R.T), S.Just(42));
    eq(S.Just(42).filter(R.F), S.Nothing);
    eq(S.Just(42).filter(function(n) { return n > 0; }), S.Just(42));
    eq(S.Just(42).filter(function(n) { return n < 0; }), S.Nothing);

    var m = S.Just(-5);
    var f = function(n) { return n * n; };
    var p = function(n) { return n < 0; };
    var q = function(n) { return n > 0; };

    eq(m.map(f).filter(p).equals(m.filter(function(x) { return p(f(x)); }).map(f)), true);
    eq(m.map(f).filter(q).equals(m.filter(function(x) { return q(f(x)); }).map(f)), true);

    throws(function() { S.Just(42).filter(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#filter :: Maybe a -> Function -> Maybe a\n' +
           '                           ^^^^^^^^\n' +
           '                              1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"map" method', function() {
    eq(S.Just(42).map.length, 1);
    eq(S.Just(42).map(function(x) { return x / 2; }), S.Just(21));

    throws(function() { S.Just(42).map([1, 2, 3]); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#map :: Maybe a -> Function -> Maybe b\n' +
           '                        ^^^^^^^^\n' +
           '                           1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"reduce" method', function() {
    eq(S.Just(5).reduce.length, 2);
    eq(S.Just(5).reduce(function(a, b) { return a + b; }, 10), 15);

    throws(function() { S.Just(5).reduce(null, null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#reduce :: Maybe a -> Function -> b -> b\n' +
           '                           ^^^^^^^^\n' +
           '                              1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"sequence" method', function() {
    eq(S.Just(S.Right(42)).sequence.length, 1);
    eq(S.Just(S.Right(42)).sequence(S.Either.of), S.Right(S.Just(42)));
  });

  test('"toString" method', function() {
    eq(S.Just([1, 2, 3]).toString.length, 0);
    eq(S.Just([1, 2, 3]).toString(), 'Just([1, 2, 3])');
  });

  test('"inspect" method', function() {
    eq(S.Just([1, 2, 3]).inspect.length, 0);
    eq(S.Just([1, 2, 3]).inspect(), 'Just([1, 2, 3])');
  });

  test('Semigroup', function() {
    var a = S.Just('foo');
    var b = S.Just('bar');
    var c = S.Just('baz');

    // associativity
    eq(a.concat(b).concat(c).equals(a.concat(b.concat(c))), true);
  });

  test('Monoid', function() {
    var a = S.Just([1, 2, 3]);

    // left identity
    eq(a.empty().concat(a).equals(a), true);

    // right identity
    eq(a.concat(a.empty()).equals(a), true);
  });

  test('Functor', function() {
    var a = S.Just(9);
    var f = S.inc;
    var g = Math.sqrt;

    // identity
    eq(a.map(S.I).equals(a), true);

    // composition
    eq(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)), true);
  });

  test('Apply', function() {
    var a = S.Just(S.inc);
    var b = S.Just(Math.sqrt);
    var c = S.Just(9);

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
    var a = S.Just(null);
    var b = S.Just(S.inc);
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
    var a = S.Just([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    var f = S.head;
    var g = S.last;

    // associativity
    eq(a.chain(f).chain(g).equals(a.chain(function(x) { return f(x).chain(g); })), true);
  });

  test('Monad', function() {
    var a = S.Just(null);
    var f = S.head;
    var x = [1, 2, 3];

    // left identity
    eq(a.of(x).chain(f).equals(f(x)), true);

    // right identity
    eq(a.chain(a.of).equals(a), true);
  });

});
