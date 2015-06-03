'use strict';

/* global describe, it */

var assert = require('assert');

var R = require('ramda');

var S = require('..');


var eq = function(actual, expected) {
  assert.strictEqual(R.toString(actual), R.toString(expected));
};

//  messageEq :: a -> Object -> Boolean
var messageEq = R.propEq('message');

//  isPatternMatchFailure :: a -> Boolean
var isPatternMatchFailure =
R.both(R.is(TypeError), messageEq('Pattern match failure'));

//  isTypeMismatch :: a -> Boolean
var isTypeMismatch =
R.both(R.is(TypeError), messageEq('Type mismatch'));

//  parseHex :: String -> Either String Number
var parseHex = function(s) {
  var n = parseInt(s, 16);
  return n !== n ? S.Left('Invalid hexadecimal string') : S.Right(n);
};

//  square :: Number -> Number
var square = function(n) { return n * n; };

//  squareRoot :: Number -> Either String Number
var squareRoot = function(n) {
  return n < 0 ? S.Left('Cannot represent square root of negative number')
               : S.Right(Math.sqrt(n));
};


describe('invariants', function() {

  it('f() is equivalent to f for every "regular" function', function() {
    for (var prop in S) {
      if (typeof S[prop] === 'function' && /^(?![A-Z])/.test(prop)) {
        var result = S[prop]();
        eq(typeof result, 'function');
        eq(result.length, S[prop].length);
      }
    }
  });

  it('f(R.__) is equivalent to f for every "regular" function', function() {
    for (var prop in S) {
      if (typeof S[prop] === 'function' && /^(?![A-Z])/.test(prop)) {
        var result = S[prop](R.__);
        eq(typeof result, 'function');
        eq(result.length, S[prop].length);
      }
    }
  });

});

describe('combinator', function() {

  describe('K', function() {

    it('is a binary function', function() {
      eq(typeof S.K, 'function');
      eq(S.K.length, 2);
    });

    it('returns its first argument', function() {
      eq(S.K(21, []), 21);
      eq(S.K(42, null), 42);
      eq(S.K(84, undefined), 84);
    });

    it('is curried', function() {
      eq(S.K(42)(null), 42);
    });

  });

});

