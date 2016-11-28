'use strict';

var R = require('ramda');

var S = require('../..');

var eq = require('../internal/eq');
var throws = require('../internal/throws');


suite('Nothing', function() {

  test('member of the "Maybe a" type', function() {
    eq(S.Nothing['@@type'], 'sanctuary/Maybe');
    eq(S.Nothing.constructor, S.Maybe);
    eq(S.Nothing.isNothing, true);
    eq(S.Nothing.isJust, false);
  });

  test('"ap" method', function() {
    eq(S.Nothing.ap.length, 1);
    eq(S.Nothing.ap(S.Nothing), S.Nothing);
    eq(S.Nothing.ap(S.Just(42)), S.Nothing);

    throws(function() { S.Nothing.ap([1, 2, 3]); },
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
    eq(S.Nothing.chain.length, 1);
    eq(S.Nothing.chain(S.head), S.Nothing);

    throws(function() { S.Nothing.chain(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#chain :: Maybe a -> Function -> Maybe b\n' +
           '                          ^^^^^^^^\n' +
           '                             1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"concat" method', function() {
    eq(S.Nothing.concat.length, 1);
    eq(S.Nothing.concat(S.Nothing), S.Nothing);
    eq(S.Nothing.concat(S.Just('foo')), S.Just('foo'));

    throws(function() { S.Nothing.concat(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
           '                                          ^^^^^^^\n' +
           '                                             1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Maybe a’.\n');

    throws(function() { S.Nothing.concat(S.Just(1)); },
           TypeError,
           'Type-class constraint violation\n' +
           '\n' +
           'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
           '                ^^^^^^^^^^^                     ^\n' +
           '                                                1\n' +
           '\n' +
           '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
           '\n' +
           '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');
  });

  test('"equals" method', function() {
    eq(S.Nothing.equals.length, 1);
    eq(S.Nothing.equals(S.Nothing), true);
    eq(S.Nothing.equals(S.Just(42)), false);
    eq(S.Nothing.equals(null), false);
  });

  test('"extend" method', function() {
    eq(S.Nothing.extend.length, 1);
    eq(S.Nothing.extend(function(x) { return x.value / 2; }), S.Nothing);

    // associativity
    var w = S.Nothing;
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w.extend(g).extend(f), w.extend(function(_w) { return f(_w.extend(g)); }));

    throws(function() { S.Nothing.extend(null); },
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
    eq(S.Nothing.filter.length, 1);
    eq(S.Nothing.filter(R.T), S.Nothing);
    eq(S.Nothing.filter(R.F), S.Nothing);

    var m = S.Nothing;
    var f = function(n) { return n * n; };
    var p = function(n) { return n < 0; };
    var q = function(n) { return n > 0; };

    eq(m.map(f).filter(p).equals(m.filter(function(x) { return p(f(x)); }).map(f)), true);
    eq(m.map(f).filter(q).equals(m.filter(function(x) { return q(f(x)); }).map(f)), true);

    throws(function() { S.Nothing.filter(null); },
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
    eq(S.Nothing.map.length, 1);
    eq(S.Nothing.map(function() { return 42; }), S.Nothing);

    throws(function() { S.Nothing.map(null); },
           TypeError,
           'Invalid value\n' +
           '\n' +
           'Maybe#map :: Maybe a -> Function -> Maybe b\n' +
           '                        ^^^^^^^^\n' +
           '                           1\n' +
           '\n' +
           '1)  null :: Null\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Function’.\n');
  });

  test('"reduce" method', function() {
    eq(S.Nothing.reduce.length, 2);
    eq(S.Nothing.reduce(function(a, b) { return a + b; }, 10), 10);

    throws(function() { S.Nothing.reduce(null, null); },
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
    eq(S.Nothing.sequence.length, 1);
    eq(S.Nothing.sequence(S.Either.of), S.Right(S.Nothing));
  });

  test('"toString" method', function() {
    eq(S.Nothing.toString.length, 0);
    eq(S.Nothing.toString(), 'Nothing');
  });

  test('"inspect" method', function() {
    eq(S.Nothing.inspect.length, 0);
    eq(S.Nothing.inspect(), 'Nothing');
  });

  test('Semigroup', function() {
    var a = S.Nothing;
    var b = S.Nothing;
    var c = S.Nothing;

    // associativity
    eq(a.concat(b).concat(c).equals(a.concat(b.concat(c))), true);
  });

  test('Monoid', function() {
    var a = S.Nothing;

    // left identity
    eq(a.empty().concat(a).equals(a), true);

    // right identity
    eq(a.concat(a.empty()).equals(a), true);
  });

  test('Functor', function() {
    var a = S.Nothing;
    var f = S.inc;
    var g = Math.sqrt;

    // identity
    eq(a.map(S.I).equals(a), true);

    // composition
    eq(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)), true);
  });

  test('Apply', function() {
    var a = S.Nothing;
    var b = S.Nothing;
    var c = S.Nothing;

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
    var a = S.Nothing;
    var b = S.Nothing;
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
    var a = S.Nothing;
    var f = S.head;
    var g = S.last;

    // associativity
    eq(a.chain(f).chain(g).equals(a.chain(function(x) { return f(x).chain(g); })), true);
  });

  test('Monad', function() {
    var a = S.Nothing;
    var f = S.head;
    var x = [1, 2, 3];

    // left identity
    eq(a.of(x).chain(f).equals(f(x)), true);

    // right identity
    eq(a.chain(a.of).equals(a), true);
  });

});
