'use strict';

var assert = require('assert');
var throws = assert.throws;

var R = require('ramda');

var eq = require('../utils').eq;
var errorEq = require('../utils').errorEq;
import * as S from '../../src'
var square = require('../utils').square;


describe('Nothing', function() {

  it('is a member of the "Maybe a" type', function() {
    eq(S.Nothing['@@type'], 'sanctuary/Maybe');
    eq(S.Nothing.isNothing, true);
    eq(S.Nothing.isJust, false);
  });

  it('provides an "ap" method', function() {
    eq(S.Nothing.ap.length, 1);
    eq(S.Nothing.ap(S.Nothing), S.Nothing);
    eq(S.Nothing.ap(S.Just(42)), S.Nothing);

    throws(function() { S.Nothing.ap([1, 2, 3]); },
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
    eq(S.Nothing.chain.length, 1);
    eq(S.Nothing.chain(S.head), S.Nothing);

    throws(function() { S.Nothing.chain(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#chain :: Maybe a -> Function -> Maybe b\n' +
                   '                          ^^^^^^^^\n' +
                   '                             1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "concat" method', function() {
    eq(S.Nothing.concat.length, 1);
    eq(S.Nothing.concat(S.Nothing), S.Nothing);
    eq(S.Nothing.concat(S.Just('foo')), S.Just('foo'));

    throws(function() { S.Nothing.concat(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
                   '                                          ^^^^^^^\n' +
                   '                                             1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));

    throws(function() { S.Nothing.concat(S.Just(1)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Maybe#concat :: Semigroup a => Maybe a -> Maybe a -> Maybe a\n' +
                   '                ^^^^^^^^^^^                     ^\n' +
                   '                                                1\n' +
                   '\n' +
                   '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘Maybe#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));
  });

  it('provides an "equals" method', function() {
    eq(S.Nothing.equals.length, 1);
    eq(S.Nothing.equals(S.Nothing), true);
    eq(S.Nothing.equals(S.Just(42)), false);
    eq(S.Nothing.equals(null), false);
  });

  it('provides an "extend" method', function() {
    eq(S.Nothing.extend.length, 1);
    eq(S.Nothing.extend(function(x) { return x.value / 2; }), S.Nothing);

    // associativity
    var w = S.Nothing;
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w.extend(g).extend(f),
       w.extend(function(_w) { return f(_w.extend(g)); }));

    throws(function() { S.Nothing.extend(null); },
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
    eq(S.Nothing.filter.length, 1);
    eq(S.Nothing.filter(R.T), S.Nothing);
    eq(S.Nothing.filter(R.F), S.Nothing);

    var m = S.Nothing;
    var f = function(n) { return n * n; };
    var p = function(n) { return n < 0; };
    var q = function(n) { return n > 0; };

    assert(m.map(f).filter(p)
           .equals(m.filter(function(x) { return p(f(x)); }).map(f)));
    assert(m.map(f).filter(q)
           .equals(m.filter(function(x) { return q(f(x)); }).map(f)));

    throws(function() { S.Nothing.filter(null); },
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
    eq(S.Nothing.map.length, 1);
    eq(S.Nothing.map(function() { return 42; }), S.Nothing);

    throws(function() { S.Nothing.map(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#map :: Maybe a -> Function -> Maybe b\n' +
                   '                        ^^^^^^^^\n' +
                   '                           1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "reduce" method', function() {
    eq(S.Nothing.reduce.length, 2);
    eq(S.Nothing.reduce(function(a, b) { return a + b; }, 10), 10);

    throws(function() { S.Nothing.reduce(null, null); },
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
    eq(S.Nothing.sequence.length, 1);
    eq(S.Nothing.sequence(S.Either.of), S.Right(S.Nothing));
  });

  it('provides a "toBoolean" method', function() {
    eq(S.Nothing.toBoolean.length, 0);
    eq(S.Nothing.toBoolean(), false);
  });

  it('provides a "toString" method', function() {
    eq(S.Nothing.toString.length, 0);
    eq(S.Nothing.toString(), 'Nothing');
  });

  it('provides an "inspect" method', function() {
    eq(S.Nothing.inspect.length, 0);
    eq(S.Nothing.inspect(), 'Nothing');
  });

  it('implements Semigroup', function() {
    var a = S.Nothing;
    var b = S.Nothing;
    var c = S.Nothing;

    // associativity
    assert(a.concat(b).concat(c).equals(a.concat(b.concat(c))));
  });

  it('implements Monoid', function() {
    var a = S.Nothing;

    // left identity
    assert(a.empty().concat(a).equals(a));

    // right identity
    assert(a.concat(a.empty()).equals(a));
  });

  it('implements Functor', function() {
    var a = S.Nothing;
    var f = S.inc;
    var g = square;

    // identity
    assert(a.map(S.I).equals(a));

    // composition
    assert(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)));
  });

  it('implements Apply', function() {
    var a = S.Nothing;
    var b = S.Nothing;
    var c = S.Nothing;

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
    var a = S.Nothing;
    var b = S.Nothing;
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
    var a = S.Nothing;
    var f = S.head;
    var g = S.last;

    // associativity
    assert(a.chain(f).chain(g)
           .equals(a.chain(function(x) { return f(x).chain(g); })));
  });

  it('implements Monad', function() {
    var a = S.Nothing;
    var f = S.head;
    var x = [1, 2, 3];

    // left identity
    assert(a.of(x).chain(f).equals(f(x)));

    // right identity
    assert(a.chain(a.of).equals(a));
  });

});