describe('maybe', function() {

  describe('Maybe', function() {

    it('throws if called', function() {
      assert.throws(function() { S.Maybe(); },
                    R.both(R.is(Error),
                           messageEq('Cannot instantiate Maybe')));
    });

  });

  describe('Nothing', function() {

    it('is a function', function() {
      eq(typeof S.Nothing, 'function');
    });

    it('can be invoked with "new"', function() {
      assert(new S.Nothing() instanceof S.Nothing);
    });

    it('can be invoked without "new"', function() {
      assert(S.Nothing() instanceof S.Nothing);
    });

    it('is a subtype of Maybe', function() {
      assert(S.Nothing() instanceof S.Maybe);
      eq(S.Nothing().type, S.Maybe);
    });

    it('provides an "ap" method', function() {
      eq(S.Nothing().ap.length, 1);
      eq(S.Nothing().ap(S.Nothing()), S.Nothing());
      eq(S.Nothing().ap(S.Just(42)), S.Nothing());
    });

    it('provides a "chain" method', function() {
      eq(S.Nothing().chain.length, 1);
      eq(S.Nothing().chain(S.head), S.Nothing());
    });

    it('provides a "concat" method', function() {
      eq(S.Nothing().concat.length, 1);
      eq(S.Nothing().concat(S.Nothing()), S.Nothing());
      eq(S.Nothing().concat(S.Just('foo')), S.Just('foo'));
    });

    it('provides an "equals" method', function() {
      eq(S.Nothing().equals.length, 1);
      eq(S.Nothing().equals(S.Nothing()), true);
      eq(S.Nothing().equals(S.Just(42)), false);
    });

    it('provides a "filter" method', function() {
      eq(S.Nothing().filter.length, 1);
      eq(S.Nothing().filter(R.T), S.Nothing());
      eq(S.Nothing().filter(R.F), S.Nothing());

      var m = S.Nothing();
      var f = function(n) { return n * n; };
      var p = function(n) { return n < 0; };
      var q = function(n) { return n > 0; };

      assert(m.map(f).filter(p)
             .equals(m.filter(function(x) { return p(f(x)); }).map(f)));
      assert(m.map(f).filter(q)
             .equals(m.filter(function(x) { return q(f(x)); }).map(f)));
    });

    it('provides a "map" method', function() {
      eq(S.Nothing().map.length, 1);
      eq(S.Nothing().map(function() { return 42; }), S.Nothing());
    });

    it('provides a "toBoolean" method', function() {
      eq(S.Nothing().toBoolean.length, 0);
      eq(S.Nothing().toBoolean(), false);
    });

    it('provides a "toString" method', function() {
      eq(S.Nothing().toString.length, 0);
      eq(S.Nothing().toString(), 'Nothing()');
    });

    it('implements Semigroup', function() {
      var a = S.Nothing();
      var b = S.Nothing();
      var c = S.Nothing();

      // associativity
      assert(a.concat(b).concat(c).equals(a.concat(b.concat(c))));
    });

    it('implements Monoid', function() {
      var a = S.Nothing();

      // left identity
      assert(a.empty().concat(a).equals(a));

      // right identity
      assert(a.concat(a.empty()).equals(a));
    });

    it('implements Functor', function() {
      var a = S.Nothing();
      var f = R.inc;
      var g = square;

      // identity
      assert(a.map(R.identity).equals(a));

      // composition
      assert(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)));
    });

    it('implements Apply', function() {
      var a = S.Nothing();
      var b = S.Nothing();
      var c = S.Nothing();

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
      var a = S.Nothing();
      var b = S.Nothing();
      var f = R.inc;
      var x = 7;

      // identity
      assert(a.of(R.identity).ap(b).equals(b));

      // homomorphism
      assert(a.of(f).ap(a.of(x)).equals(a.of(f(x))));

      // interchange
      assert(a.of(function(f) { return f(x); }).ap(b).equals(b.ap(a.of(x))));
    });

    it('implements Chain', function() {
      var a = S.Nothing();
      var f = S.head;
      var g = S.last;

      // associativity
      assert(a.chain(f).chain(g)
             .equals(a.chain(function(x) { return f(x).chain(g); })));
    });

    it('implements Monad', function() {
      var a = S.Nothing();
      var f = S.head;
      var x = [1, 2, 3];

      // left identity
      assert(a.of(x).chain(f).equals(f(x)));

      // right identity
      assert(a.chain(a.of).equals(a));
    });

  });

  describe('Just', function() {

    it('is a unary function', function() {
      eq(typeof S.Just, 'function');
      eq(S.Just.length, 1);
    });

    it('can be invoked with "new"', function() {
      assert(new S.Just(42) instanceof S.Just);
    });

    it('can be invoked without "new"', function() {
      assert(S.Just(42) instanceof S.Just);
    });

    it('is a subtype of Maybe', function() {
      assert(S.Just(42) instanceof S.Maybe);
      eq(S.Just(42).type, S.Maybe);
    });

    it('provides an "ap" method', function() {
      eq(S.Just(R.inc).ap.length, 1);
      eq(S.Just(R.inc).ap(S.Nothing()), S.Nothing());
      eq(S.Just(R.inc).ap(S.Just(42)), S.Just(43));
    });

    it('provides a "chain" method', function() {
      eq(S.Just([1, 2, 3]).chain.length, 1);
      eq(S.Just([1, 2, 3]).chain(S.head), S.Just(1));
    });

    it('provides a "concat" method', function() {
      eq(S.Just('foo').concat.length, 1);
      eq(S.Just('foo').concat(S.Nothing()), S.Just('foo'));
      eq(S.Just('foo').concat(S.Just('bar')), S.Just('foobar'));
    });

    it('provides an "equals" method', function() {
      eq(S.Just(42).equals.length, 1);
      eq(S.Just(42).equals(S.Just(42)), true);
      eq(S.Just(42).equals(S.Just(43)), false);
      eq(S.Just(42).equals(S.Nothing()), false);

      // SameValue semantics:
      eq(S.Just(0).equals(S.Just(-0)), false);
      eq(S.Just(-0).equals(S.Just(0)), false);
      eq(S.Just(NaN).equals(S.Just(NaN)), true);
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
    });

    it('provides a "map" method', function() {
      eq(S.Just(42).map.length, 1);
      eq(S.Just(42).map(function(x) { return x / 2; }), S.Just(21));
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
      var f = R.inc;
      var g = square;

      // identity
      assert(a.map(R.identity).equals(a));

      // composition
      assert(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)));
    });

    it('implements Apply', function() {
      var a = S.Just(R.inc);
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
      var b = S.Just(R.inc);
      var f = R.inc;
      var x = 7;

      // identity
      assert(a.of(R.identity).ap(b).equals(b));

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

  describe('fromMaybe', function() {

    it('is a binary function', function() {
      eq(typeof S.fromMaybe, 'function');
      eq(S.fromMaybe.length, 2);
    });

    it('can be applied to a Nothing', function() {
      eq(S.fromMaybe(0, S.Nothing()), 0);
    });

    it('can be applied to a Just', function() {
      eq(S.fromMaybe(0, S.Just(42)), 42);
    });

    it('throws if applied to a value of any other type', function() {
      assert.throws(function() { S.fromMaybe(0, []); },
                    isPatternMatchFailure);
    });

    it('is curried', function() {
      eq(S.fromMaybe(0)(S.Just(42)), 42);
    });

  });

  describe('toMaybe', function() {

    it('is a unary function', function() {
      eq(typeof S.toMaybe, 'function');
      eq(S.toMaybe.length, 1);
    });

    it('returns a Nothing when applied to null/undefined', function() {
      eq(S.toMaybe(null), S.Nothing());
      eq(S.toMaybe(undefined), S.Nothing());
    });

    it('returns a Just when applied to any other value', function() {
      eq(S.toMaybe(0), S.Just(0));
      eq(S.toMaybe(false), S.Just(false));
    });

  });

  describe('encase', function() {

    it('is a unary function', function() {
      eq(typeof S.encase, 'function');
      eq(S.encase.length, 1);
    });

    //  factorial :: Number -> Number
    var factorial = function(n) {
      if (n < 0) {
        throw new Error('Cannot determine factorial of negative number');
      } else if (n === 0) {
        return 1;
      } else {
        return n * factorial(n - 1);
      }
    };

    it('returns a function which returns a Just on success', function() {
      eq(S.encase(factorial)(5), S.Just(120));
    });

    it('returns a function which returns a Nothing on failure', function() {
      eq(S.encase(factorial)(-1), S.Nothing());
    });

    it('can be applied to a function of arbitrary arity', function() {
      var f = S.encase(function(a, b, c, d, e) { return e; });
      eq(f(1, 2, 3, 4, 5), S.Just(5));
    });

    it('returns a function of appropriate arity', function() {
      var f = S.encase(function(a, b, c, d, e) { return e; });
      eq(f.length, 5);
    });

    it('preserves context', function() {
      var f = S.encase(function() { return this; });
      eq(f.call({foo: 42}), S.Just({foo: 42}));
    });

  });

});

