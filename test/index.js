'use strict';

/* global describe, it */

var assert = require('assert');

var S = require('..');


var eq = assert.strictEqual;


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

    it('provides an "equals" method', function() {
      var nothing = S.Nothing();
      eq(nothing.equals.length, 1);
      eq(nothing.equals(nothing), true);
      eq(nothing.equals(S.Nothing()), true);
      eq(nothing.equals(new S.Nothing()), true);
      eq(nothing.equals(S.Just(42)), false);
    });

    it('provides a "map" method', function() {
      var nothing = S.Nothing();
      eq(nothing.map.length, 1);
      eq(nothing.map(function() { return 42; }), nothing);
    });

    it('provides an "or" method', function() {
      var nothing = S.Nothing();
      var just = S.Just(42);
      eq(S.Nothing().or.length, 1);
      eq(S.Nothing().or(nothing), nothing);
      eq(S.Nothing().or(just), just);
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

    it('provides an "equals" method', function() {
      var just = S.Just(42);
      eq(just.equals.length, 1);
      eq(just.equals(just), true);
      eq(just.equals(S.Just(42)), true);
      eq(just.equals(new S.Just(42)), true);
      eq(just.equals(S.Just(43)), false);
      eq(just.equals(S.Nothing()), false);
    });

    it('provides a "map" method', function() {
      var just = S.Just(42);
      eq(just.map.length, 1);
      assert(just.map(function(x) { return x / 2; }).equals(S.Just(21)));
    });

    it('provides an "or" method', function() {
      var just = S.Just(42);
      eq(just.or.length, 1);
      eq(just.or(S.Nothing()), just);
      eq(just.or(S.Just(42)), just);
    });

  });

  describe('fromMaybe', function() {

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

    it('returns a Nothing when applied to null/undefined', function() {
      assert(S.toMaybe(null).equals(S.Nothing()));
      assert(S.toMaybe(undefined).equals(S.Nothing()));
    });

    it('returns a Just when applied to any other value', function() {
      assert(S.toMaybe(0).equals(S.Just(0)));
      assert(S.toMaybe(false).equals(S.Just(false)));
    });

  });

});

describe('either', function() {

  //  length :: String -> Number
  var length = function(s) { return s.length; };

  //  square :: Number -> Number
  var square = function(n) { return n * n; };

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

    it('can be applied to a Left', function() {
      eq(S.either(length, square, S.Left('abc')), 3);
    });

    it('can be applied to a Right', function() {
      eq(S.either(length, square, S.Right(42)), 1764);
    });

    it('throws if applied to a value of any other type', function() {
      assert.throws(
        function() { S.either(length, square, []); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Pattern match failure';
        }
      );
    });

    it('is curried', function() {
      eq(S.either(length)(square)(S.Left('abc')), 3);
      eq(S.either(length)(square, S.Left('abc')), 3);
      eq(S.either(length, square)(S.Left('abc')), 3);
    });

  });

});

describe('monad', function() {

  describe('bind', function() {

    //  toNumber :: String -> [Number]
    var toNumber = function(s) {
      var n = parseFloat(s);
      return n === n ? [n] : [];
    };

    it('can be applied to empty array', function() {
      var m = S.bind([], toNumber);
      eq(Object.prototype.toString.call(m), '[object Array]');
      eq(m.length, 0);
    });

    it('can be applied to singleton array', function() {
      var m = S.bind(['42'], toNumber);
      eq(Object.prototype.toString.call(m), '[object Array]');
      eq(m.length, 1);
      eq(m[0], 42);

      var m2 = S.bind(['xxx'], toNumber);
      eq(Object.prototype.toString.call(m2), '[object Array]');
      eq(m2.length, 0);
    });

    it('can be applied to a Nothing', function() {
      var m = S.bind(S.Nothing(), S.head);
      assert(m.equals(S.Nothing()));
    });

    it('can be applied to a Just', function() {
      var m = S.bind(S.Just([42, 21]), S.head);
      assert(m.equals(S.Just(42)));
    });

    it('throws if applied to a non-monad', function() {
      assert.throws(
        function() { S.bind(/xxx/, S.head); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Pattern match failure';
        }
      );
    });

    it('is curried', function() {
      var maybe = S.bind(S.Just([42, 21]))(S.head);
      assert(maybe.equals(S.Just(42)));
    });

  });

  describe('then', function() {

    it('can be applied to a Nothing', function() {
      var maybe = S.then(S.head, S.Nothing());
      assert(maybe.equals(S.Nothing()));
    });

    it('can be applied to a Just', function() {
      var maybe = S.then(S.head, S.Just([42, 21]));
      assert(maybe.equals(S.Just(42)));
    });

    it('throws if applied to a value of non-monad', function() {
      assert.throws(
        function() { S.then(S.head, /xxx/); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === 'Pattern match failure';
        }
      );
    });

    it('is curried', function() {
      var maybe = S.then(S.head)(S.Just([42, 21]));
      assert(maybe.equals(S.Just(42)));
    });

  });

});

describe('control', function() {

  describe('or', function() {

    var empty = [];
    var empty2 = [];
    var nonempty = [42];
    var nonempty2 = [42];

    var nothing = S.Nothing();
    var nothing2 = S.Nothing();
    var just = S.Just(42);
    var just2 = S.Just(42);

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

    it('throws if applied to non-functors', function() {
      assert.throws(
        function() { S.or(42, 42); },
        function(err) {
          return err instanceof TypeError &&
                 err.message === '"or" unspecified for Number';
        }
      );
    });

    it('is curried', function() {
      eq(S.or(empty)(nonempty), nonempty);
    });

  });

});

describe('list', function() {

  describe('at', function() {

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

    it('returns a Nothing if applied to empty list', function() {
      assert(S.head([]).equals(S.Nothing()));
    });

    it('returns Just the head of a nonempty list', function() {
      assert(S.head(['foo', 'bar', 'baz']).equals(S.Just('foo')));
    });

  });

  describe('last', function() {

    it('returns a Nothing if applied to empty list', function() {
      assert(S.last([]).equals(S.Nothing()));
    });

    it('returns Just the last element of a nonempty list', function() {
      assert(S.last(['foo', 'bar', 'baz']).equals(S.Just('baz')));
    });

  });

  describe('tail', function() {

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

    it('returns a Nothing if applied to empty list', function() {
      assert(S.init([]).equals(S.Nothing()));
    });

    it('returns Just the initial elements of a nonempty list', function() {
      var result = S.init(['foo', 'bar', 'baz']);
      eq(result.constructor, S.Just);
      eq(JSON.stringify(S.fromMaybe(null, result)), '["foo","bar"]');
    });

  });

});

describe('object', function() {

  describe('get', function() {

    it('returns a Maybe', function() {
      var obj = {x: 0, y: 42};
      assert(S.get('x', obj).equals(S.Just(0)));
      assert(S.get('y', obj).equals(S.Just(42)));
      assert(S.get('z', obj).equals(S.Nothing()));
    });

  });

});

describe('parse', function() {

  describe('parseFloat', function() {

    it('returns a Maybe', function() {
      assert(S.parseFloat('12.34').equals(S.Just(12.34)));
      assert(S.parseFloat('xxx').equals(S.Nothing()));
    });

  });

  describe('parseInt', function() {

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
