'use strict';

/* global describe, it */

var assert = require('assert');

var R = require('ramda');

var S = require('..');


var eq = assert.strictEqual;

//  square :: Number -> Number
var square = function(n) { return n * n; };


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
      assert.throws(
        function() { S.Maybe(); },
        function(err) {
          return err instanceof Error &&
                 err.message === 'Cannot instantiate Maybe';
        }
      );
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
      var nothing = S.Nothing();
      assert(nothing instanceof S.Maybe);
      eq(nothing.type, S.Maybe);
    });

    it('provides an "ap" method', function() {
      var nothing = S.Nothing();
      eq(nothing.ap.length, 1);
      assert(nothing.ap(S.Nothing()).equals(S.Nothing()));
      assert(nothing.ap(S.Just(42)).equals(S.Nothing()));
    });

    it('provides a "chain" method', function() {
      var nothing = S.Nothing();
      eq(nothing.chain.length, 1);
      eq(nothing.chain(S.head), nothing);
    });

    it('provides a "concat" method', function() {
      var nothing = S.Nothing();
      eq(nothing.concat.length, 1);
      assert(nothing.concat(S.Nothing()).equals(S.Nothing()));
      assert(nothing.concat(S.Just('foo')).equals(S.Just('foo')));
    });

    it('provides an "equals" method', function() {
      var nothing = S.Nothing();
      eq(nothing.equals.length, 1);
      eq(nothing.equals(nothing), true);
      eq(nothing.equals(S.Nothing()), true);
      eq(nothing.equals(new S.Nothing()), true);
      eq(nothing.equals(S.Just(42)), false);
    });

    it('provides a "filter" method', function() {
      var nothing = S.Nothing();
      eq(nothing.filter.length, 1);
      assert(nothing.filter(R.T).equals(S.Nothing()));
      assert(nothing.filter(R.F).equals(S.Nothing()));

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
      var nothing = S.Nothing();
      eq(nothing.map.length, 1);
      eq(nothing.map(function() { return 42; }), nothing);
    });

    it('provides a "toBoolean" method', function() {
      var nothing = S.Nothing();
      eq(nothing.toBoolean.length, 0);
      eq(nothing.toBoolean(), false);
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
      var just = S.Just(42);
      assert(just instanceof S.Maybe);
      eq(just.type, S.Maybe);
    });

    it('provides an "ap" method', function() {
      var just = S.Just(R.inc);
      eq(just.ap.length, 1);
      assert(just.ap(S.Nothing()).equals(S.Nothing()));
      assert(just.ap(S.Just(42)).equals(S.Just(43)));
    });

    it('provides a "chain" method', function() {
      var just = S.Just([1, 2, 3]);
      eq(just.chain.length, 1);
      assert(just.chain(S.head).equals(S.Just(1)));
    });

    it('provides a "concat" method', function() {
      var just = S.Just('foo');
      eq(just.concat.length, 1);
      assert(just.concat(S.Nothing()).equals(S.Just('foo')));
      assert(just.concat(S.Just('bar')).equals(S.Just('foobar')));
    });

    it('provides an "equals" method', function() {
      var just = S.Just(42);
      eq(just.equals.length, 1);
      eq(just.equals(just), true);
      eq(just.equals(S.Just(42)), true);
      eq(just.equals(new S.Just(42)), true);
      eq(just.equals(S.Just(43)), false);
      eq(just.equals(S.Nothing()), false);
    });

    it('provides a "filter" method', function() {
      var just = S.Just(42);
      eq(just.filter.length, 1);
      assert(just.filter(R.T).equals(S.Just(42)));
      assert(just.filter(R.F).equals(S.Nothing()));
      assert(just.filter(function(n) { return n > 0; }).equals(S.Just(42)));
      assert(just.filter(function(n) { return n < 0; }).equals(S.Nothing()));

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
      var just = S.Just(42);
      eq(just.map.length, 1);
      assert(just.map(function(x) { return x / 2; }).equals(S.Just(21)));
    });

    it('provides a "toBoolean" method', function() {
      var just = S.Just(42);
      eq(just.toBoolean.length, 0);
      eq(just.toBoolean(), true);
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
      assert.throws(
        function() { S.fromMaybe(0, []); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Pattern match failure';
        }
      );
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
      assert(S.toMaybe(null).equals(S.Nothing()));
      assert(S.toMaybe(undefined).equals(S.Nothing()));
    });

    it('returns a Just when applied to any other value', function() {
      assert(S.toMaybe(0).equals(S.Just(0)));
      assert(S.toMaybe(false).equals(S.Just(false)));
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
      assert(S.encase(factorial)(5).equals(S.Just(120)));
    });

    it('returns a function which returns a Nothing on failure', function() {
      assert(S.encase(factorial)(-1).equals(S.Nothing()));
    });

    it('can be applied to a function of arbitrary arity', function() {
      var f = S.encase(function(a, b, c, d, e) { return e; });
      assert(f(1, 2, 3, 4, 5).equals(S.Just(5)));
    });

    it('returns a function of appropriate arity', function() {
      var f = S.encase(function(a, b, c, d, e) { return e; });
      eq(f.length, 5);
    });

    it('preserves context', function() {
      var f = S.encase(function() { return this; });
      var ctx = {};
      assert(f.call(ctx).equals(S.Just(ctx)));
    });

  });

});