describe('either', function() {

  describe('Either', function() {

    it('throws if called', function() {
      assert.throws(function() { S.Either(); },
                    R.both(R.is(Error),
                           messageEq('Cannot instantiate Either')));
    });

  });

  describe('Left', function() {

    it('is a unary function', function() {
      eq(typeof S.Left, 'function');
      eq(S.Left.length, 1);
    });

    it('can be invoked with "new"', function() {
      assert(new S.Left(42) instanceof S.Left);
    });

    it('can be invoked without "new"', function() {
      assert(S.Left(42) instanceof S.Left);
    });

    it('is a subtype of Either', function() {
      assert(S.Left(42) instanceof S.Either);
      eq(S.Left(42).type, S.Either);
    });

    it('provides an "ap" method', function() {
      eq(S.Left('abc').ap.length, 1);
      eq(S.Left('abc').ap(S.Left('xyz')), S.Left('abc'));
      eq(S.Left('abc').ap(S.Right(42)), S.Left('abc'));
    });

    it('provides a "chain" method', function() {
      eq(S.Left('abc').chain.length, 1);
      eq(S.Left('abc').chain(squareRoot), S.Left('abc'));
    });

    it('provides a "concat" method', function() {
      eq(S.Left('abc').concat.length, 1);
      eq(S.Left('abc').concat(S.Left('def')), S.Left('abcdef'));
      eq(S.Left('abc').concat(S.Right('xyz')), S.Right('xyz'));
    });

    it('provides an "equals" method', function() {
      eq(S.Left(42).equals.length, 1);
      eq(S.Left(42).equals(S.Left(42)), true);
      eq(S.Left(42).equals(S.Left('42')), false);
      eq(S.Left(42).equals(S.Right(42)), false);

      // SameValue semantics:
      eq(S.Left(0).equals(S.Left(-0)), false);
      eq(S.Left(-0).equals(S.Left(0)), false);
      eq(S.Left(NaN).equals(S.Left(NaN)), true);
    });

    it('provides a "map" method', function() {
      eq(S.Left('abc').map.length, 1);
      eq(S.Left('abc').map(square), S.Left('abc'));
    });

    it('provides a "toBoolean" method', function() {
      eq(S.Left('abc').toBoolean.length, 0);
      eq(S.Left('abc').toBoolean(), false);
    });

    it('provides a "toString" method', function() {
      eq(S.Left('abc').toString.length, 0);
      eq(S.Left('abc').toString(), 'Left("abc")');
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
      var f = R.inc;
      var g = square;

      // identity
      assert(a.map(R.identity).equals(a));

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
      var f = R.inc;
      var x = 7;

      // identity
      assert(a.of(R.identity).ap(b).equals(b));

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

  describe('Right', function() {

    it('is a unary function', function() {
      eq(typeof S.Right, 'function');
      eq(S.Right.length, 1);
    });

    it('can be invoked with "new"', function() {
      assert(new S.Right(42) instanceof S.Right);
    });

    it('can be invoked without "new"', function() {
      assert(S.Right(42) instanceof S.Right);
    });

    it('is a subtype of Either', function() {
      assert(S.Right(42) instanceof S.Either);
      eq(S.Right(42).type, S.Either);
    });

    it('provides an "ap" method', function() {
      eq(S.Right(R.inc).ap.length, 1);
      eq(S.Right(R.inc).ap(S.Left('abc')), S.Left('abc'));
      eq(S.Right(R.inc).ap(S.Right(42)), S.Right(43));
    });

    it('provides a "chain" method', function() {
      eq(S.Right(25).chain.length, 1);
      eq(S.Right(25).chain(squareRoot), S.Right(5));
    });

    it('provides a "concat" method', function() {
      eq(S.Right('abc').concat.length, 1);
      eq(S.Right('abc').concat(S.Left('xyz')), S.Right('abc'));
      eq(S.Right('abc').concat(S.Right('def')), S.Right('abcdef'));
    });

    it('provides an "equals" method', function() {
      eq(S.Right(42).equals.length, 1);
      eq(S.Right(42).equals(S.Right(42)), true);
      eq(S.Right(42).equals(S.Right('42')), false);
      eq(S.Right(42).equals(S.Left(42)), false);

      // SameValue semantics:
      eq(S.Right(0).equals(S.Right(-0)), false);
      eq(S.Right(-0).equals(S.Right(0)), false);
      eq(S.Right(NaN).equals(S.Right(NaN)), true);
    });

    it('provides a "map" method', function() {
      eq(S.Right(42).map.length, 1);
      eq(S.Right(42).map(square), S.Right(1764));
    });

    it('provides a "toBoolean" method', function() {
      eq(S.Right(42).toBoolean.length, 0);
      eq(S.Right(42).toBoolean(), true);
    });

    it('provides a "toString" method', function() {
      eq(S.Right([1, 2, 3]).toString.length, 0);
      eq(S.Right([1, 2, 3]).toString(), 'Right([1, 2, 3])');
    });

    it('implements Semigroup', function() {
      var a = S.Right('foo');
      var b = S.Right('bar');
      var c = S.Right('baz');

      // associativity
      assert(a.concat(b).concat(c).equals(a.concat(b.concat(c))));
    });

    it('implements Functor', function() {
      var a = S.Right(7);
      var f = R.inc;
      var g = square;

      // identity
      assert(a.map(R.identity).equals(a));

      // composition
      assert(a.map(function(x) { return f(g(x)); }).equals(a.map(g).map(f)));
    });

    it('implements Apply', function() {
      var a = S.Right(R.inc);
      var b = S.Right(square);
      var c = S.Right(7);

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
      var a = S.Right(null);
      var b = S.Right(R.inc);
      var f = R.inc;
      var x = 7;

      // identity
      assert(a.of(R.identity).ap(b).equals(b));

      // homomorphism
      assert(a.of(f).ap(a.of(x)).equals(a.of(f(x))));

      // interchange
      assert(a.of(function(f) { return f(x); }).ap(b).equals(b.ap(a.of(x))));
    });

    it('implements Chain', function() {
      var a = S.Right('0x0100');
      var f = parseHex;
      var g = squareRoot;

      // associativity
      assert(a.chain(f).chain(g)
             .equals(a.chain(function(x) { return f(x).chain(g); })));
    });

    it('implements Monad', function() {
      var a = S.Right(null);
      var f = squareRoot;
      var x = 25;

      // left identity
      assert(a.of(x).chain(f).equals(f(x)));

      // right identity
      assert(a.chain(a.of).equals(a));
    });

  });

  describe('either', function() {

    it('is a ternary function', function() {
      eq(typeof S.either, 'function');
      eq(S.either.length, 3);
    });

    it('can be applied to a Left', function() {
      eq(S.either(R.length, square, S.Left('abc')), 3);
    });

    it('can be applied to a Right', function() {
      eq(S.either(R.length, square, S.Right(42)), 1764);
    });

    it('throws if applied to a value of any other type', function() {
      assert.throws(function() { S.either(R.length, square, []); },
                    isPatternMatchFailure);
    });

    it('is curried', function() {
      eq(S.either(R.length)(square)(S.Left('abc')), 3);
      eq(S.either(R.length)(square, S.Left('abc')), 3);
      eq(S.either(R.length, square)(S.Left('abc')), 3);
    });

  });

});

describe('control', function() {

  describe('and', function() {

    it('is a binary function', function() {
      eq(typeof S.and, 'function');
      eq(S.and.length, 2);
    });

    it('can be applied to Booleans', function() {
      eq(S.and(false, false), false);
      eq(S.and(false, true), false);
      eq(S.and(true, false), false);
      eq(S.and(true, true), true);
    });

    it('can be applied to arrays', function() {
      eq(S.and([], []), []);
      eq(S.and([], [42]), []);
      eq(S.and([42], []), []);
      eq(S.and([42], [43]), [43]);
    });

    it('can be applied to maybes', function() {
      eq(S.and(S.Nothing(), S.Nothing()), S.Nothing());
      eq(S.and(S.Nothing(), S.Just(42)), S.Nothing());
      eq(S.and(S.Just(42), S.Nothing()), S.Nothing());
      eq(S.and(S.Just(42), S.Just(43)), S.Just(43));
    });

    it('can be applied to eithers', function() {
      eq(S.and(S.Left('foo'), S.Left('bar')), S.Left('foo'));
      eq(S.and(S.Left('foo'), S.Right(42)), S.Left('foo'));
      eq(S.and(S.Right(42), S.Left('foo')), S.Left('foo'));
      eq(S.and(S.Right(42), S.Right(43)), S.Right(43));
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(function() { S.and([], S.Nothing()); },
                    isTypeMismatch);

      assert.throws(function() { S.and(S.Nothing(), foo); },
                    isTypeMismatch);
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.and(0, 1); },
                    R.both(R.is(TypeError),
                           messageEq('0 does not have a "toBoolean" method')));
    });

    it('is curried', function() {
      eq(S.and([])([42]), []);
    });

  });

  describe('or', function() {

    it('is a binary function', function() {
      eq(typeof S.or, 'function');
      eq(S.or.length, 2);
    });

    it('can be applied to Booleans', function() {
      eq(S.or(false, false), false);
      eq(S.or(false, true), true);
      eq(S.or(true, false), true);
      eq(S.or(true, true), true);
    });

    it('can be applied to arrays', function() {
      eq(S.or([], []), []);
      eq(S.or([], [42]), [42]);
      eq(S.or([42], []), [42]);
      eq(S.or([42], [43]), [42]);
    });

    it('can be applied to maybes', function() {
      eq(S.or(S.Nothing(), S.Nothing()), S.Nothing());
      eq(S.or(S.Nothing(), S.Just(42)), S.Just(42));
      eq(S.or(S.Just(42), S.Nothing()), S.Just(42));
      eq(S.or(S.Just(42), S.Just(43)), S.Just(42));
    });

    it('can be applied to eithers', function() {
      eq(S.or(S.Left('foo'), S.Left('bar')), S.Left('bar'));
      eq(S.or(S.Left('foo'), S.Right(42)), S.Right(42));
      eq(S.or(S.Right(42), S.Left('foo')), S.Right(42));
      eq(S.or(S.Right(42), S.Right(43)), S.Right(42));
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(function() { S.or([], S.Nothing()); },
                    isTypeMismatch);

      assert.throws(function() { S.or(S.Nothing(), foo); },
                    isTypeMismatch);
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.or(0, 1); },
                    R.both(R.is(TypeError),
                           messageEq('0 does not have a "toBoolean" method')));
    });

    it('is curried', function() {
      eq(S.or([])([42]), [42]);
    });

  });

  describe('xor', function() {

    it('is a binary function', function() {
      eq(typeof S.xor, 'function');
      eq(S.xor.length, 2);
    });

    it('can be applied to Booleans', function() {
      eq(S.xor(false, false), false);
      eq(S.xor(false, true), true);
      eq(S.xor(true, false), true);
      eq(S.xor(true, true), false);
    });

    it('can be applied to arrays', function() {
      eq(S.xor([], []), []);
      eq(S.xor([], [42]), [42]);
      eq(S.xor([42], []), [42]);
      eq(S.xor([42], [43]), []);
    });

    it('can be applied to maybes', function() {
      eq(S.xor(S.Nothing(), S.Nothing()), S.Nothing());
      eq(S.xor(S.Nothing(), S.Just(42)), S.Just(42));
      eq(S.xor(S.Just(42), S.Nothing()), S.Just(42));
      eq(S.xor(S.Just(42), S.Just(43)), S.Nothing());
    });

    it('cannot be applied to eithers', function() {
      //  message :: String -> String
      var message = R.concat(R.__, ' does not have an "empty" method');

      assert.throws(function() { S.xor(S.Left('foo'), S.Left('bar')); },
                    R.both(R.is(TypeError),
                           messageEq(message('Left("foo")'))));

      assert.throws(function() { S.xor(S.Left('foo'), S.Right(42)); },
                    R.both(R.is(TypeError),
                           messageEq(message('Left("foo")'))));

      assert.throws(function() { S.xor(S.Right(42), S.Left('foo')); },
                    R.both(R.is(TypeError),
                           messageEq(message('Right(42)'))));

      assert.throws(function() { S.xor(S.Right(42), S.Right(43)); },
                    R.both(R.is(TypeError),
                           messageEq(message('Right(42)'))));
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(function() { S.xor([], S.Nothing()); },
                    isTypeMismatch);

      assert.throws(function() { S.xor(S.Nothing(), foo); },
                    isTypeMismatch);
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.xor(0, 1); },
                    R.both(R.is(TypeError),
                           messageEq('0 does not have a "toBoolean" method')));
    });

    it('is curried', function() {
      eq(S.xor([])([42]), [42]);
    });

  });

});

