'use strict';

var assert = require('assert');
var throws = assert.throws;

var R = require('ramda');

var eq = require('../utils').eq;
var errorEq = require('../utils').errorEq;
var S = require('../..');
var square = require('../utils').square;


describe('Just', function() {

  it('is a data constructor', function() {
    eq(typeof S.Just, 'function');
    eq(S.Just.length, 1);
    eq(S.Just(42)['@@type'], 'sanctuary/Maybe');
    eq(S.Just(42).isNothing, false);
    eq(S.Just(42).isJust, true);
  });

  it('provides an "ap" method', function() {
    eq(S.Just(S.inc).ap.length, 1);
    eq(S.Just(S.inc).ap(S.Nothing()), S.Nothing());
    eq(S.Just(S.inc).ap(S.Just(42)), S.Just(43));

    throws(function() { S.Just(S.inc).ap([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#ap :: Maybe Function -> Maybe a -> Maybe b\n' +
                   '                              ^^^^^^^\n' +
                   '                                 1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));
  });

  it('provides a "chain" method', function() {
    eq(S.Just([1, 2, 3]).chain.length, 1);
    eq(S.Just([1, 2, 3]).chain(S.head), S.Just(1));

    throws(function() { S.Just([1, 2, 3]).chain([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#chain :: Maybe a -> Function -> Maybe b\n' +
                   '                          ^^^^^^^^\n' +
                   '                             1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "concat" method', function() {
    eq(S.Just('foo').concat.length, 1);
    eq(S.Just('foo').concat(S.Nothing()), S.Just('foo'));
    eq(S.Just('foo').concat(S.Just('bar')), S.Just('foobar'));

    throws(function() { S.Just('foo').concat([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
                   '                                          ^^^^^^^\n' +
                   '                                             1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));

    throws(function() { S.Just(1).concat(S.Just(0)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
                   '                ^^^^^^^^^^^          ^\n' +
                   '                                     1\n' +
                   '\n' +
                   '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.Just(2).concat(S.Just([1, 2, 3])); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
                   '                ^^^^^^^^^^^          ^\n' +
                   '                                     1\n' +
                   '\n' +
                   '1)  2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.Just([1, 2, 3]).concat(S.Just(3)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
                   '                ^^^^^^^^^^^                     ^\n' +
                   '                                                1\n' +
                   '\n' +
                   '1)  3 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));
  });

  it('provides an "equals" method', function() {
    eq(S.Just(42).equals.length, 1);
    eq(S.Just(42).equals(S.Just(42)), true);
    eq(S.Just(42).equals(S.Just(43)), false);
    eq(S.Just(42).equals(S.Nothing()), false);
    eq(S.Just(42).equals(null), false);

    // Value-based equality:
    eq(S.Just(0).equals(S.Just(-0)), false);
    eq(S.Just(-0).equals(S.Just(0)), false);
    eq(S.Just(NaN).equals(S.Just(NaN)), true);
    eq(S.Just([1, 2, 3]).equals(S.Just([1, 2, 3])), true);
    eq(S.Just(new Number(42)).equals(S.Just(new Number(42))), true);
    eq(S.Just(new Number(42)).equals(42), false);
  });

  it('provides an "extend" method', function() {
    eq(S.Just(42).extend.length, 1);
    eq(S.Just(42).extend(function(x) { return x.value / 2; }), S.Just(21));

    // associativity
    var w = S.Just(42);
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w.extend(g).extend(f),
       w.extend(function(_w) { return f(_w.extend(g)); }));

    throws(function() { S.Just(42).extend(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#extend :: Maybe a -> Function -> Maybe a\n' +
                   '                           ^^^^^^^^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "filter" method', function() {
    eq(S.Just(42).filter.length, 1);
    eq(S.Just(42).filter(R.T), S.Just(42));
    eq(S.Just(42).filter(R.F), S.Nothing());
    eq(S.Just(42).filter(function(n) { return n > 0; }), S.Just(42));
    eq(S.Just(42).filter(function(n) { return n < 0; }), S.Nothing());

    var m = S.Just(-5);
    var f = function(n) { return n * n; };
    var p = function(n) { return n < 0; };
    var q = function(n) { return n > 0; };

    assert(m.map(f).filter(p)
           .equals(m.filter(function(x) { return p(f(x)); }).map(f)));
    assert(m.map(f).filter(q)
           .equals(m.filter(function(x) { return q(f(x)); }).map(f)));

    throws(function() { S.Just(42).filter(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#filter :: Maybe a -> Function -> Maybe a\n' +
                   '                           ^^^^^^^^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "map" method', function() {
    eq(S.Just(42).map.length, 1);
    eq(S.Just(42).map(function(x) { return x / 2; }), S.Just(21));

    throws(function() { S.Just(42).map([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#map :: Maybe a -> Function -> Maybe b\n' +
                   '                        ^^^^^^^^\n' +
                   '                           1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "reduce" method', function() {
    eq(S.Just(5).reduce.length, 2);
    eq(S.Just(5).reduce(function(a, b) { return a + b; }, 10), 15);

    throws(function() { S.Just().reduce(null, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#reduce :: Maybe a -> Function -> b -> b\n' +
                   '                           ^^^^^^^^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "sequence" method', function() {
    eq(S.Just(S.Right(42)).sequence.length, 1);
    eq(S.Just(S.Right(42)).sequence(S.Either.of), S.Right(S.Just(42)));
  });

  it('provides a "toBoolean" method', function() {
    eq(S.Just(42).toBoolean.length, 0);
    eq(S.Just(42).toBoolean(), true);
  });

  it('provides a "toString" method', function() {
    eq(S.Just([1, 2, 3]).toString.length, 0);
    eq(S.Just([1, 2, 3]).toString(), 'Just([1, 2, 3])');
  });

  it('implements Semigroup', function() {
    var a = S.Just('foo');
    var b = S.Just('bar');
    var c = S.Just('baz');

    // associativity
    assert(a.concat(b).concat(c).equals(a.concat(b.concat(c))));
  });

  it('implements Monoid', function() {
    var a = S.Just([1, 2, 3]);

    // left identity
    assert(a.empty().concat(a).equals(a));

    // right identity
    assert(a.concat(a.empty()).equals(a));
  });

  it('implements Functor', function() {
    var a = S.Just(7);
    var f = S.inc;
    var g = square;

    // identity
    assert(a.map(S.I).equals(a));

    // composition
    assert(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)));
  });

  it('implements Apply', function() {
    var a = S.Just(S.inc);
    var b = S.Just(square);
    var c = S.Just(7);

    // composition
    assert(a.map(function(f) {
      return function(g) {
        return function(x) {
          return f(g(x));
        };
      };
    }).ap(b).ap(c).equals(a.ap(b.ap(c))));
  });

  it('implements Applicative', function() {
    var a = S.Just(null);
    var b = S.Just(S.inc);
    var f = S.inc;
    var x = 7;

    // identity
    assert(a.of(S.I).ap(b).equals(b));

    // homomorphism
    assert(a.of(f).ap(a.of(x)).equals(a.of(f(x))));

    // interchange
    assert(a.of(function(f) { return f(x); }).ap(b).equals(b.ap(a.of(x))));
  });

  it('implements Chain', function() {
    var a = S.Just([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    var f = S.head;
    var g = S.last;

    // associativity
    assert(a.chain(f).chain(g)
           .equals(a.chain(function(x) { return f(x).chain(g); })));
  });

  it('implements Monad', function() {
    var a = S.Just(null);
    var f = S.head;
    var x = [1, 2, 3];

    // left identity
    assert(a.of(x).chain(f).equals(f(x)));

    // right identity
    assert(a.chain(a.of).equals(a));
  });

});
