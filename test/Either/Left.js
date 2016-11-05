'use strict';

var assert = require('assert');
var throws = assert.throws;

var eq = require('../utils').eq;
var errorEq = require('../utils').errorEq;
var parseHex = require('../utils').parseHex;
var S = require('../..');
var square = require('../utils').square;
var squareRoot = require('../utils').squareRoot;


describe('Left', function() {

  it('is a data constructor', function() {
    eq(typeof S.Left, 'function');
    eq(S.Left.length, 1);
    eq(S.Left(42)['@@type'], 'sanctuary/Either');
    eq(S.Left(42).isLeft, true);
    eq(S.Left(42).isRight, false);
  });

  it('provides an "ap" method', function() {
    eq(S.Left('abc').ap.length, 1);
    eq(S.Left('abc').ap(S.Left('xyz')), S.Left('abc'));
    eq(S.Left('abc').ap(S.Right(42)), S.Left('abc'));

    throws(function() { S.Left('abc').ap([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Either#ap :: Either a Function -> Either a b -> Either a c\n' +
                   '                                  ^^^^^^^^^^\n' +
                   '                                      1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Either a b’.\n'));
  });

  it('provides a "chain" method', function() {
    eq(S.Left('abc').chain.length, 1);
    eq(S.Left('abc').chain(squareRoot), S.Left('abc'));

    throws(function() { S.Left('abc').chain([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Either#chain :: Either a b -> Function -> Either a c\n' +
                   '                              ^^^^^^^^\n' +
                   '                                 1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "concat" method', function() {
    eq(S.Left('abc').concat.length, 1);
    eq(S.Left('abc').concat(S.Left('def')), S.Left('abcdef'));
    eq(S.Left('abc').concat(S.Right('xyz')), S.Right('xyz'));

    throws(function() { S.Left('abc').concat([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
                   '                                                             ^^^^^^^^^^\n' +
                   '                                                                 1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Either a b’.\n'));

    throws(function() { S.Left(/xxx/).concat(null); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
                   '                  ^^^^^^^^^^^                         ^\n' +
                   '                                                      1\n' +
                   '\n' +
                   '1)  /xxx/ :: RegExp\n' +
                   '\n' +
                   '‘Either#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.Left([1, 2, 3]).concat(S.Left(/xxx/)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
                   '                  ^^^^^^^^^^^                                       ^\n' +
                   '                                                                    1\n' +
                   '\n' +
                   '1)  /xxx/ :: RegExp\n' +
                   '\n' +
                   '‘Either#concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.Left([1, 2, 3]).concat(S.Right(/xxx/)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'Either#concat :: (Semigroup a, Semigroup b) => Either a b -> Either a b -> Either a b\n' +
                   '                               ^^^^^^^^^^^                            ^\n' +
                   '                                                                      1\n' +
                   '\n' +
                   '1)  /xxx/ :: RegExp\n' +
                   '\n' +
                   '‘Either#concat’ requires ‘b’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n'));
  });

  it('provides an "equals" method', function() {
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

  it('provides an "extend" method', function() {
    eq(S.Left('abc').extend.length, 1);
    eq(S.Left('abc').extend(function(x) { return x / 2; }), S.Left('abc'));

    // associativity
    var w = S.Left('abc');
    var f = function(x) { return x.value + 1; };
    var g = function(x) { return x.value * x.value; };
    eq(w.extend(g).extend(f), w.extend(function(_w) { return f(_w.extend(g)); }));

    throws(function() { S.Left('abc').extend(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Either#extend :: Either a b -> Function -> Either a b\n' +
                   '                               ^^^^^^^^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "map" method', function() {
    eq(S.Left('abc').map.length, 1);
    eq(S.Left('abc').map(square), S.Left('abc'));

    throws(function() { S.Left('abc').map([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Either#map :: Either a b -> Function -> Either a c\n' +
                   '                            ^^^^^^^^\n' +
                   '                               1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "reduce" method', function() {
    eq(S.Left().reduce.length, 2);
    eq(S.Left().reduce(function(xs, x) { return xs.concat([x]); }, [42]), [42]);

    throws(function() { S.Left().reduce(null, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Either#reduce :: Either a b -> Function -> c -> c\n' +
                   '                               ^^^^^^^^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('provides a "sequence" method', function() {
    eq(S.Left('abc').sequence.length, 1);
    eq(S.Left('abc').sequence(S.Maybe.of), S.Just(S.Left('abc')));
  });

  it('provides a "toBoolean" method', function() {
    eq(S.Left('abc').toBoolean.length, 0);
    eq(S.Left('abc').toBoolean(), false);
  });

  it('provides a "toString" method', function() {
    eq(S.Left('abc').toString.length, 0);
    eq(S.Left('abc').toString(), 'Left("abc")');
  });

  it('provides an "inspect" method', function() {
    eq(S.Left('abc').inspect.length, 0);
    eq(S.Left('abc').inspect(), 'Left("abc")');
  });

  it('implements Semigroup', function() {
    var a = S.Left('foo');
    var b = S.Left('bar');
    var c = S.Left('baz');

    // associativity
    assert(a.concat(b).concat(c).equals(a.concat(b.concat(c))));
  });

  it('implements Functor', function() {
    var a = S.Left('Cannot divide by zero');
    var f = S.inc;
    var g = square;

    // identity
    assert(a.map(S.I).equals(a));

    // composition
    assert(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)));
  });

  it('implements Apply', function() {
    var a = S.Left('Cannot divide by zero');
    var b = S.Left('Cannot divide by zero');
    var c = S.Left('Cannot divide by zero');

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
    var a = S.Left('Cannot divide by zero');
    var b = S.Left('Cannot divide by zero');
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
    var a = S.Left('Cannot divide by zero');
    var f = parseHex;
    var g = squareRoot;

    // associativity
    assert(a.chain(f).chain(g)
             .equals(a.chain(function(x) { return f(x).chain(g); })));
  });

  it('implements Monad', function() {
    var a = S.Left('Cannot divide by zero');
    var f = squareRoot;
    var x = 25;

    // left identity
    assert(a.of(x).chain(f).equals(f(x)));

    // right identity
    assert(a.chain(a.of).equals(a));
  });

});