describe('number', function() {

  it('returns a Just when the divisor is not 0', function() {
    eq(S.divide(20, 5), S.Just(4));
    eq(S.divide(21, 5), S.Just(4.2));
  });

  it('returns Nothing when the divisor is 0', function() {
    eq(S.divide(20, 0), S.Nothing());
    eq(S.divide(20, -0), S.Nothing());
  });

});

describe('list', function() {

  describe('at', function() {

    it('is a binary function', function() {
      eq(typeof S.at, 'function');
      eq(S.at.length, 2);
    });

    it('returns Just the nth element of a list', function() {
      eq(S.at(1, ['foo', 'bar', 'baz']), S.Just('bar'));
    });

    it('accepts negative offset', function() {
      eq(S.at(-1, ['foo', 'bar', 'baz']), S.Just('baz'));
    });

    it('returns a Nothing if index out of bounds', function() {
      eq(S.at(3, ['foo', 'bar', 'baz']), S.Nothing());
      eq(S.at(-4, ['foo', 'bar', 'baz']), S.Nothing());
      eq(S.at(-0, ['foo', 'bar', 'baz']), S.Nothing());
    });

    it('is curried', function() {
      eq(S.at(1)(['foo', 'bar', 'baz']), S.Just('bar'));
    });

  });

  describe('slice', function() {

    it('returns a Nothing with a positive end index greater than start index', function() {
      eq(S.slice(6, 1, [1, 2, 3, 4, 5]), S.Nothing());
    });

    it('returns a Nothing with a positive end index greater than list length', function() {
      eq(S.slice(1, 6, [1, 2, 3, 4, 5]), S.Nothing());
    });

    it('returns a Nothing with a negative end index greater than list length', function() {
      eq(S.slice(1, -6, [1, 2, 3, 4, 5]), S.Nothing());
    });

    it('returns a Nothing with a negative start index greater than list length', function() {
      eq(S.slice(-6, 1, [1, 2, 3, 4, 5]), S.Nothing());
    });

    it('returns a Just with an empty array when start index equals end index', function() {
      eq(S.slice(1, 1, [1, 2, 3, 4, 5]), S.Just([]));
      eq(S.slice(1, -4, [1, 2, 3, 4, 5]), S.Just([]));
      eq(S.slice(-4, 1, [1, 2, 3, 4, 5]), S.Just([]));
      eq(S.slice(-4, -4, [1, 2, 3, 4, 5]), S.Just([]));
      eq(S.slice(0, 0, []), S.Just([]));
      eq(S.slice(0, -0, []), S.Just([]));
      eq(S.slice(-0, 0, []), S.Just([]));
      eq(S.slice(-0, -0, []), S.Just([]));
    });

    it('returns a Just with a positive start and end index', function() {
      eq(S.slice(1, 3, [1, 2, 3, 4, 5]), S.Just([2, 3]));
    });

    it('returns a Just with a negative start index', function() {
      eq(S.slice(-3, 5, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
    });

    it('returns a Just with a negative end index', function() {
      eq(S.slice(1, -2, [1, 2, 3, 4, 5]), S.Just([2, 3]));
    });

    it('accepts -0 as the position half a step beyond the last index', function() {
      eq(S.slice(-0, 5, [1, 2, 3, 4, 5]), S.Just([]));
      eq(S.slice(2, -0, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
    });

    it('returns a Just with the whole list', function() {
      eq(S.slice(0, 5, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
    });

  });

  describe('head', function() {

    it('is a unary function', function() {
      eq(typeof S.head, 'function');
      eq(S.head.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      eq(S.head([]), S.Nothing());
    });

    it('returns Just the head of a nonempty list', function() {
      eq(S.head(['foo', 'bar', 'baz']), S.Just('foo'));
    });

  });

  describe('last', function() {

    it('is a unary function', function() {
      eq(typeof S.last, 'function');
      eq(S.last.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      eq(S.last([]), S.Nothing());
    });

    it('returns Just the last element of a nonempty list', function() {
      eq(S.last(['foo', 'bar', 'baz']), S.Just('baz'));
    });

  });

  describe('tail', function() {

    it('is a unary function', function() {
      eq(typeof S.tail, 'function');
      eq(S.tail.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      eq(S.tail([]), S.Nothing());
    });

    it('returns Just the tail of a nonempty list', function() {
      eq(S.tail(['foo', 'bar', 'baz']), S.Just(['bar', 'baz']));
    });

  });

  describe('init', function() {

    it('is a unary function', function() {
      eq(typeof S.init, 'function');
      eq(S.init.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      eq(S.init([]), S.Nothing());
    });

    it('returns Just the initial elements of a nonempty list', function() {
      eq(S.init(['foo', 'bar', 'baz']), S.Just(['foo', 'bar']));
    });

  });

  describe('find', function() {

    it('is a binary function', function() {
      eq(typeof S.find, 'function');
      eq(S.find.length, 2);
    });

    it('returns Just the first element satisfying the predicate', function() {
      eq(S.find(R.T, [null]), S.Just(null));
      eq(S.find(function(n) { return n >= 0; }, [-1, 0, 1]), S.Just(0));
    });

    it('returns a Nothing if no element satisfies the predicate', function() {
      eq(S.find(R.T, []), S.Nothing());
      eq(S.find(R.F, [1, 2, 3]), S.Nothing());
    });

    it('is curried', function() {
      eq(S.find(R.T)([null]), S.Just(null));
    });

  });

  describe('indexOf', function() {

    it('returns a Nothing for an empty list', function() {
      eq(S.indexOf(10, []), S.Nothing());
    });

    it('returns a Nothing if the element is not found', function() {
      eq(S.indexOf(10, [1, 2, 3, 4, 5]), S.Nothing());
    });

    it('returns Just the index of the element found', function() {
      eq(S.indexOf(3, [1, 2, 3, 4, 5]), S.Just(2));
    });

  });

  describe('lastIndexOf', function() {

    it('returns a Nothing for an empty list', function() {
      eq(S.lastIndexOf('a', []), S.Nothing());
    });

    it('returns a Nothing if the element is not found', function() {
      eq(S.lastIndexOf('d', ['a', 'b', 'b', 'c', 'c']), S.Nothing());
    });

    it('returns Just the last index of the element found', function() {
      eq(S.lastIndexOf('c', ['a', 'b', 'b', 'c', 'c']), S.Just(4));
    });

  });

  describe('pluck', function() {

    it('returns array of Justs for found keys', function() {
      var xs = [{a: 1, b: 3}, {a: 2, b: 4}, {a: 3, b: 5}];
      eq(S.pluck('a', xs), [S.Just(1), S.Just(2), S.Just(3)]);
    });

    it('returns array of Nothings for keys not found', function() {
      var xs = [{a: 1, b: 3}, {a: 2, b: 4}, {a: 3, b: 5}];
      eq(S.pluck('c', xs), [S.Nothing(), S.Nothing(), S.Nothing()]);
    });

    it('returns Just(undefined) for defined key with no value', function() {
      var xs = [{a: 1, b: 3}, {a: void 0, b: 4}, {a: 3, b: 5}];
      eq(S.pluck('a', xs), [S.Just(1), S.Just(undefined), S.Just(3)]);
    });

    it('returns an array of Maybes for various values', function() {
      var xs = [{a: 1}, {a: void 0}, {a: 4}, {b: 1}];
      eq(S.pluck('a', xs),
         [S.Just(1), S.Just(undefined), S.Just(4), S.Nothing()]);
    });

  });

});

describe('object', function() {

  describe('get', function() {

    it('is a binary function', function() {
      eq(typeof S.get, 'function');
      eq(S.get.length, 2);
    });

    it('returns a Maybe', function() {
      var obj = {x: 0, y: 42};
      eq(S.get('x', obj), S.Just(0));
      eq(S.get('y', obj), S.Just(42));
      eq(S.get('z', obj), S.Nothing());
    });

  });

  describe('gets', function() {

    it('returns a Maybe', function() {
      var obj = {x: {z: 0}, y: 42};
      eq(S.gets([], obj), S.Just({x: {z: 0}, y: 42}));
      eq(S.gets(['y'], obj), S.Just(42));
      eq(S.gets(['z'], obj), S.Nothing());
      eq(S.gets(['x', 'z'], obj), S.Just(0));
    });

  });

});

describe('parse', function() {

  describe('parseDate', function() {

    it('is a unary function', function() {
      eq(typeof S.parseDate, 'function');
      eq(S.parseDate.length, 1);
    });

    it('returns a Just when applied to a valid date string', function() {
      eq(S.parseDate('2001-02-03T04:05:06Z'),
         S.Just(new Date('2001-02-03T04:05:06Z')));
    });

    it('returns a Nothing when applied to an invalid date string', function() {
      eq(S.parseDate('today'), S.Nothing());
    });

  });

  describe('parseFloat', function() {

    it('is a unary function', function() {
      eq(typeof S.parseFloat, 'function');
      eq(S.parseFloat.length, 1);
    });

    it('returns a Maybe', function() {
      eq(S.parseFloat('12.34'), S.Just(12.34));
      eq(S.parseFloat('xxx'), S.Nothing());
    });

  });

  describe('parseInt', function() {

    it('is a binary function', function() {
      eq(typeof S.parseInt, 'function');
      eq(S.parseInt.length, 2);
    });

    it('returns a Maybe', function() {
      eq(S.parseInt(10, '42'), S.Just(42));
      eq(S.parseInt(16, '2A'), S.Just(42));
      eq(S.parseInt(10, 'xxx'), S.Nothing());
    });

    it('is curried', function() {
      eq(S.parseInt(10)('42'), S.Just(42));
    });

  });

  describe('parseJson', function() {

    it('is a unary function', function() {
      eq(typeof S.parseJson, 'function');
      eq(S.parseJson.length, 1);
    });

    it('returns a Just when applied to a valid JSON string', function() {
      eq(S.parseJson('["foo","bar"]'), S.Just(['foo', 'bar']));
    });

    it('returns a Nothing when applied to an invalid JSON string', function() {
      eq(S.parseJson('[Invalid JSON]'), S.Nothing());
    });

  });

});

describe('regexp', function() {

  describe('match', function() {

    it('returns a Just containing an array of Justs', function() {
      eq(S.match(/abcd/, 'abcdefg'), S.Just([S.Just('abcd')]));
    });

    it('supports global patterns', function() {
      eq(S.match(/[a-z]a/g, 'bananas'),
         S.Just([S.Just('ba'), S.Just('na'), S.Just('na')]));
    });

    it('supports (optional) capturing groups', function() {
      eq(S.match(/(good)?bye/, 'goodbye'),
         S.Just([S.Just('goodbye'), S.Just('good')]));
      eq(S.match(/(good)?bye/, 'bye'),
         S.Just([S.Just('bye'), S.Nothing()]));
    });

    it('returns a Nothing() if no match', function() {
      eq(S.match(/zzz/, 'abcdefg'), S.Nothing());
    });

  });

});
