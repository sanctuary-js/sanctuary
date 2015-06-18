'use strict';

/* global describe, it */

var assert = require('assert');

var R = require('ramda');

var S = require('..');


var eq = function(actual, expected) {
  assert.strictEqual(R.toString(actual), R.toString(expected));
};

//  errorEq :: Function -> String -> Error -> Boolean
var errorEq = R.curry(function(type, message, error) {
  return error.constructor === type && error.message === message;
});

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
                    errorEq(Error, 'Cannot instantiate Maybe'));
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

      assert.throws(function() { S.Nothing().ap([1, 2, 3]); },
                    errorEq(TypeError,
                            'Nothing#ap requires a value of type Maybe ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Nothing().chain.length, 1);
      eq(S.Nothing().chain(S.head), S.Nothing());

      assert.throws(function() { S.Nothing().chain(null); },
                    errorEq(TypeError,
                            'Nothing#chain requires a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "concat" method', function() {
      eq(S.Nothing().concat.length, 1);
      eq(S.Nothing().concat(S.Nothing()), S.Nothing());
      eq(S.Nothing().concat(S.Just('foo')), S.Just('foo'));

      assert.throws(function() { S.Nothing().concat([1, 2, 3]); },
                    errorEq(TypeError,
                            'Nothing#concat requires a value of type Maybe ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides an "equals" method', function() {
      eq(S.Nothing().equals.length, 1);
      eq(S.Nothing().equals(S.Nothing()), true);
      eq(S.Nothing().equals(S.Just(42)), false);
      eq(S.Nothing().equals(null), false);
    });

    it('provides an "extend" method', function() {
      eq(S.Nothing().extend.length, 1);
      eq(S.Nothing().extend(function(x) { return x.value / 2; }), S.Nothing());

      // associativity
      var w = S.Nothing();
      var f = function(x) { return x.value + 1; };
      var g = function(x) { return x.value * x.value; };
      eq(w.extend(g).extend(f),
         w.extend(function(_w) { return f(_w.extend(g)); }));

      assert.throws(function() { S.Nothing().extend([1, 2, 3]); },
                    errorEq(TypeError,
                            'Nothing#extend requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

      assert.throws(function() { S.Nothing().filter([1, 2, 3]); },
                    errorEq(TypeError,
                            'Maybe#filter requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "map" method', function() {
      eq(S.Nothing().map.length, 1);
      eq(S.Nothing().map(function() { return 42; }), S.Nothing());

      assert.throws(function() { S.Nothing().map([1, 2, 3]); },
                    errorEq(TypeError,
                            'Nothing#map requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

      assert.throws(function() { S.Just(R.inc).ap([1, 2, 3]); },
                    errorEq(TypeError,
                            'Just#ap requires a value of type Maybe ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Just([1, 2, 3]).chain.length, 1);
      eq(S.Just([1, 2, 3]).chain(S.head), S.Just(1));

      assert.throws(function() { S.Just([1, 2, 3]).chain([1, 2, 3]); },
                    errorEq(TypeError,
                            'Just#chain requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "concat" method', function() {
      eq(S.Just('foo').concat.length, 1);
      eq(S.Just('foo').concat(S.Nothing()), S.Just('foo'));
      eq(S.Just('foo').concat(S.Just('bar')), S.Just('foobar'));

      assert.throws(function() { S.Just('foo').concat([1, 2, 3]); },
                    errorEq(TypeError,
                            'Just#concat requires a value of type Maybe ' +
                            'as its first argument; received [1, 2, 3]'));
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
      // jshint -W053
      eq(S.Just(new Number(42)).equals(S.Just(new Number(42))), true);
      eq(S.Just(new Number(42)).equals(42), false);
      // jshint +W053
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

      assert.throws(function() { S.Just(42).extend([1, 2, 3]); },
                    errorEq(TypeError,
                            'Just#extend requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

      assert.throws(function() { S.Just(42).filter([1, 2, 3]); },
                    errorEq(TypeError,
                            'Maybe#filter requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "map" method', function() {
      eq(S.Just(42).map.length, 1);
      eq(S.Just(42).map(function(x) { return x / 2; }), S.Just(21));

      assert.throws(function() { S.Just(42).map([1, 2, 3]); },
                    errorEq(TypeError,
                            'Just#map requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.fromMaybe(0, [1, 2, 3]); },
                    errorEq(TypeError,
                            'fromMaybe requires a value of type Maybe ' +
                            'as its second argument; received [1, 2, 3]'));
    });

    it('can be applied to a Nothing', function() {
      eq(S.fromMaybe(0, S.Nothing()), 0);
    });

    it('can be applied to a Just', function() {
      eq(S.fromMaybe(0, S.Just(42)), 42);
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.encase([1, 2, 3]); },
                    errorEq(TypeError,
                            'encase requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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
                    errorEq(Error, 'Cannot instantiate Either'));
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

      assert.throws(function() { S.Left('abc').ap([1, 2, 3]); },
                    errorEq(TypeError,
                            'Left#ap requires a value of type Either ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Left('abc').chain.length, 1);
      eq(S.Left('abc').chain(squareRoot), S.Left('abc'));

      assert.throws(function() { S.Left('abc').chain([1, 2, 3]); },
                    errorEq(TypeError,
                            'Left#chain requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "concat" method', function() {
      eq(S.Left('abc').concat.length, 1);
      eq(S.Left('abc').concat(S.Left('def')), S.Left('abcdef'));
      eq(S.Left('abc').concat(S.Right('xyz')), S.Right('xyz'));

      assert.throws(function() { S.Left('abc').concat([1, 2, 3]); },
                    errorEq(TypeError,
                            'Left#concat requires a value of type Either ' +
                            'as its first argument; received [1, 2, 3]'));
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
      // jshint -W053
      eq(S.Left(new Number(42)).equals(S.Left(new Number(42))), true);
      eq(S.Left(new Number(42)).equals(42), false);
      // jshint +W053
    });

    it('provides an "extend" method', function() {
      eq(S.Left('abc').extend.length, 1);
      eq(S.Left('abc').extend(function(x) { return x / 2; }), S.Left('abc'));

      // associativity
      var w = S.Left('abc');
      var f = function(x) { return x.value + 1; };
      var g = function(x) { return x.value * x.value; };
      eq(w.extend(g).extend(f),
         w.extend(function(_w) { return f(_w.extend(g)); }));

      assert.throws(function() { S.Left('abc').extend([1, 2, 3]); },
                    errorEq(TypeError,
                            'Left#extend requires a value of type Function' +
                            ' as its first argument; received [1, 2, 3]'));
    });

    it('provides a "map" method', function() {
      eq(S.Left('abc').map.length, 1);
      eq(S.Left('abc').map(square), S.Left('abc'));

      assert.throws(function() { S.Left('abc').map([1, 2, 3]); },
                    errorEq(TypeError,
                            'Left#map requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

      assert.throws(function() { S.Right(R.inc).ap([1, 2, 3]); },
                    errorEq(TypeError,
                            'Right#ap requires a value of type Either ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Right(25).chain.length, 1);
      eq(S.Right(25).chain(squareRoot), S.Right(5));

      assert.throws(function() { S.Right(25).chain([1, 2, 3]); },
                    errorEq(TypeError,
                            'Right#chain requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "concat" method', function() {
      eq(S.Right('abc').concat.length, 1);
      eq(S.Right('abc').concat(S.Left('xyz')), S.Right('abc'));
      eq(S.Right('abc').concat(S.Right('def')), S.Right('abcdef'));

      assert.throws(function() { S.Right('abc').concat([1, 2, 3]); },
                    errorEq(TypeError,
                            'Right#concat requires a value of type Either ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides an "equals" method', function() {
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
      // jshint -W053
      eq(S.Right(new Number(42)).equals(S.Right(new Number(42))), true);
      eq(S.Right(new Number(42)).equals(42), false);
      // jshint +W053
    });

    it('provides an "extend" method', function() {
      eq(S.Right(42).extend.length, 1);
      eq(S.Right(42).extend(function(x) { return x.value / 2; }), S.Right(21));

      // associativity
      var w = S.Right(42);
      var f = function(x) { return x.value + 1; };
      var g = function(x) { return x.value * x.value; };
      eq(w.extend(g).extend(f),
         w.extend(function(_w) { return f(_w.extend(g)); }));

      assert.throws(function() { S.Right('abc').extend([1, 2, 3]); },
                    errorEq(TypeError,
                            'Right#extend requires a value of type Function' +
                            ' as its first argument; received [1, 2, 3]'));
    });

    it('provides a "map" method', function() {
      eq(S.Right(42).map.length, 1);
      eq(S.Right(42).map(square), S.Right(1764));

      assert.throws(function() { S.Right(42).map([1, 2, 3]); },
                    errorEq(TypeError,
                            'Right#map requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.either([1, 2, 3]); },
                    errorEq(TypeError,
                            'either requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.__, square)([1, 2, 3]); },
                    errorEq(TypeError,
                            'either requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length, [1, 2, 3]); },
                    errorEq(TypeError,
                            'either requires a value of type Function ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length)([1, 2, 3]); },
                    errorEq(TypeError,
                            'either requires a value of type Function ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length, square, [1, 2, 3]); },
                    errorEq(TypeError,
                            'either requires a value of type Either ' +
                            'as its third argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length)(square)([1, 2, 3]); },
                    errorEq(TypeError,
                            'either requires a value of type Either ' +
                            'as its third argument; received [1, 2, 3]'));
    });

    it('can be applied to a Left', function() {
      eq(S.either(R.length, square, S.Left('abc')), 3);
    });

    it('can be applied to a Right', function() {
      eq(S.either(R.length, square, S.Right(42)), 1764);
    });

    it('is curried', function() {
      var f = R.length;
      var g = square;
      var x = S.Left('abc');
      var _ = R.__;

      eq(S.either(f)(g)(x), 3);
      eq(S.either(f)(g, x), 3);
      eq(S.either(f, g)(x), 3);
      eq(S.either(f, g, x), 3);

      eq(S.either(_, g, x)(f), 3);
      eq(S.either(f, _, x)(g), 3);
      eq(S.either(f, g, _)(x), 3);

      eq(S.either(f, _, _)(g)(x), 3);
      eq(S.either(_, g, _)(f)(x), 3);
      eq(S.either(_, _, x)(f)(g), 3);

      eq(S.either(f, _, _)(g, x), 3);
      eq(S.either(_, g, _)(f, x), 3);
      eq(S.either(_, _, x)(f, g), 3);

      eq(S.either(f, _, _)(_, x)(g), 3);
      eq(S.either(_, g, _)(_, x)(f), 3);
      eq(S.either(_, _, x)(_, g)(f), 3);

      eq(S.either(_, _, _)(_, _)(_)(f, g, x), 3);
      eq(S.either(_, _, _)(f, _, _)(_, _)(g, _)(_)(x), 3);
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
                    errorEq(TypeError, 'Type mismatch'));

      assert.throws(function() { S.and(S.Nothing(), foo); },
                    errorEq(TypeError, 'Type mismatch'));
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.and(0, 1); },
                    errorEq(TypeError,
                            '0 does not have a "toBoolean" method'));
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
                    errorEq(TypeError, 'Type mismatch'));

      assert.throws(function() { S.or(S.Nothing(), foo); },
                    errorEq(TypeError, 'Type mismatch'));
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.or(0, 1); },
                    errorEq(TypeError,
                            '0 does not have a "toBoolean" method'));
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
      assert.throws(function() { S.xor(S.Left('foo'), S.Left('bar')); },
                    errorEq(TypeError,
                            'Left("foo") does not have an "empty" method'));

      assert.throws(function() { S.xor(S.Left('foo'), S.Right(42)); },
                    errorEq(TypeError,
                            'Left("foo") does not have an "empty" method'));

      assert.throws(function() { S.xor(S.Right(42), S.Left('foo')); },
                    errorEq(TypeError,
                            'Right(42) does not have an "empty" method'));

      assert.throws(function() { S.xor(S.Right(42), S.Right(43)); },
                    errorEq(TypeError,
                            'Right(42) does not have an "empty" method'));
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(function() { S.xor([], S.Nothing()); },
                    errorEq(TypeError, 'Type mismatch'));

      assert.throws(function() { S.xor(S.Nothing(), foo); },
                    errorEq(TypeError, 'Type mismatch'));
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.xor(0, 1); },
                    errorEq(TypeError,
                            '0 does not have a "toBoolean" method'));
    });

    it('is curried', function() {
      eq(S.xor([])([42]), [42]);
    });

  });

});

describe('list', function() {

  describe('at', function() {

    it('is a binary function', function() {
      eq(typeof S.at, 'function');
      eq(S.at.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.at([1, 2, 3]); },
                    errorEq(TypeError,
                            'at requires a value of type Number ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('is a ternary function', function() {
      eq(typeof S.slice, 'function');
      eq(S.slice.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.slice([1, 2, 3]); },
                    errorEq(TypeError,
                            'slice requires a value of type Number ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.slice(0, [1, 2, 3]); },
                    errorEq(TypeError,
                            'slice requires a value of type Number ' +
                            'as its second argument; received [1, 2, 3]'));
    });

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

    it('can operate on strings', function() {
      eq(S.slice(0, -0, 'ramda'), S.Just('ramda'));
      eq(S.slice(1, -3, 'ramda'), S.Just('a'));
      eq(S.slice(2, -3, 'ramda'), S.Just(''));
      eq(S.slice(3, -3, 'ramda'), S.Nothing());
    });

    it('is curried', function() {
      eq(S.slice(1)(-1)(['a', 'b', 'c', 'd', 'e']), S.Just(['b', 'c', 'd']));
    });

  });

  describe('extend', function() {

    it('is a binary function', function() {
      eq(typeof S.extend, 'function');
      eq(S.extend.length, 2);
    });

    it('curries its arguments', function() {
      eq(typeof S.extend([1, 2, 3]), 'function');
      eq(S.extend([1, 2, 3]).length, 1);

      eq(typeof S.extend(R.__, R.sum), 'function');
      eq(S.extend(R.__, R.sum).length, 1);
    });

    it('returns an empty list if applied to an empty list', function() {
      eq(S.extend([], R.sum), []);
    });

    it('throws an exception when not given a function', function() {
      assert.throws(function() { S.extend([], 'function'); },
                    errorEq(TypeError,
                            'List#extend requires a value of type Function' +
                            ' as its second argument; received "function"'));
    });

    it('dispatches to inbuilt method if it exists', function() {
      var arr = [1, 2, 3];
      arr.extend = function(f) {
        return [f(this)];
      };
      eq(S.extend(arr, R.sum), [6]);
    });

    it('works as expected on Numbers', function() {
      eq(S.extend([1, 2, 3], R.sum), [6, 5, 3]);
    });

    it('is associative', function() {
      var w = [1, 2, 3];
      var f = R.sum;
      var g = function(l) {
        return l[0] !== undefined ? l[0] : -1;
      };
      eq(S.extend(S.extend(w, g), f),
         S.extend(w, function(_w) { return f(S.extend(_w, g)); }));
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

  describe('take', function() {

    it('is a binary function', function() {
      eq(typeof S.take, 'function');
      eq(S.take.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.take([1, 2, 3]); },
                    errorEq(TypeError,
                            'take requires a value of type Number ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Nothing if n is greater than collection length', function() {
      eq(S.take(6, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.take(6, 'abcde'), S.Nothing());
    });

    it('returns a Nothing if n is negative', function() {
      eq(S.take(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.take(-1, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.take(-0, 'abcdefg'), S.Nothing());
      eq(S.take(-1, 'abcde'), S.Nothing());
    });

    it('returns an empty collection if n is 0', function() {
      eq(S.take(0, ['a', 'b', 'c', 'd', 'e']), S.Just([]));
      eq(S.take(0, 'abcde'), S.Just(''));
    });

    it('returns Just the first two elements from the collection', function() {
      eq(S.take(2, ['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b']));
      eq(S.take(2, 'abcdefg'), S.Just('ab'));
    });

    it('returns Just the whole collection if n is equal to array length', function() {
      eq(S.take(5, ['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b', 'c', 'd', 'e']));
      eq(S.take(7, 'abcdefg'), S.Just('abcdefg'));
    });

    it('is curried', function() {
      eq(S.take(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b', 'c']));
    });

  });

  describe('drop', function() {

    it('is a binary function', function() {
      eq(typeof S.drop, 'function');
      eq(S.drop.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.drop([1, 2, 3]); },
                    errorEq(TypeError,
                            'drop requires a value of type Number ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Nothing if n is greater than collection length', function() {
      eq(S.drop(6, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.drop(6, 'abcde'), S.Nothing());
    });

    it('returns a Nothing if n is negative', function() {
      eq(S.drop(-3, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.drop(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.drop(-3, 'abcde'), S.Nothing());
      eq(S.drop(-0, 'abcde'), S.Nothing());
    });

    it('returns an empty collection if n is equal to collection length', function() {
      eq(S.drop(5, ['a', 'b', 'c', 'd', 'e']), S.Just([]));
      eq(S.drop(5, 'abcde'), S.Just(''));
    });

    it('returns Just the last three elements from the collection', function() {
      eq(S.drop(2, ['a', 'b', 'c', 'd', 'e']), S.Just(['c', 'd', 'e']));
      eq(S.drop(4, 'abcdefg'), S.Just('efg'));
    });

    it('returns Just the whole collection if n is zero', function() {
      eq(S.drop(0, ['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b', 'c', 'd', 'e']));
      eq(S.drop(0, 'abcdefg'), S.Just('abcdefg'));
    });

    it('is curried', function() {
      eq(S.drop(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['d', 'e']));
    });

  });

  describe('find', function() {

    it('is a binary function', function() {
      eq(typeof S.find, 'function');
      eq(S.find.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.find([1, 2, 3]); },
                    errorEq(TypeError,
                            'find requires a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('is a binary function', function() {
      eq(typeof S.indexOf, 'function');
      eq(S.indexOf.length, 2);
    });

    it('returns a Nothing for an empty list', function() {
      eq(S.indexOf(10, []), S.Nothing());
    });

    it('returns a Nothing if the element is not found', function() {
      eq(S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing());
    });

    it('returns Just the index of the element found', function() {
      eq(S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(1));
    });

    it('can operate on strings', function() {
      eq(S.indexOf('an', 'banana'), S.Just(1));
      eq(S.indexOf('ax', 'banana'), S.Nothing());
    });

    it('is curried', function() {
      eq(S.indexOf('c')(['a', 'b', 'c', 'd', 'e']), S.Just(2));
    });

  });

  describe('lastIndexOf', function() {

    it('is a binary function', function() {
      eq(typeof S.lastIndexOf, 'function');
      eq(S.lastIndexOf.length, 2);
    });

    it('returns a Nothing for an empty list', function() {
      eq(S.lastIndexOf('a', []), S.Nothing());
    });

    it('returns a Nothing if the element is not found', function() {
      eq(S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing());
    });

    it('returns Just the last index of the element found', function() {
      eq(S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(5));
    });

    it('can operate on strings', function() {
      eq(S.lastIndexOf('an', 'banana'), S.Just(3));
      eq(S.lastIndexOf('ax', 'banana'), S.Nothing());
    });

    it('is curried', function() {
      eq(S.lastIndexOf('c')(['a', 'b', 'c', 'd', 'e']), S.Just(2));
    });

  });

  describe('pluck', function() {

    it('is a binary function', function() {
      eq(typeof S.pluck, 'function');
      eq(S.pluck.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.pluck([1, 2, 3]); },
                    errorEq(TypeError,
                            'pluck requires a value of type String ' +
                            'as its first argument; received [1, 2, 3]'));
    });

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

    it('is curried', function() {
      var xs = [{x: 1}, {x: 2}, {x: 3}];
      eq(S.pluck('x')(xs), [S.Just(1), S.Just(2), S.Just(3)]);
    });

  });

});

describe('object', function() {

  describe('get', function() {

    it('is a binary function', function() {
      eq(typeof S.get, 'function');
      eq(S.get.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.get([1, 2, 3]); },
                    errorEq(TypeError,
                            'get requires a value of type String ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Maybe', function() {
      var obj = {x: 0, y: 42};
      eq(S.get('x', obj), S.Just(0));
      eq(S.get('y', obj), S.Just(42));
      eq(S.get('z', obj), S.Nothing());
    });

    it('is curried', function() {
      eq(S.get('x')({x: 42}), S.Just(42));
    });

  });

  describe('gets', function() {

    it('is a binary function', function() {
      eq(typeof S.gets, 'function');
      eq(S.gets.length, 2);
    });

    it('returns a Maybe', function() {
      var obj = {x: {z: 0}, y: 42};
      eq(S.gets([], obj), S.Just({x: {z: 0}, y: 42}));
      eq(S.gets(['y'], obj), S.Just(42));
      eq(S.gets(['z'], obj), S.Nothing());
      eq(S.gets(['x', 'z'], obj), S.Just(0));
    });

    it('is curried', function() {
      eq(S.gets(['x'])({x: 42}), S.Just(42));
    });

  });

});

describe('parse', function() {

  describe('parseDate', function() {

    it('is a unary function', function() {
      eq(typeof S.parseDate, 'function');
      eq(S.parseDate.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.parseDate([1, 2, 3]); },
                    errorEq(TypeError,
                            'parseDate requires a value of type String ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.parseFloat([1, 2, 3]); },
                    errorEq(TypeError,
                            'parseFloat requires a value of type String ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.parseInt('10'); },
                    errorEq(TypeError,
                            'parseInt requires a value of type Number ' +
                            'as its first argument; received "10"'));

      assert.throws(function() { S.parseInt(10, 42); },
                    errorEq(TypeError,
                            'parseInt requires a value of type String ' +
                            'as its second argument; received 42'));
    });

    it('returns a Maybe', function() {
      eq(S.parseInt(10, '42'), S.Just(42));
      eq(S.parseInt(16, '2A'), S.Just(42));
      eq(S.parseInt(10, 'xxx'), S.Nothing());
    });

    it('accepts radix in [2 .. 36]', function() {
      eq(S.parseInt(2, '1'), S.Just(1));
      eq(S.parseInt(2, '2'), S.Nothing());
      eq(S.parseInt(3, '2'), S.Just(2));
      eq(S.parseInt(3, '3'), S.Nothing());
      eq(S.parseInt(4, '3'), S.Just(3));
      eq(S.parseInt(4, '4'), S.Nothing());
      eq(S.parseInt(5, '4'), S.Just(4));
      eq(S.parseInt(5, '5'), S.Nothing());
      eq(S.parseInt(6, '5'), S.Just(5));
      eq(S.parseInt(6, '6'), S.Nothing());
      eq(S.parseInt(7, '6'), S.Just(6));
      eq(S.parseInt(7, '7'), S.Nothing());
      eq(S.parseInt(8, '7'), S.Just(7));
      eq(S.parseInt(8, '8'), S.Nothing());
      eq(S.parseInt(9, '8'), S.Just(8));
      eq(S.parseInt(9, '9'), S.Nothing());
      eq(S.parseInt(10, '9'), S.Just(9));
      eq(S.parseInt(10, 'A'), S.Nothing());
      eq(S.parseInt(11, 'A'), S.Just(10));
      eq(S.parseInt(11, 'B'), S.Nothing());
      eq(S.parseInt(12, 'B'), S.Just(11));
      eq(S.parseInt(12, 'C'), S.Nothing());
      eq(S.parseInt(13, 'C'), S.Just(12));
      eq(S.parseInt(13, 'D'), S.Nothing());
      eq(S.parseInt(14, 'D'), S.Just(13));
      eq(S.parseInt(14, 'E'), S.Nothing());
      eq(S.parseInt(15, 'E'), S.Just(14));
      eq(S.parseInt(15, 'F'), S.Nothing());
      eq(S.parseInt(16, 'F'), S.Just(15));
      eq(S.parseInt(16, 'G'), S.Nothing());
      eq(S.parseInt(17, 'G'), S.Just(16));
      eq(S.parseInt(17, 'H'), S.Nothing());
      eq(S.parseInt(18, 'H'), S.Just(17));
      eq(S.parseInt(18, 'I'), S.Nothing());
      eq(S.parseInt(19, 'I'), S.Just(18));
      eq(S.parseInt(19, 'J'), S.Nothing());
      eq(S.parseInt(20, 'J'), S.Just(19));
      eq(S.parseInt(20, 'K'), S.Nothing());
      eq(S.parseInt(21, 'K'), S.Just(20));
      eq(S.parseInt(21, 'L'), S.Nothing());
      eq(S.parseInt(22, 'L'), S.Just(21));
      eq(S.parseInt(22, 'M'), S.Nothing());
      eq(S.parseInt(23, 'M'), S.Just(22));
      eq(S.parseInt(23, 'N'), S.Nothing());
      eq(S.parseInt(24, 'N'), S.Just(23));
      eq(S.parseInt(24, 'O'), S.Nothing());
      eq(S.parseInt(25, 'O'), S.Just(24));
      eq(S.parseInt(25, 'P'), S.Nothing());
      eq(S.parseInt(26, 'P'), S.Just(25));
      eq(S.parseInt(26, 'Q'), S.Nothing());
      eq(S.parseInt(27, 'Q'), S.Just(26));
      eq(S.parseInt(27, 'R'), S.Nothing());
      eq(S.parseInt(28, 'R'), S.Just(27));
      eq(S.parseInt(28, 'S'), S.Nothing());
      eq(S.parseInt(29, 'S'), S.Just(28));
      eq(S.parseInt(29, 'T'), S.Nothing());
      eq(S.parseInt(30, 'T'), S.Just(29));
      eq(S.parseInt(30, 'U'), S.Nothing());
      eq(S.parseInt(31, 'U'), S.Just(30));
      eq(S.parseInt(31, 'V'), S.Nothing());
      eq(S.parseInt(32, 'V'), S.Just(31));
      eq(S.parseInt(32, 'W'), S.Nothing());
      eq(S.parseInt(33, 'W'), S.Just(32));
      eq(S.parseInt(33, 'X'), S.Nothing());
      eq(S.parseInt(34, 'X'), S.Just(33));
      eq(S.parseInt(34, 'Y'), S.Nothing());
      eq(S.parseInt(35, 'Y'), S.Just(34));
      eq(S.parseInt(35, 'Z'), S.Nothing());
      eq(S.parseInt(36, 'Z'), S.Just(35));
      eq(S.parseInt(36, '['), S.Nothing());
    });

    it('throws if radix is not in [2 .. 36]', function() {
      assert.throws(function() { S.parseInt(1, ''); },
                    errorEq(RangeError, 'Radix not in [2 .. 36]'));

      assert.throws(function() { S.parseInt(37, ''); },
                    errorEq(RangeError, 'Radix not in [2 .. 36]'));
    });

    it('is not case-sensitive', function() {
      eq(S.parseInt(16, 'FF'), S.Just(255));
      eq(S.parseInt(16, 'Ff'), S.Just(255));
      eq(S.parseInt(16, 'fF'), S.Just(255));
      eq(S.parseInt(16, 'ff'), S.Just(255));
    });

    it('accepts optional "+" or "-" prefix', function() {
      eq(S.parseInt(10, '+42'), S.Just(42));
      eq(S.parseInt(16, '+2A'), S.Just(42));
      eq(S.parseInt(10, '-42'), S.Just(-42));
      eq(S.parseInt(16, '-2A'), S.Just(-42));
    });

    it('accepts optional "0x" or "0X" prefix when radix is 16', function() {
      eq(S.parseInt(16, '0xFF'), S.Just(255));
      eq(S.parseInt(16, '0XFF'), S.Just(255));
      eq(S.parseInt(17, '0xFF'), S.Nothing());
      eq(S.parseInt(17, '0XFF'), S.Nothing());
      eq(S.parseInt(16, '+0xFF'), S.Just(255));
      eq(S.parseInt(16, '+0XFF'), S.Just(255));
      eq(S.parseInt(16, '-0xFF'), S.Just(-255));
      eq(S.parseInt(16, '-0XFF'), S.Just(-255));
    });

    it('returns a Nothing if one or more characters are invalid', function() {
      eq(S.parseInt(16, 'alice'), S.Nothing());  // parseInt('alice', 16) == 10
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.parseJson([1, 2, 3]); },
                    errorEq(TypeError,
                            'parseJson requires a value of type String ' +
                            'as its first argument; received [1, 2, 3]'));
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

    it('is a binary function', function() {
      eq(typeof S.match, 'function');
      eq(S.match.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.match([1, 2, 3]); },
                    errorEq(TypeError,
                            'match requires a value of type RegExp ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.match(/(?:)/, [1, 2, 3]); },
                    errorEq(TypeError,
                            'match requires a value of type String ' +
                            'as its second argument; received [1, 2, 3]'));
    });

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

    it('is curried', function() {
      eq(S.match(/x/)('xyz'), S.Just([S.Just('x')]));
    });

  });

});