describe('either', function() {

  describe('Either', function() {

    it('throws if called', function() {
      assert.throws(
        function() { S.Either(); },
        function(err) {
          return err instanceof Error &&
                 err.message === 'Cannot instantiate Either';
        }
      );
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
      var left = S.Left(42);
      assert(left instanceof S.Either);
      eq(left.type, S.Either);
    });

    it('provides an "equals" method', function() {
      var left = S.Left(42);
      eq(left.equals.length, 1);
      eq(left.equals(left), true);
      eq(left.equals(S.Left(42)), true);
      eq(left.equals(new S.Left(42)), true);
      eq(left.equals(S.Left('42')), false);
      eq(left.equals(S.Right(42)), false);
    });

    it('provides a "map" method', function() {
      var left = S.Left('Cannot divide by zero');
      eq(left.map.length, 1);
      eq(left.map(square), left);
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
      var right = S.Right(42);
      assert(right instanceof S.Either);
      eq(right.type, S.Either);
    });

    it('provides an "equals" method', function() {
      var right = S.Right(42);
      eq(right.equals.length, 1);
      eq(right.equals(right), true);
      eq(right.equals(S.Right(42)), true);
      eq(right.equals(new S.Right(42)), true);
      eq(right.equals(S.Right('42')), false);
      eq(right.equals(S.Left(42)), false);
    });

    it('provides a "map" method', function() {
      var right = S.Right(42);
      eq(right.map.length, 1);
      assert(right.map(square).equals(S.Right(1764)));
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
      assert.throws(
        function() { S.either(R.length, square, []); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Pattern match failure';
        }
      );
    });

    it('is curried', function() {
      eq(S.either(R.length)(square)(S.Left('abc')), 3);
      eq(S.either(R.length)(square, S.Left('abc')), 3);
      eq(S.either(R.length, square)(S.Left('abc')), 3);
    });

  });

});

describe('control', function() {

  var empty = [];
  var empty2 = [];
  var nonempty = [42];
  var nonempty2 = [42];

  var nothing = S.Nothing();
  var nothing2 = S.Nothing();
  var just = S.Just(42);
  var just2 = S.Just(42);

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
      eq(S.and(empty, empty2), empty);
      eq(S.and(empty, nonempty), empty);
      eq(S.and(nonempty, empty), empty);
      eq(S.and(nonempty, nonempty2), nonempty2);
    });

    it('can be applied to maybes', function() {
      eq(S.and(nothing, nothing2), nothing);
      eq(S.and(nothing, just), nothing);
      eq(S.and(just, nothing), nothing);
      eq(S.and(just, just2), just2);
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(
        function() { S.and(empty, nothing); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Type mismatch';
        }
      );

      assert.throws(
        function() { S.and(nothing, foo); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Type mismatch';
        }
      );
    });

    it('is curried', function() {
      eq(S.and(empty)(nonempty), empty);
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
      eq(S.or(empty, empty2), empty2);
      eq(S.or(empty, nonempty), nonempty);
      eq(S.or(nonempty, empty), nonempty);
      eq(S.or(nonempty, nonempty2), nonempty);
    });

    it('can be applied to maybes', function() {
      eq(S.or(nothing, nothing2), nothing2);
      eq(S.or(nothing, just), just);
      eq(S.or(just, nothing), just);
      eq(S.or(just, just2), just);
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(
        function() { S.or(empty, nothing); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Type mismatch';
        }
      );

      assert.throws(
        function() { S.or(nothing, foo); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Type mismatch';
        }
      );
    });

    it('is curried', function() {
      eq(S.or(empty)(nonempty), nonempty);
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
      eq(S.xor(empty, empty2).length, 0);
      eq(S.xor(empty, nonempty), nonempty);
      eq(S.xor(nonempty, empty), nonempty);
      eq(S.xor(nonempty, nonempty2).length, 0);
    });

    it('can be applied to maybes', function() {
      eq(S.xor(nothing, nothing2).constructor, S.Nothing);
      eq(S.xor(nothing, just), just);
      eq(S.xor(just, nothing), just);
      eq(S.xor(just, just2).constructor, S.Nothing);
    });

    it('throws if applied to values of different types', function() {
      function Foo() {}
      Foo.prototype.type = Foo;
      var foo = new Foo();

      assert.throws(
        function() { S.xor(empty, nothing); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Type mismatch';
        }
      );

      assert.throws(
        function() { S.xor(nothing, foo); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Type mismatch';
        }
      );
    });

    it('is curried', function() {
      eq(S.xor(empty)(nonempty), nonempty);
    });

  });

});

describe('list', function() {

  describe('at', function() {

    it('is a binary function', function() {
      eq(typeof S.at, 'function');
      eq(S.at.length, 2);
    });

    it('returns Just the nth element of a list', function() {
      assert(S.at(1, ['foo', 'bar', 'baz']).equals(S.Just('bar')));
    });

    it('accepts negative offset', function() {
      assert(S.at(-1, ['foo', 'bar', 'baz']).equals(S.Just('baz')));
    });

    it('returns a Nothing if index out of bounds', function() {
      assert(S.at(3, ['foo', 'bar', 'baz']).equals(S.Nothing()));
      assert(S.at(-4, ['foo', 'bar', 'baz']).equals(S.Nothing()));
    });

    it('is curried', function() {
      assert(S.at(1)(['foo', 'bar', 'baz']).equals(S.Just('bar')));
    });

  });

  describe('head', function() {

    it('is a unary function', function() {
      eq(typeof S.head, 'function');
      eq(S.head.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      assert(S.head([]).equals(S.Nothing()));
    });

    it('returns Just the head of a nonempty list', function() {
      assert(S.head(['foo', 'bar', 'baz']).equals(S.Just('foo')));
    });

  });

  describe('last', function() {

    it('is a unary function', function() {
      eq(typeof S.last, 'function');
      eq(S.last.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      assert(S.last([]).equals(S.Nothing()));
    });

    it('returns Just the last element of a nonempty list', function() {
      assert(S.last(['foo', 'bar', 'baz']).equals(S.Just('baz')));
    });

  });

  describe('tail', function() {

    it('is a unary function', function() {
      eq(typeof S.tail, 'function');
      eq(S.tail.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      assert(S.tail([]).equals(S.Nothing()));
    });

    it('returns Just the tail of a nonempty list', function() {
      var result = S.tail(['foo', 'bar', 'baz']);
      eq(result.constructor, S.Just);
      eq(JSON.stringify(S.fromMaybe(null, result)), '["bar","baz"]');
    });

  });

  describe('init', function() {

    it('is a unary function', function() {
      eq(typeof S.init, 'function');
      eq(S.init.length, 1);
    });

    it('returns a Nothing if applied to empty list', function() {
      assert(S.init([]).equals(S.Nothing()));
    });

    it('returns Just the initial elements of a nonempty list', function() {
      var result = S.init(['foo', 'bar', 'baz']);
      eq(result.constructor, S.Just);
      eq(JSON.stringify(S.fromMaybe(null, result)), '["foo","bar"]');
    });

  });

  describe('find', function() {

    it('is a binary function', function() {
      eq(typeof S.find, 'function');
      eq(S.find.length, 2);
    });

    it('returns Just the first element satisfying the predicate', function() {
      assert(S.find(R.T, [null]).equals(S.Just(null)));
      assert(S.find(function(n) { return n >= 0; }, [-1, 0, 1])
             .equals(S.Just(0)));
    });

    it('returns a Nothing if no element satisfies the predicate', function() {
      assert(S.find(R.T, []).equals(S.Nothing()));
      assert(S.find(R.F, [1, 2, 3]).equals(S.Nothing()));
    });

    it('is curried', function() {
      assert(S.find(R.T)([null]).equals(S.Just(null)));
    });

  });

  describe('pluck', function() {

    it('returns array of Justs for found keys', function() {
      var xs = [{a: 1, b: 3}, {a: 2, b: 4}, {a: 3, b: 5}];
      var maybeXs = [S.Just(1), S.Just(2), S.Just(3)];
      assert.deepEqual(S.pluck('a', xs), maybeXs);
    });

    it('returns array of Nothings for keys not found', function() {
      var xs = [{a: 1, b: 3}, {a: 2, b: 4}, {a: 3, b: 5}];
      var maybeXs = [S.Nothing(), S.Nothing(), S.Nothing()];
      assert.deepEqual(S.pluck('c', xs), maybeXs);
    });

    it('returns Just(undefined) for defined key with no value', function() {
      var xs = [{a: 1, b: 3}, {a: void 0, b: 4}, {a: 3, b: 5}];
      var maybeXs = [S.Just(1), S.Just(void 0), S.Just(3)];
      assert.deepEqual(S.pluck('a', xs), maybeXs);
    });

    it('returns an array of Maybes for various values', function() {
      var xs = [{a: 1}, {a: void 0}, {a: 4}, {b: 1}];
      var maybeXs = [S.Just(1), S.Just(void 0), S.Just(4), S.Nothing()];
      assert.deepEqual(S.pluck('a', xs), maybeXs);
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
      assert(S.get('x', obj).equals(S.Just(0)));
      assert(S.get('y', obj).equals(S.Just(42)));
      assert(S.get('z', obj).equals(S.Nothing()));
    });

  });

  describe('gets', function() {

    it('returns a Maybe', function() {
      var obj = {x: {z: 0}, y: 42};
      assert.deepEqual(S.fromMaybe({}, S.gets([], obj)), obj);
      assert(S.gets(['y'], obj).equals(S.Just(42)));
      assert(S.gets(['z'], obj).equals(S.Nothing()));
      assert(S.gets(['x', 'z'], obj).equals(S.Just(0)));
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
      var maybe = S.parseDate('2001-02-03T04:05:06Z');
      eq(maybe.constructor, S.Just);
      eq(S.fromMaybe(null, maybe).constructor, Date);
      eq(S.fromMaybe(null, maybe).getFullYear(), 2001);
    });

    it('returns a Nothing when applied to an invalid date string', function() {
      var maybe = S.parseDate('today');
      eq(maybe.constructor, S.Nothing);
    });

  });

  describe('parseFloat', function() {

    it('is a unary function', function() {
      eq(typeof S.parseFloat, 'function');
      eq(S.parseFloat.length, 1);
    });

    it('returns a Maybe', function() {
      assert(S.parseFloat('12.34').equals(S.Just(12.34)));
      assert(S.parseFloat('xxx').equals(S.Nothing()));
    });

  });

  describe('parseInt', function() {

    it('is a binary function', function() {
      eq(typeof S.parseInt, 'function');
      eq(S.parseInt.length, 2);
    });

    it('returns a Maybe', function() {
      assert(S.parseInt(10, '42').equals(S.Just(42)));
      assert(S.parseInt(16, '2A').equals(S.Just(42)));
      assert(S.parseInt(10, 'xxx').equals(S.Nothing()));
    });

    it('is curried', function() {
      assert(S.parseInt(10)('42').equals(S.Just(42)));
    });

  });

  describe('parseJson', function() {

    it('is a unary function', function() {
      eq(typeof S.parseJson, 'function');
      eq(S.parseJson.length, 1);
    });

    it('returns a Just when applied to a valid JSON string', function() {
      var xs = S.fromMaybe(null, S.parseJson('["foo","bar"]'));
      eq(Object.prototype.toString.call(xs), '[object Array]');
      eq(xs.length, 2);
      eq(xs[0], 'foo');
      eq(xs[1], 'bar');
    });

    it('returns a Nothing when applied to an invalid JSON string', function() {
      assert(S.parseJson('[Invalid JSON]').equals(S.Nothing()));
    });

  });

});
