'use strict';

/* global describe, it */
/* jshint -W053 */

var assert = require('assert');
var vm = require('vm');

var jsc = require('jsverify');
var R = require('ramda');
var $ = require('sanctuary-def');

var S = require('..');


var eq = function(actual, expected) {
  assert.strictEqual(arguments.length, 2);
  assert.strictEqual(R.toString(actual), R.toString(expected));
};

//  errorEq :: TypeRep a -> String -> Error -> Boolean
var errorEq = R.curry(function(type, message, error) {
  return error.constructor === type && error.message === message;
});

//  area :: (Number, Number, Number) -> Number !
var area = function(a, b, c) {
  if (Math.max(a, b, c) < (a + b + c) / 2) {
    var s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  } else {
    throw new Error('Impossible triangle');
  }
};

//  factorial :: Number -> Number !
var factorial = function(n) {
  if (n < 0) {
    throw new Error('Cannot determine factorial of negative number');
  } else if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
};

//  parseHex :: String -> Either String Number
var parseHex = function(s) {
  var n = parseInt(s, 16);
  return n !== n ? S.Left('Invalid hexadecimal string') : S.Right(n);
};

//  positive :: Number -> Boolean
var positive = function(n) { return n > 0; };

//  rem :: (Number, Number) -> Number !
var rem = function(x, y) {
  if (y === 0) {
    throw new Error('Cannot divide by zero');
  } else {
    return x % y;
  }
};

//  square :: Number -> Number
var square = function(n) { return n * n; };

//  squareRoot :: Number -> Either String Number
var squareRoot = function(n) {
  return n < 0 ? S.Left('Cannot represent square root of negative number')
               : S.Right(Math.sqrt(n));
};

//  Identity :: a -> Identity a
var Identity = function(x) {
  return {
    map: function(fn) {
      return Identity(fn(x));
    },
    ap: function(y) {
      return Identity(x(y));
    },
    equals: function(other) {
      return R.equals(x, other.value);
    },
    value: x
  };
};
Identity.of = Identity;

//  Compose :: Apply f, Apply g
//          => { of: b -> f b } -> { of: c -> g c }
//          -> f (g a) -> Compose f g a
var Compose = function(F, G) {
  function _Compose(x) {
    return {
      map: function(f) {
        return _Compose(R.map(R.map(f), x));
      },
      ap: function(y) {
        return _Compose(R.ap(R.map(R.ap, x), y.value));
      },
      equals: function(other) {
        return R.equals(x, other.value);
      },
      value: x
    };
  }
  _Compose.of = function(x) {
    return _Compose(F.of(G.of(x)));
  };
  return _Compose;
};

//  eitherToMaybe :: Either a b -> Maybe b
var eitherToMaybe = S.either(S.K(S.Nothing()), S.Just);

//  JustArb :: Arbitrary a -> Arbitrary (Maybe a)
var JustArb = function(arb) {
  return arb.smap(S.Just, function(m) { return m.value; }, R.toString);
};

//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
var MaybeArb = function(arb) {
  return jsc.oneof(JustArb(arb), jsc.constant(S.Nothing()));
};

//  LeftArb :: Arbitrary a -> Arbitrary (Either a b)
var LeftArb = function(arb) {
  return arb.smap(S.Left, function(e) { return e.value; }, R.toString);
};

//  RightArb :: Arbitrary a -> Arbitrary (Either b a)
var RightArb = function(arb) {
  return arb.smap(S.Right, function(e) { return e.value; }, R.toString);
};

//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
var EitherArb = function(lArb, rArb) {
  return jsc.oneof(LeftArb(lArb), RightArb(rArb));
};

//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
var IdentityArb = function(arb) {
  return arb.smap(Identity, function(i) { return i.value; });
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

  it('exported functions throw if applied to too many arguments', function() {
    assert.throws(function() { S.I(1, 2); },
                  errorEq(TypeError,
                          '‘I’ requires one argument; ' +
                          'received two arguments'));

    assert.throws(function() { S.K(1, 2, 3); },
                  errorEq(TypeError,
                          '‘K’ requires two arguments; ' +
                          'received three arguments'));

    assert.throws(function() { S.K(1)(2, 3); },
                  errorEq(TypeError,
                          '‘K’ requires two arguments; ' +
                          'received three arguments'));

    assert.throws(function() { S.K(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); },
                  errorEq(TypeError,
                          '‘K’ requires two arguments; ' +
                          'received 10 arguments'));
  });

});

describe('classify', function() {

  describe('type', function() {

    it('is a unary function', function() {
      eq(typeof S.type, 'function');
      eq(S.type.length, 1);
    });

    it('operates on values of built-in types', function() {
      eq(S.type((function() { return arguments; }())),
                                      'Arguments');
      eq(S.type([]),                  'Array');
      eq(S.type(false),               'Boolean');
      eq(S.type(new Date(0)),         'Date');
      eq(S.type(new TypeError()),     'Error');
      eq(S.type(function() {}),       'Function');
      eq(S.type(null),                'Null');
      eq(S.type(0),                   'Number');
      eq(S.type(/(?:)/),              'RegExp');
      eq(S.type(''),                  'String');
      eq(S.type(undefined),           'Undefined');
      eq(S.type(new Boolean(false)),  'Boolean');
      eq(S.type(new Number(0)),       'Number');
      eq(S.type(new String('')),      'String');
    });

    it('operates on values of Sanctuary types', function() {
      eq(S.type(S.Left(42)),  'sanctuary/Either');
      eq(S.type(S.Right(42)), 'sanctuary/Either');
      eq(S.type(S.Nothing()), 'sanctuary/Maybe');
      eq(S.type(S.Just(42)),  'sanctuary/Maybe');
    });

    it('operates on values of user-defined types', function() {
      function Gizmo() {}
      Gizmo.prototype['@@type'] = 'gadgets/Gizmo';

      eq(S.type(new Gizmo()), 'gadgets/Gizmo');
      eq(S.type({'@@type': 'foobar/FooBar'}), 'foobar/FooBar');
    });

    it('does not rely on constructor identity', function() {
      eq(S.type(vm.runInNewContext('[1, 2, 3]')), 'Array');
    });

  });

  describe('is', function() {

    it('is a binary function', function() {
      eq(typeof S.is, 'function');
      eq(S.is.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.is([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘is’ expected a value of type TypeRep ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('works for built-in type', function() {
      eq(S.is(Array,    []),                  true);
      eq(S.is(Boolean,  false),               true);
      eq(S.is(Date,     new Date(0)),         true);
      eq(S.is(Function, function() {}),       true);
      eq(S.is(Number,   0),                   true);
      eq(S.is(Object,   {}),                  true);
      eq(S.is(RegExp,   /(?:)/),              true);
      eq(S.is(String,   ''),                  true);
      eq(S.is(Boolean,  new Boolean(false)),  true);
      eq(S.is(Number,   new Number(0)),       true);
      eq(S.is(String,   new String('')),      true);
      eq(S.is(Array,    null),                false);
      eq(S.is(Array,    undefined),           false);
      eq(S.is(Array,    {}),                  false);
    });

    it('works for user-defined type', function() {
      function FooBar() {}
      FooBar.prototype['@@type'] = 'foobar/FooBar';
      function Foo() {}
      Foo.prototype = new FooBar();
      function Bar() {}
      Bar.prototype = new FooBar();

      eq(S.is(FooBar, new Foo()), true);
      eq(S.is(FooBar, new Bar()), true);
    });

    it('does not rely on constructor identity', function() {
      eq(S.is(Array, vm.runInNewContext('[1, 2, 3]')), true);
      eq(S.is(vm.runInNewContext('Array'), [1, 2, 3]), true);
    });

    it('is curried', function() {
      eq(S.is(Array).length, 1);
      eq(S.is(Array)([]), true);
    });

  });

});

describe('combinator', function() {

  describe('I', function() {

    it('is a unary function', function() {
      eq(typeof S.I, 'function');
      eq(S.I.length, 1);
    });

    it('returns its argument', function() {
      eq(S.I([1, 2, 3]), [1, 2, 3]);
    });

  });

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
      eq(S.K(42).length, 1);
      eq(S.K(42)(null), 42);
    });

  });

  describe('A', function() {

    it('is a binary function', function() {
      eq(typeof S.A, 'function');
      eq(S.A.length, 2);
    });

    it('A(f, x) is equivalent to f(x)', function() {
      eq(S.A(R.inc, 1), 2);
      eq(R.map(S.A(R.__, 100), [R.inc, Math.sqrt]), [101, 10]);
    });

    it('is curried', function() {
      eq(S.A(R.inc).length, 1);
      eq(S.A(R.inc)(1), 2);
    });

  });

  describe('C', function() {

    it('is a ternary function', function() {
      eq(typeof S.C, 'function');
      eq(S.C.length, 3);
    });

    it('C(f, x, y) is equivalent to f(y)(x)', function() {
      eq(S.C(R.concat, 'foo', 'bar'), 'barfoo');
      eq(R.map(S.C(R.concat, '!'), ['BAM', 'POW', 'KA-POW']), ['BAM!', 'POW!', 'KA-POW!']);
    });

    it('is curried', function() {
      eq(S.C(R.concat).length, 2);
      eq(S.C(R.concat)('foo').length, 1);
      eq(S.C(R.concat)('foo')('bar'), 'barfoo');
    });

  });

});

describe('function', function() {

  describe('flip', function() {

    it('is a ternary function', function() {
      eq(typeof S.flip, 'function');
      eq(S.flip.length, 3);
    });

    it('throws if applied to values of different types', function() {
      assert.throws(function() { S.flip('wrong'); },
                    errorEq(TypeError,
                            '‘flip’ expected a value of type Function as its ' +
                            'first argument; received "wrong"'));
    });

    it("flips a function's argument order", function() {
      eq(R.map(S.flip(Math.pow)(2), [1, 2, 3, 4, 5]), [1, 4, 9, 16, 25]);
      eq(S.flip(S.indexOf, ['a', 'b', 'c', 'd'], 'c'), S.Just(2));
    });

    it('is curried', function() {
      eq(S.flip(S.indexOf).length, 2);
      eq(S.flip(S.indexOf)(['a', 'b', 'c', 'd']).length, 1);
      eq(S.flip(S.indexOf)(['a', 'b', 'c', 'd'])('c'), S.Just(2));
    });

  });

  describe('lift', function() {

    it('is a binary function', function() {
      eq(typeof S.lift, 'function');
      eq(S.lift.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.lift('wrong'); },
                    errorEq(TypeError,
                            '‘lift’ expected a value of type Function ' +
                            'as its first argument; received "wrong"'));
    });

    it('lifts a function into the context of Functors', function() {
      eq(S.lift(R.multiply(2), S.Just(3)), S.Just(6));
      eq(S.lift(R.multiply(2), S.Nothing()), S.Nothing());

      eq(S.lift(R.multiply(2), S.Left(3)), S.Left(3));
      eq(S.lift(R.multiply(2), S.Right(3)), S.Right(6));

      eq(S.lift(R.multiply(2), [1, 2, 3]), [2, 4, 6]);
      eq(S.lift(R.multiply(2), []), []);

      eq(S.lift(S.not, S.even)(42), false);
      eq(S.lift(S.not, S.even)(43), true);
    });

  });

  describe('lift2', function() {

    it('is a ternary function', function() {
      eq(typeof S.lift2, 'function');
      eq(S.lift2.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.lift2('wrong'); },
                    errorEq(TypeError,
                            '‘lift2’ expected a value of type Function ' +
                            'as its first argument; received "wrong"'));
    });

    it('lifts a function into the context of Applys', function() {
      eq(S.lift2(R.add, S.Just(3), S.Just(3)), S.Just(6));
      eq(S.lift2(R.add, S.Nothing(), S.Just(3)), S.Nothing());

      eq(S.lift2(R.add, S.Right(3), S.Left(4)), S.Left(4));
      eq(S.lift2(R.add, S.Right(3), S.Right(4)), S.Right(7));

      eq(S.lift2(R.add, [1, 2], [10, 20]), [11, 21, 12, 22]);
      eq(S.lift2(R.add, [], [1, 2]), []);

      eq(S.lift2(S.and, S.even, positive)(42), true);
      eq(S.lift2(S.and, S.even, positive)(43), false);
      eq(S.lift2(S.and, S.even, positive)(-42), false);
      eq(S.lift2(S.and, S.even, positive)(-43), false);
    });

  });

  describe('lift3', function() {

    it('is a quaternary function', function() {
      eq(typeof S.lift3, 'function');
      eq(S.lift3.length, 4);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.lift3('wrong'); },
                    errorEq(TypeError,
                            '‘lift3’ expected a value of type Function ' +
                            'as its first argument; received "wrong"'));
    });

    it('lifts a function into the context of Applys', function() {
      eq(S.lift3(S.reduce, S.Just(R.add), S.Just(0), S.Just([1, 2, 3])), S.Just(6));
      eq(S.lift3(S.reduce, S.Just(R.add), S.Just(0), S.Nothing()), S.Nothing());

      eq(S.lift3(S.reduce, S.Right(R.add), S.Right(0), S.Right([1, 2, 3])), S.Right(6));
      eq(S.lift3(S.reduce, S.Right(R.add), S.Right(0), S.Left('WHOOPS')), S.Left('WHOOPS'));

      eq(S.lift3(S.reduce, [R.add], [0], [[1, 2, 3]]), [6]);
      eq(S.lift3(S.reduce, [R.add], [0], []), []);

      eq(S.lift3(R.curry(area), R.dec, S.I, R.inc)(4), 6);
    });

  });

});

describe('composition', function() {

  describe('compose', function() {

    it('is a ternary function', function() {
      eq(typeof S.compose, 'function');
      eq(S.compose.length, 3);
    });

    it('composes two functions assumed to be unary', function() {
      eq(S.compose(R.map(Math.sqrt), JSON.parse, '[1, 4, 9]'), [1, 2, 3]);
    });

    it('is curried', function() {
      eq(S.compose(R.map(Math.sqrt)).length, 2);
      eq(S.compose(R.map(Math.sqrt))(JSON.parse).length, 1);
      eq(S.compose(R.map(Math.sqrt))(JSON.parse)('[1, 4, 9]'), [1, 2, 3]);
    });

  });

  describe('pipe', function() {

    it('is a binary function', function() {
      eq(typeof S.pipe, 'function');
      eq(S.pipe.length, 2);
    });

    it('composes a list of functions assumed to be unary', function() {
      eq(S.pipe([], '99'), '99');
      eq(S.pipe([parseInt], '99'), 99);
      eq(S.pipe([parseInt, R.inc], '99'), 100);
      eq(S.pipe([parseInt, R.inc, Math.sqrt], '99'), 10);
      eq(S.pipe([parseInt, R.inc, Math.sqrt, R.dec], '99'), 9);
    });

    it('is curried', function() {
      eq(S.pipe([parseInt, R.inc, Math.sqrt, R.dec]).length, 1);
      eq(S.pipe([parseInt, R.inc, Math.sqrt, R.dec])('99'), 9);
    });

  });

  describe('meld', function() {

    it('is a unary function', function() {
      eq(typeof S.meld, 'function');
      eq(S.meld.length, 1);
    });

    it('composes a list of unary functions', function() {
      eq(S.meld([]).length, 1);
      eq(S.meld([])(99), 99);
      eq(S.meld([R.inc]).length, 1);
      eq(S.meld([R.inc])(99), 100);
      eq(S.meld([R.inc, Math.sqrt]).length, 1);
      eq(S.meld([R.inc, Math.sqrt])(99), 10);
      eq(S.meld([R.inc, Math.sqrt, R.dec]).length, 1);
      eq(S.meld([R.inc, Math.sqrt, R.dec])(99), 9);
    });

    it('melds a list of non-nullary functions of various arities', function() {
      var f = function(x) { return -x; };
      var g = function(x, y) { return Math.pow(x, y); };
      var h = function(x, y, z) { return x + y + z; };

      eq(S.meld([f, f, f]).length, 1);
      eq(S.meld([f, f, g]).length, 2);
      eq(S.meld([f, g, f]).length, 2);
      eq(S.meld([g, f, f]).length, 2);
      eq(S.meld([f, g, g]).length, 3);
      eq(S.meld([g, f, g]).length, 3);
      eq(S.meld([g, g, f]).length, 3);
      eq(S.meld([g, g, g]).length, 4);

      eq(S.meld([f, g, h]).length, 4);
      eq(S.meld([f, h, g]).length, 4);
      eq(S.meld([g, f, h]).length, 4);
      eq(S.meld([g, h, f]).length, 4);
      eq(S.meld([h, f, g]).length, 4);
      eq(S.meld([h, g, f]).length, 4);

      eq(S.meld([f, g, h])(3, 4, 5, 6), h(g(f(3), 4), 5, 6));
      eq(S.meld([f, h, g])(3, 4, 5, 6), g(h(f(3), 4, 5), 6));
      eq(S.meld([g, f, h])(3, 4, 5, 6), h(f(g(3, 4)), 5, 6));
      eq(S.meld([g, h, f])(3, 4, 5, 6), f(h(g(3, 4), 5, 6)));
      eq(S.meld([h, f, g])(3, 4, 5, 6), g(f(h(3, 4, 5)), 6));
      eq(S.meld([h, g, f])(3, 4, 5, 6), f(g(h(3, 4, 5), 6)));

      eq(S.meld([f, g, h])(3)(4)(5)(6), h(g(f(3), 4), 5, 6));
      eq(S.meld([f, h, g])(3)(4)(5)(6), g(h(f(3), 4, 5), 6));
      eq(S.meld([g, f, h])(3)(4)(5)(6), h(f(g(3, 4)), 5, 6));
      eq(S.meld([g, h, f])(3)(4)(5)(6), f(h(g(3, 4), 5, 6)));
      eq(S.meld([h, f, g])(3)(4)(5)(6), g(f(h(3, 4, 5)), 6));
      eq(S.meld([h, g, f])(3)(4)(5)(6), f(g(h(3, 4, 5), 6)));
    });

  });

});

describe('maybe', function() {

  describe('MaybeType', function() {

    it('has its type definition exported', function() {
      eq(S.MaybeType($.Number).test(S.Nothing()), true);
      eq(S.MaybeType($.Number).test(S.Just(1)), true);
      eq(S.MaybeType($.Number).test('abc'), false);
    });

  });

  describe('Maybe', function() {

    it('throws if called', function() {
      assert.throws(function() { S.Maybe(); },
                    errorEq(Error, 'Cannot instantiate Maybe'));
    });

    describe('Traversable laws', function() {

      it('satisfies naturality', function() {
        jsc.assert(jsc.forall(MaybeArb(EitherArb(jsc.integer, jsc.string)), function(maybe) {
          var lhs = eitherToMaybe(maybe.sequence(S.Either.of));
          var rhs = maybe.map(eitherToMaybe).sequence(S.Maybe.of);
          return lhs.equals(rhs);
        }));
      });

      it('satisfies identity', function() {
        jsc.assert(jsc.forall(MaybeArb(jsc.integer), function(maybe) {
          var lhs = maybe.map(Identity).sequence(Identity.of);
          var rhs = Identity.of(maybe);
          return lhs.equals(rhs);
        }));
      });

      it('satisfies composition', function() {
        jsc.assert(jsc.forall(MaybeArb(IdentityArb(MaybeArb(jsc.integer))), function(u) {
          var C = Compose(Identity, S.Maybe);
          var lhs = u.map(C).sequence(C.of);
          var rhs = C(u.sequence(Identity.of).map(function(x) {
            return x.sequence(S.Maybe.of);
          }));
          return lhs.equals(rhs);
        }));
      });

    });

  });

  describe('Nothing', function() {

    it('is a data constructor', function() {
      eq(typeof S.Nothing, 'function');
      eq(S.Nothing.length, 0);
      eq(S.Nothing()['@@type'], 'sanctuary/Maybe');
      eq(S.Nothing().isNothing, true);
      eq(S.Nothing().isJust, false);
    });

    it('provides an "ap" method', function() {
      eq(S.Nothing().ap.length, 1);
      eq(S.Nothing().ap(S.Nothing()), S.Nothing());
      eq(S.Nothing().ap(S.Just(42)), S.Nothing());

      assert.throws(function() { S.Nothing().ap([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Maybe#ap’ expected a value of type ' +
                            '(Maybe a) as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Nothing().chain.length, 1);
      eq(S.Nothing().chain(S.head), S.Nothing());

      assert.throws(function() { S.Nothing().chain(null); },
                    errorEq(TypeError,
                            '‘Maybe#chain’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "concat" method', function() {
      eq(S.Nothing().concat.length, 1);
      eq(S.Nothing().concat(S.Nothing()), S.Nothing());
      eq(S.Nothing().concat(S.Just('foo')), S.Just('foo'));

      assert.throws(function() { S.Nothing().concat(null); },
                    errorEq(TypeError,
                            '‘Maybe#concat’ expected a value of type ' +
                            '(Maybe a) as its first argument; received null'));

      assert.throws(function() { S.Nothing().concat(S.Just(1)); },
                    errorEq(TypeError,
                            '‘Maybe#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber ' +
                            'and NonZeroFiniteNumber and Integer ' +
                            'and ValidNumber do not'));
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

      assert.throws(function() { S.Nothing().extend(null); },
                    errorEq(TypeError,
                            '‘Maybe#extend’ expected a value of type ' +
                            'Function as its first argument; received null'));
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

      assert.throws(function() { S.Nothing().filter(null); },
                    errorEq(TypeError,
                            '‘Maybe#filter’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "map" method', function() {
      eq(S.Nothing().map.length, 1);
      eq(S.Nothing().map(function() { return 42; }), S.Nothing());

      assert.throws(function() { S.Nothing().map(null); },
                    errorEq(TypeError,
                            '‘Maybe#map’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "reduce" method', function() {
      eq(S.Nothing().reduce.length, 2);
      eq(S.Nothing().reduce(function(a, b) { return a + b; }, 10), 10);

      assert.throws(function() { S.Nothing().reduce(null); },
                    errorEq(TypeError,
                            '‘Maybe#reduce’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "sequence" method', function() {
      eq(S.Nothing().sequence.length, 1);
      eq(S.Nothing().sequence(S.Either.of), S.Right(S.Nothing()));
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

    it('is a data constructor', function() {
      eq(typeof S.Just, 'function');
      eq(S.Just.length, 1);
      eq(S.Just(42)['@@type'], 'sanctuary/Maybe');
      eq(S.Just(42).isNothing, false);
      eq(S.Just(42).isJust, true);
    });

    it('provides an "ap" method', function() {
      eq(S.Just(R.inc).ap.length, 1);
      eq(S.Just(R.inc).ap(S.Nothing()), S.Nothing());
      eq(S.Just(R.inc).ap(S.Just(42)), S.Just(43));

      assert.throws(function() { S.Just(R.inc).ap([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Maybe#ap’ expected a value of type (Maybe a) ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Just([1, 2, 3]).chain.length, 1);
      eq(S.Just([1, 2, 3]).chain(S.head), S.Just(1));

      assert.throws(function() { S.Just([1, 2, 3]).chain([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Maybe#chain’ expected a value of type ' +
                            'Function as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('provides a "concat" method', function() {
      eq(S.Just('foo').concat.length, 1);
      eq(S.Just('foo').concat(S.Nothing()), S.Just('foo'));
      eq(S.Just('foo').concat(S.Just('bar')), S.Just('foobar'));

      assert.throws(function() { S.Just('foo').concat([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Maybe#concat’ expected a value of type ' +
                            '(Maybe a) as its first argument; ' +
                            'received [1, 2, 3]'));

      assert.throws(function() { S.Just(1).concat(S.Just(0)); },
                    errorEq(TypeError,
                            '‘Maybe#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and Integer ' +
                            'and ValidNumber do not'));

      assert.throws(function() { S.Just(2).concat(S.Just([1, 2, 3])); },
                    errorEq(TypeError,
                            '‘Maybe#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Just([1, 2, 3]).concat(S.Just(3)); },
                    errorEq(TypeError,
                            '‘Maybe#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));
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

      assert.throws(function() { S.Just(42).extend(null); },
                    errorEq(TypeError,
                            '‘Maybe#extend’ expected a value of type ' +
                            'Function as its first argument; received null'));
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

      assert.throws(function() { S.Just(42).filter(null); },
                    errorEq(TypeError,
                            '‘Maybe#filter’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "map" method', function() {
      eq(S.Just(42).map.length, 1);
      eq(S.Just(42).map(function(x) { return x / 2; }), S.Just(21));

      assert.throws(function() { S.Just(42).map([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Maybe#map’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('provides a "reduce" method', function() {
      eq(S.Just(5).reduce.length, 2);
      eq(S.Just(5).reduce(function(a, b) { return a + b; }, 10), 15);

      assert.throws(function() { S.Just().reduce(null); },
                    errorEq(TypeError,
                            '‘Maybe#reduce’ expected a value of type ' +
                            'Function as its first argument; received null'));
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

  describe('isNothing', function() {

    it('is a unary function', function() {
      eq(typeof S.isNothing, 'function');
      eq(S.isNothing.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.isNothing([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘isNothing’ expected a value of type (Maybe a) ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns true when applied to a Nothing', function() {
      eq(S.isNothing(S.Nothing()), true);
    });

    it('returns false when applied to a Just', function() {
      eq(S.isNothing(S.Just(42)), false);
    });

  });

  describe('isJust', function() {

    it('is a unary function', function() {
      eq(typeof S.isJust, 'function');
      eq(S.isJust.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.isJust([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘isJust’ expected a value of type (Maybe a) ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns true when applied to a Just', function() {
      eq(S.isJust(S.Just(42)), true);
    });

    it('returns false when applied to a Nothing', function() {
      eq(S.isJust(S.Nothing()), false);
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
                            '‘fromMaybe’ expected a value of type ' +
                            '(Maybe Number) or (Maybe FiniteNumber) or ' +
                            '(Maybe Integer) or (Maybe ValidNumber) ' +
                            'as its second argument; received [1, 2, 3]'));
    });

    it('can be applied to a Nothing', function() {
      eq(S.fromMaybe(0, S.Nothing()), 0);
    });

    it('can be applied to a Just', function() {
      eq(S.fromMaybe(0, S.Just(42)), 42);
    });

    it('is curried', function() {
      eq(S.fromMaybe(0).length, 1);
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

  describe('maybe', function() {

    it('is a ternary function', function() {
      eq(typeof S.maybe, 'function');
      eq(S.maybe.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.maybe(0, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘maybe’ expected a value of type Function ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.maybe(0, R.length, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘maybe’ expected a value of type (Maybe a) ' +
                            'as its third argument; received [1, 2, 3]'));
    });

    it('can be applied to a Nothing', function() {
      eq(S.maybe(0, R.length, S.Nothing()), 0);
    });

    it('can be applied to a Just', function() {
      eq(S.maybe(0, R.length, S.Just([1, 2, 3])), 3);
    });

    it('is curried', function() {
      eq(S.maybe(NaN).length, 2);
      eq(S.maybe(NaN)(square).length, 1);
      eq(S.maybe(NaN)(square)(S.Just(5)), 25);
    });

  });

  describe('catMaybes', function() {

    it('is a unary function', function() {
      eq(typeof S.catMaybes, 'function');
      eq(S.catMaybes.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.catMaybes({length: 0}); },
                    errorEq(TypeError,
                            '‘catMaybes’ expected a value of type ' +
                            '(Array (Maybe a)) as its first argument; ' +
                            'received {"length": 0}'));
    });

    it('returns a list containing the value of each Just', function() {
      eq(S.catMaybes([]), []);
      eq(S.catMaybes([S.Nothing(), S.Nothing()]), []);
      eq(S.catMaybes([S.Nothing(), S.Just('b')]), ['b']);
      eq(S.catMaybes([S.Just('a'), S.Nothing()]), ['a']);
      eq(S.catMaybes([S.Just('a'), S.Just('b')]), ['a', 'b']);
    });

  });

  describe('mapMaybe', function() {

    it('is a binary function', function() {
      eq(typeof S.mapMaybe, 'function');
      eq(S.mapMaybe.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.mapMaybe([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘mapMaybe’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.mapMaybe(S.head, null); },
                    errorEq(TypeError,
                            '‘mapMaybe’ expected a value of type (Array a) ' +
                            'as its second argument; received null'));
    });

    it('maps over a list to produce a list of successful results', function() {
      eq(S.mapMaybe(S.head, []), []);
      eq(S.mapMaybe(S.head, [[], [], []]), []);
      eq(S.mapMaybe(S.head, [[1, 2], [3, 4], [5, 6]]), [1, 3, 5]);
      eq(S.mapMaybe(S.head, [[1], [], [3], [], [5], []]), [1, 3, 5]);
    });

    it('is curried', function() {
      eq(S.mapMaybe(S.head).length, 1);
      eq(S.mapMaybe(S.head)(['foo', '', 'bar', '', 'baz']), ['f', 'b', 'b']);
    });

  });

  describe('encase', function() {

    it('is a binary function', function() {
      eq(typeof S.encase, 'function');
      eq(S.encase.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.encase([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘encase’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Just on success', function() {
      eq(S.encase(factorial, 5), S.Just(120));
    });

    it('returns a Nothing on failure', function() {
      eq(S.encase(factorial, -1), S.Nothing());
    });

    it('can be applied to a function of arbitrary arity', function() {
      eq(S.encase(function(a, b, c, d) { return a; }, 42), S.Just(42));
    });

    it('is curried', function() {
      eq(S.encase(factorial).length, 1);
      eq(S.encase(factorial)(5), S.Just(120));
    });

  });

  describe('encase2', function() {

    it('is a ternary function', function() {
      eq(typeof S.encase2, 'function');
      eq(S.encase2.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.encase2([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘encase2’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Just on success', function() {
      eq(S.encase2(rem, 42, 5), S.Just(2));
    });

    it('returns a Nothing on failure', function() {
      eq(S.encase2(rem, 42, 0), S.Nothing());
    });

    it('can be applied to a function of arbitrary arity', function() {
      eq(S.encase2(function(a, b, c, d) { return b; }, 0, 42), S.Just(42));
    });

    it('is curried', function() {
      eq(S.encase2(rem).length, 2);
      eq(S.encase2(rem)(42).length, 1);
      eq(S.encase2(rem)(42)(5), S.Just(2));
    });

  });

  describe('encase3', function() {

    it('is a quaternary function', function() {
      eq(typeof S.encase3, 'function');
      eq(S.encase3.length, 4);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.encase3([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘encase3’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Just on success', function() {
      eq(S.encase3(area, 3, 4, 5), S.Just(6));
    });

    it('returns a Nothing on failure', function() {
      eq(S.encase3(area, 2, 2, 5), S.Nothing());
    });

    it('can be applied to a function of arbitrary arity', function() {
      eq(S.encase3(function(a, b, c, d) { return c; }, 0, 0, 42), S.Just(42));
    });

    it('is curried', function() {
      eq(S.encase3(area).length, 3);
      eq(S.encase3(area)(3).length, 2);
      eq(S.encase3(area)(3)(4).length, 1);
      eq(S.encase3(area)(3)(4)(5), S.Just(6));
    });

  });

});

describe('either', function() {

  describe('EitherType', function() {

    it('has its type definition exported', function() {
      eq(S.EitherType($.String, $.Number).test(S.Left('Error')), true);
      eq(S.EitherType($.String, $.Number).test(S.Right(1)), true);
      eq(S.EitherType($.String, $.Number).test(1), false);
    });

  });

  describe('Either', function() {

    it('throws if called', function() {
      assert.throws(function() { S.Either(); },
                    errorEq(Error, 'Cannot instantiate Either'));
    });

  });

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

      assert.throws(function() { S.Left('abc').ap([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#ap’ expected a value of type ' +
                            '(Either a b) as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Left('abc').chain.length, 1);
      eq(S.Left('abc').chain(squareRoot), S.Left('abc'));

      assert.throws(function() { S.Left('abc').chain([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#chain’ expected a value of type ' +
                            'Function as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('provides a "concat" method', function() {
      eq(S.Left('abc').concat.length, 1);
      eq(S.Left('abc').concat(S.Left('def')), S.Left('abcdef'));
      eq(S.Left('abc').concat(S.Right('xyz')), S.Right('xyz'));

      assert.throws(function() { S.Left('abc').concat([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#concat’ expected a value of type ' +
                            '(Either a b) as its first argument; ' +
                            'received [1, 2, 3]'));

      assert.throws(function() { S.Left(1).concat(S.Left(0)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'Integer and ValidNumber do not'));

      assert.throws(function() { S.Left(2).concat(S.Right(0)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘b’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'Integer and ValidNumber do not'));

      assert.throws(function() { S.Left(3).concat(S.Left([1, 2, 3])); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Left(4).concat(S.Right([1, 2, 3])); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Left([1, 2, 3]).concat(S.Left(5)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Left([1, 2, 3]).concat(S.Right(6)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘b’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));
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
      eq(w.extend(g).extend(f),
         w.extend(function(_w) { return f(_w.extend(g)); }));

      assert.throws(function() { S.Left('abc').extend(null); },
                    errorEq(TypeError,
                            '‘Either#extend’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "map" method', function() {
      eq(S.Left('abc').map.length, 1);
      eq(S.Left('abc').map(square), S.Left('abc'));

      assert.throws(function() { S.Left('abc').map([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#map’ expected a value of type Function ' +
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

    it('is a data constructor', function() {
      eq(typeof S.Right, 'function');
      eq(S.Right.length, 1);
      eq(S.Right(42)['@@type'], 'sanctuary/Either');
      eq(S.Right(42).isLeft, false);
      eq(S.Right(42).isRight, true);
    });

    it('provides an "ap" method', function() {
      eq(S.Right(R.inc).ap.length, 1);
      eq(S.Right(R.inc).ap(S.Left('abc')), S.Left('abc'));
      eq(S.Right(R.inc).ap(S.Right(42)), S.Right(43));

      assert.throws(function() { S.Right(R.inc).ap([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#ap’ expected a value of type ' +
                            '(Either a b) as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('provides a "chain" method', function() {
      eq(S.Right(25).chain.length, 1);
      eq(S.Right(25).chain(squareRoot), S.Right(5));

      assert.throws(function() { S.Right(25).chain(null); },
                    errorEq(TypeError,
                            '‘Either#chain’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "concat" method', function() {
      eq(S.Right('abc').concat.length, 1);
      eq(S.Right('abc').concat(S.Left('xyz')), S.Right('abc'));
      eq(S.Right('abc').concat(S.Right('def')), S.Right('abcdef'));

      assert.throws(function() { S.Right('abc').concat([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#concat’ expected a value of type ' +
                            '(Either a b) as its first argument; ' +
                            'received [1, 2, 3]'));

      assert.throws(function() { S.Right(1).concat(S.Left(0)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'Integer and ValidNumber do not'));

      assert.throws(function() { S.Right(2).concat(S.Right(0)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘b’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'Integer and ValidNumber do not'));

      assert.throws(function() { S.Right(3).concat(S.Left([1, 2, 3])); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘b’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Right(4).concat(S.Right([1, 2, 3])); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘b’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Right([1, 2, 3]).concat(S.Left(5)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘a’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));

      assert.throws(function() { S.Right([1, 2, 3]).concat(S.Right(6)); },
                    errorEq(TypeError,
                            '‘Either#concat’ requires ‘b’ to implement ' +
                            'Semigroup; Number and FiniteNumber and ' +
                            'NonZeroFiniteNumber and Integer and ' +
                            'ValidNumber do not'));
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
      eq(S.Right(new Number(42)).equals(S.Right(new Number(42))), true);
      eq(S.Right(new Number(42)).equals(42), false);
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

      assert.throws(function() { S.Right('abc').extend(null); },
                    errorEq(TypeError,
                            '‘Either#extend’ expected a value of type ' +
                            'Function as its first argument; received null'));
    });

    it('provides a "map" method', function() {
      eq(S.Right(42).map.length, 1);
      eq(S.Right(42).map(square), S.Right(1764));

      assert.throws(function() { S.Right(42).map([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘Either#map’ expected a value of type Function ' +
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

  describe('isLeft', function() {

    it('is a unary function', function() {
      eq(typeof S.isLeft, 'function');
      eq(S.isLeft.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.isLeft([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘isLeft’ expected a value of type (Either a b) ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns true when applied to a Left', function() {
      eq(S.isLeft(S.Left(42)), true);
    });

    it('returns false when applied to a Right', function() {
      eq(S.isLeft(S.Right(42)), false);
    });

  });

  describe('isRight', function() {

    it('is a unary function', function() {
      eq(typeof S.isRight, 'function');
      eq(S.isRight.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.isRight([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘isRight’ expected a value of type ' +
                            '(Either a b) as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('returns true when applied to a Right', function() {
      eq(S.isRight(S.Right(42)), true);
    });

    it('returns false when applied to a Left', function() {
      eq(S.isRight(S.Left(42)), false);
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
                            '‘either’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.__, square)([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘either’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘either’ expected a value of type Function ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length)([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘either’ expected a value of type Function ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length, square, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘either’ expected a value of type (Either a b) ' +
                            'as its third argument; received [1, 2, 3]'));

      assert.throws(function() { S.either(R.length)(square)([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘either’ expected a value of type (Either a b) ' +
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

      eq(S.either(f).length, 2);
      eq(S.either(f)(g).length, 1);

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

  describe('lefts', function() {

    it('is a unary function', function() {
      eq(typeof S.lefts, 'function');
      eq(S.lefts.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.lefts([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘lefts’ expected a value of type ' +
                            '(Array (Either a b)) as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('returns a list containing the value of each Left', function() {
      eq(S.lefts([]), []);
      eq(S.lefts([S.Right(2), S.Right(1)]), []);
      eq(S.lefts([S.Right(2), S.Left('b')]), ['b']);
      eq(S.lefts([S.Left('a'), S.Right(1)]), ['a']);
      eq(S.lefts([S.Left('a'), S.Left('b')]), ['a', 'b']);
    });

  });

  describe('rights', function() {

    it('is a unary function', function() {
      eq(typeof S.rights, 'function');
      eq(S.rights.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.rights([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘rights’ expected a value of type ' +
                            '(Array (Either a b)) as its first argument; ' +
                            'received [1, 2, 3]'));
    });

    it('returns a list containing the value of each Right', function() {
      eq(S.rights([]), []);
      eq(S.rights([S.Left('a'), S.Left('b')]), []);
      eq(S.rights([S.Left('a'), S.Right(1)]), [1]);
      eq(S.rights([S.Right(2), S.Left('b')]), [2]);
      eq(S.rights([S.Right(2), S.Right(1)]), [2, 1]);
    });

  });

  describe('encaseEither', function() {

    it('is a ternary function', function() {
      eq(typeof S.encaseEither, 'function');
      eq(S.encaseEither.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.encaseEither(null); },
                    errorEq(TypeError,
                            '‘encaseEither’ expected a value of type ' +
                            'Function as its first argument; received null'));

      assert.throws(function() { S.encaseEither(S.I, null); },
                    errorEq(TypeError,
                            '‘encaseEither’ expected a value of type ' +
                            'Function as its second argument; received null'));
    });

    it('returns a Right on success', function() {
      eq(S.encaseEither(S.I, factorial, 5), S.Right(120));
    });

    it('returns a Left on failure', function() {
      eq(S.encaseEither(S.I, factorial, -1),
         S.Left(new Error('Cannot determine factorial of negative number')));
    });

    it('applies the first argument to the Error', function() {
      eq(S.encaseEither(R.prop('message'), factorial, -1),
         S.Left('Cannot determine factorial of negative number'));
    });

    it('can be applied to a function of arbitrary arity', function() {
      eq(S.encaseEither(S.I, function(a, b, c, d) { return a; }, 42),
         S.Right(42));
    });

    it('is curried', function() {
      eq(S.encaseEither(S.I).length, 2);
      eq(S.encaseEither(S.I)(factorial).length, 1);
      eq(S.encaseEither(S.I)(factorial)(5), S.Right(120));
    });

  });

  describe('encaseEither2', function() {

    it('is a quaternary function', function() {
      eq(typeof S.encaseEither2, 'function');
      eq(S.encaseEither2.length, 4);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.encaseEither2(null); },
                    errorEq(TypeError,
                            '‘encaseEither2’ expected a value of type ' +
                            'Function as its first argument; received null'));

      assert.throws(function() { S.encaseEither2(S.I, null); },
                    errorEq(TypeError,
                            '‘encaseEither2’ expected a value of type ' +
                            'Function as its second argument; received null'));
    });

    it('returns a Right on success', function() {
      eq(S.encaseEither2(S.I, rem, 42, 5), S.Right(2));
    });

    it('returns a Left on failure', function() {
      eq(S.encaseEither2(S.I, rem, 42, 0),
         S.Left(new Error('Cannot divide by zero')));
    });

    it('applies the first argument to the Error', function() {
      eq(S.encaseEither2(R.prop('message'), rem, 42, 0),
         S.Left('Cannot divide by zero'));
    });

    it('can be applied to a function of arbitrary arity', function() {
      eq(S.encaseEither2(S.I, function(a, b, c, d) { return b; }, 0, 42),
         S.Right(42));
    });

    it('is curried', function() {
      eq(S.encaseEither2(S.I).length, 3);
      eq(S.encaseEither2(S.I)(rem).length, 2);
      eq(S.encaseEither2(S.I)(rem)(42).length, 1);
      eq(S.encaseEither2(S.I)(rem)(42)(5), S.Right(2));
    });

  });

  describe('encaseEither3', function() {

    it('is a quinary function', function() {
      eq(typeof S.encaseEither3, 'function');
      eq(S.encaseEither3.length, 5);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.encaseEither3(null); },
                    errorEq(TypeError,
                            '‘encaseEither3’ expected a value of type ' +
                            'Function as its first argument; received null'));

      assert.throws(function() { S.encaseEither3(S.I, null); },
                    errorEq(TypeError,
                            '‘encaseEither3’ expected a value of type ' +
                            'Function as its second argument; received null'));
    });

    it('returns a Right on success', function() {
      eq(S.encaseEither3(S.I, area, 3, 4, 5), S.Right(6));
    });

    it('returns a Left on failure', function() {
      eq(S.encaseEither3(S.I, area, 2, 2, 5),
         S.Left(new Error('Impossible triangle')));
    });

    it('applies the first argument to the Error', function() {
      eq(S.encaseEither3(R.prop('message'), area, 2, 2, 5),
         S.Left('Impossible triangle'));
    });

    it('can be applied to a function of arbitrary arity', function() {
      eq(S.encaseEither3(S.I, function(a, b, c, d) { return c; }, 0, 0, 42),
         S.Right(42));
    });

    it('is curried', function() {
      eq(S.encaseEither3(S.I).length, 4);
      eq(S.encaseEither3(S.I)(area).length, 3);
      eq(S.encaseEither3(S.I)(area)(3).length, 2);
      eq(S.encaseEither3(S.I)(area)(3)(4).length, 1);
      eq(S.encaseEither3(S.I)(area)(3)(4)(5), S.Right(6));
    });

  });

  describe('maybeToEither', function() {

    it('is a binary function', function() {
      eq(typeof S.maybeToEither, 'function');
      eq(S.maybeToEither.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.maybeToEither('left', 1); },
                    errorEq(TypeError,
                            '‘maybeToEither’ expected a value of type ' +
                            '(Maybe b) as its second argument; received 1'));
    });

    it('returns a Left of its first argument when the second is Nothing', function() {
      eq(S.maybeToEither('error msg', S.Nothing()), S.Left('error msg'));
    });

    it('returns a Right of the value contained in the Just ' +
       'when the second argument is a Just', function() {
      eq(S.maybeToEither('error msg', S.Just(42)), S.Right(42));
    });

    it('is curried', function() {
      eq(S.maybeToEither(0).length, 1);
      eq(S.maybeToEither(0)(S.Just(42)), S.Right(42));
    });

  });

});

describe('alternative', function() {

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
      assert.throws(function() { S.and([], false); },
                    errorEq(TypeError,
                            '‘and’ expected a value of type (Array ???) or ' +
                            '(List ???) as its second argument; ' +
                            'received false'));

      assert.throws(function() { S.and(R.__, false)([]); },
                    errorEq(TypeError,
                            '‘and’ expected a value of type Boolean ' +
                            'as its first argument; received []'));
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.and(0, 1); },
                    errorEq(TypeError,
                            '‘and’ requires ‘a’ to implement Alternative; ' +
                            'Number and FiniteNumber and Integer and ' +
                            'ValidNumber do not'));
    });

    it('is curried', function() {
      eq(S.and([]).length, 1);
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
      assert.throws(function() { S.or([], false); },
                    errorEq(TypeError,
                            '‘or’ expected a value of type (Array ???) or ' +
                            '(List ???) as its second argument; ' +
                            'received false'));

      assert.throws(function() { S.or(R.__, false)([]); },
                    errorEq(TypeError,
                            '‘or’ expected a value of type Boolean ' +
                            'as its first argument; received []'));
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.or(0, 1); },
                    errorEq(TypeError,
                            '‘or’ requires ‘a’ to implement Alternative; ' +
                            'Number and FiniteNumber and Integer and ' +
                            'ValidNumber do not'));
    });

    it('is curried', function() {
      eq(S.or([]).length, 1);
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
                            '‘xor’ requires ‘a’ to implement Alternative ' +
                            'and Monoid; (Either String ???) and ' +
                            '(Either (List ???) ???) do not'));

      assert.throws(function() { S.xor(S.Left('foo'), S.Right(42)); },
                    errorEq(TypeError,
                            '‘xor’ requires ‘a’ to implement Alternative ' +
                            'and Monoid; (Either String ???) and ' +
                            '(Either (List ???) ???) do not'));

      assert.throws(function() { S.xor(S.Right(42), S.Left('foo')); },
                    errorEq(TypeError,
                            '‘xor’ requires ‘a’ to implement Alternative ' +
                            'and Monoid; (Either ??? Number) and ' +
                            '(Either ??? FiniteNumber) and ' +
                            '(Either ??? NonZeroFiniteNumber) and ' +
                            '(Either ??? Integer) and ' +
                            '(Either ??? ValidNumber) do not'));

      assert.throws(function() { S.xor(S.Right(42), S.Right(43)); },
                    errorEq(TypeError,
                            '‘xor’ requires ‘a’ to implement Alternative ' +
                            'and Monoid; (Either ??? Number) and ' +
                            '(Either ??? FiniteNumber) and ' +
                            '(Either ??? NonZeroFiniteNumber) and ' +
                            '(Either ??? Integer) and ' +
                            '(Either ??? ValidNumber) do not'));
    });

    it('throws if applied to values of different types', function() {
      assert.throws(function() { S.xor([], false); },
                    errorEq(TypeError,
                            '‘xor’ expected a value of type (Array ???) or ' +
                            '(List ???) as its second argument; ' +
                            'received false'));

      assert.throws(function() { S.xor(R.__, false)([]); },
                    errorEq(TypeError,
                            '‘xor’ expected a value of type Boolean ' +
                            'as its first argument; received []'));
    });

    it('throws if applied to values without a "toBoolean" method', function() {
      assert.throws(function() { S.xor(0, 1); },
                    errorEq(TypeError,
                            '‘xor’ requires ‘a’ to implement Alternative ' +
                            'and Monoid; Number and FiniteNumber and Integer ' +
                            'and ValidNumber do not'));
    });

    it('is curried', function() {
      eq(S.xor([]).length, 1);
      eq(S.xor([])([42]), [42]);
    });

  });

});

describe('logic', function() {

  describe('not', function() {

    it('is a unary function', function() {
      eq(typeof S.not, 'function');
      eq(S.not.length, 1);
    });

    it('can be applied to Booleans', function() {
      eq(S.not(false), true);
      eq(S.not(true), false);
      eq(S.not(new Boolean(false)), true);
      eq(S.not(new Boolean(true)), false);
    });

    it('throws when applied to a non-Boolean value', function() {
      assert.throws(function() { S.not(0); },
                    errorEq(TypeError,
                            '‘not’ expected a value of type Boolean ' +
                            'as its first argument; received 0'));
    });

  });

  describe('ifElse', function() {

    var lt0 = function(x) { return x < 0; };

    it('is a quaternary function', function() {
      eq(typeof S.ifElse, 'function');
      eq(S.ifElse.length, 4);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.ifElse('wrong'); },
                    errorEq(TypeError,
                            '‘ifElse’ expected a value of type Function ' +
                            'as its first argument; received "wrong"'));

      assert.throws(function() { S.ifElse(lt0, 'wrong'); },
                    errorEq(TypeError,
                            '‘ifElse’ expected a value of type Function ' +
                            'as its second argument; received "wrong"'));

      assert.throws(function() { S.ifElse(lt0, Math.abs, 'wrong'); },
                    errorEq(TypeError,
                            '‘ifElse’ expected a value of type Function ' +
                            'as its third argument; received "wrong"'));
    });

    it('applies the first function when the predicate returns true', function() {
      eq(S.ifElse(lt0, Math.abs, Math.sqrt, -1), 1);
    });

    it('applies the second function when the predicate returns false', function() {
      eq(S.ifElse(lt0, Math.abs, Math.sqrt, 16), 4);
    });

    it('is curried', function() {
      eq(S.ifElse(lt0).length, 3);
      eq(S.ifElse(lt0)(Math.abs).length, 2);
      eq(S.ifElse(lt0)(Math.abs)(Math.sqrt).length, 1);
      eq(S.ifElse(lt0)(Math.abs)(Math.sqrt)(-1), 1);
    });

  });

  describe('allPass', function() {

    it('is a binary function', function() {
      eq(typeof S.allPass, 'function');
      eq(S.allPass.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.allPass('wrong'); },
                    errorEq(TypeError,
                            '‘allPass’ expected a value of type ' +
                            '(Array Function) as its first argument; ' +
                            'received "wrong"'));
    });

    it('returns true when given an empty array of predicates', function() {
      eq(S.allPass([], 'quiessence'), true);
    });

    it('returns true when all predicates pass', function() {
      eq(S.allPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'quiessence'),
         true);
    });

    it('returns false when some predicates fail', function() {
      eq(S.allPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'quintessential'),
         false);

      eq(S.allPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'incandescent'),
         false);

      eq(S.allPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'fissiparous'),
         false);
    });

    it('returns false when all predicates fail', function() {
      eq(S.allPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'empathy'),
         false);
    });

    it('short-circuits when one predicate fails', function() {
      var evaluated = false;
      var evaluate = function() { evaluated = true; };

      eq(S.allPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    evaluate],
                   'incandescent'),
         false);
      eq(evaluated, false);
    });

    it('is curried', function() {
      eq(S.allPass([S.test(/q/)]).length, 1);
      eq(S.allPass([S.test(/q/)])('quiessence'), true);
    });

  });

  describe('anyPass', function() {

    it('is a binary function', function() {
      eq(typeof S.anyPass, 'function');
      eq(S.anyPass.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.anyPass('wrong'); },
                    errorEq(TypeError,
                            '‘anyPass’ expected a value of type ' +
                            '(Array Function) as its first argument; ' +
                            'received "wrong"'));
    });

    it('returns false when given an empty array of predicates', function() {
      eq(S.anyPass([], 'quiessence'), false);
    });

    it('returns true when all predicates pass', function() {
      eq(S.anyPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'quiessence'),
         true);
    });

    it('returns true when some predicates pass', function() {
      eq(S.anyPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'quintessential'),
         true);

      eq(S.anyPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'incandescent'),
         true);

      eq(S.anyPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'fissiparous'),
         true);
    });

    it('returns false when all predicates fail', function() {
      eq(S.anyPass([S.test(/q/),
                    S.test(/u/),
                    S.test(/i/),
                    S.test(/c/)],
                   'empathy'),
         false);
    });

    it('it short-circuits when one predicate passes', function() {
      var evaluated = false;
      var evaluate = function() { evaluated = true; };

      eq(S.anyPass([S.test(/q/),
                    evaluate,
                    S.test(/i/),
                    S.test(/c/)],
                   'quiessence'),
         true);
      eq(evaluated, false);
    });

    it('is curried', function() {
      eq(S.anyPass([S.test(/q/)]).length, 1);
      eq(S.anyPass([S.test(/q/)])('quiessence'), true);
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
      assert.throws(function() { S.at(0.5); },
                    errorEq(TypeError,
                            '‘at’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.at(0, null); },
                    errorEq(TypeError,
                            '‘at’ expected a value of type (List a) ' +
                            'as its second argument; received null'));
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
      eq(S.at(1).length, 1);
      eq(S.at(1)(['foo', 'bar', 'baz']), S.Just('bar'));
    });

  });

  describe('slice', function() {

    it('is a ternary function', function() {
      eq(typeof S.slice, 'function');
      eq(S.slice.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.slice(0.5); },
                    errorEq(TypeError,
                            '‘slice’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.slice(0, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘slice’ expected a value of type Integer ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.slice(0, 0, {length: -1}); },
                    errorEq(TypeError,
                            '‘slice’ expected a value of type (List a) ' +
                            'as its third argument; received {"length": -1}'));
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
      eq(S.slice(new Number(-0), 5, [1, 2, 3, 4, 5]), S.Just([]));
      eq(S.slice(2, new Number(-0), [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
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
      eq(S.slice(1).length, 2);
      eq(S.slice(1)(-1).length, 1);
      eq(S.slice(1)(-1)(['a', 'b', 'c', 'd', 'e']), S.Just(['b', 'c', 'd']));
    });

  });

  describe('head', function() {

    it('is a unary function', function() {
      eq(typeof S.head, 'function');
      eq(S.head.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.head({length: -1}); },
                    errorEq(TypeError,
                            '‘head’ expected a value of type (List a) ' +
                            'as its first argument; received {"length": -1}'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.last({length: -1}); },
                    errorEq(TypeError,
                            '‘last’ expected a value of type (List a) ' +
                            'as its first argument; received {"length": -1}'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.tail({length: -1}); },
                    errorEq(TypeError,
                            '‘tail’ expected a value of type (List a) ' +
                            'as its first argument; received {"length": -1}'));
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

    it('type checks its arguments', function() {
      assert.throws(function() { S.init({length: -1}); },
                    errorEq(TypeError,
                            '‘init’ expected a value of type (List a) ' +
                            'as its first argument; received {"length": -1}'));
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
      assert.throws(function() { S.take(0.5); },
                    errorEq(TypeError,
                            '‘take’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.take(0, null); },
                    errorEq(TypeError,
                            '‘take’ expected a value of type (List a) ' +
                            'as its second argument; received null'));
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
      eq(S.take(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing());
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
      eq(S.take(3).length, 1);
      eq(S.take(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b', 'c']));
    });

  });

  describe('takeLast', function() {

    it('is a binary function', function() {
      eq(typeof S.takeLast, 'function');
      eq(S.takeLast.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.takeLast(0.5); },
                    errorEq(TypeError,
                            '‘takeLast’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.takeLast(0, null); },
                    errorEq(TypeError,
                            '‘takeLast’ expected a value of type (List a) ' +
                            'as its second argument; received null'));
    });

    it('returns a Nothing if n is negative', function() {
      eq(S.takeLast(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.takeLast(-1, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.takeLast(-0, 'abcde'), S.Nothing());
      eq(S.takeLast(-1, 'abcde'), S.Nothing());
      eq(S.takeLast(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing());
    });

    it('returns a Just with the last n elements for valid n; Nothing otherwise', function() {
      eq(S.takeLast(4, ['a', 'b', 'c']), S.Nothing());
      eq(S.takeLast(3, ['a', 'b', 'c']), S.Just(['a', 'b', 'c']));
      eq(S.takeLast(2, ['a', 'b', 'c']), S.Just(['b', 'c']));
      eq(S.takeLast(1, ['a', 'b', 'c']), S.Just(['c']));
      eq(S.takeLast(0, ['a', 'b', 'c']), S.Just([]));
      eq(S.takeLast(4, 'abc'), S.Nothing());
      eq(S.takeLast(3, 'abc'), S.Just('abc'));
      eq(S.takeLast(2, 'abc'), S.Just('bc'));
      eq(S.takeLast(1, 'abc'), S.Just('c'));
      eq(S.takeLast(0, 'abc'), S.Just(''));
    });

    it('is curried', function() {
      eq(S.takeLast(3).length, 1);
      eq(S.takeLast(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['c', 'd', 'e']));
    });

  });

  describe('drop', function() {

    it('is a binary function', function() {
      eq(typeof S.drop, 'function');
      eq(S.drop.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.drop(0.5); },
                    errorEq(TypeError,
                            '‘drop’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.drop(0, null); },
                    errorEq(TypeError,
                            '‘drop’ expected a value of type (List a) ' +
                            'as its second argument; received null'));
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
      eq(S.drop(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing());
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
      eq(S.drop(3).length, 1);
      eq(S.drop(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['d', 'e']));
    });

  });

  describe('dropLast', function() {

    it('is a binary function', function() {
      eq(typeof S.dropLast, 'function');
      eq(S.dropLast.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.dropLast(0.5); },
                    errorEq(TypeError,
                            '‘dropLast’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.dropLast(0, null); },
                    errorEq(TypeError,
                            '‘dropLast’ expected a value of type (List a) ' +
                            'as its second argument; received null'));
    });

    it('returns a Nothing if n is negative', function() {
      eq(S.dropLast(-3, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.dropLast(-0, ['a', 'b', 'c', 'd', 'e']), S.Nothing());
      eq(S.dropLast(-3, 'abcde'), S.Nothing());
      eq(S.dropLast(-0, 'abcde'), S.Nothing());
      eq(S.dropLast(new Number(-0), ['a', 'b', 'c', 'd', 'e']), S.Nothing());
    });

    it('returns a Just dropping the last n items for valid n; Nothing otherwise', function() {
      eq(S.dropLast(4, ['a', 'b', 'c']), S.Nothing());
      eq(S.dropLast(3, ['a', 'b', 'c']), S.Just([]));
      eq(S.dropLast(2, ['a', 'b', 'c']), S.Just(['a']));
      eq(S.dropLast(1, ['a', 'b', 'c']), S.Just(['a', 'b']));
      eq(S.dropLast(0, ['a', 'b', 'c']), S.Just(['a', 'b', 'c']));
      eq(S.dropLast(4, 'abc'), S.Nothing());
      eq(S.dropLast(3, 'abc'), S.Just(''));
      eq(S.dropLast(2, 'abc'), S.Just('a'));
      eq(S.dropLast(1, 'abc'), S.Just('ab'));
      eq(S.dropLast(0, 'abc'), S.Just('abc'));
    });

    it('is curried', function() {
      eq(S.dropLast(3).length, 1);
      eq(S.dropLast(3)(['a', 'b', 'c', 'd', 'e']), S.Just(['a', 'b']));
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
                            '‘find’ expected a value of type Function ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.find(R.T, null); },
                    errorEq(TypeError,
                            '‘find’ expected a value of type (Array a) ' +
                            'as its second argument; received null'));
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
      eq(S.find(R.T).length, 1);
      eq(S.find(R.T)([null]), S.Just(null));
    });

  });

  describe('indexOf', function() {

    it('is a binary function', function() {
      eq(typeof S.indexOf, 'function');
      eq(S.indexOf.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.indexOf('x', null); },
                    errorEq(TypeError,
                            '‘indexOf’ requires ‘b’ to implement ' +
                            'ArrayLike; Null does not'));
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
      eq(S.indexOf('c').length, 1);
      eq(S.indexOf('c')(['a', 'b', 'c', 'd', 'e']), S.Just(2));
    });

  });

  describe('lastIndexOf', function() {

    it('is a binary function', function() {
      eq(typeof S.lastIndexOf, 'function');
      eq(S.lastIndexOf.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.lastIndexOf('x', null); },
                    errorEq(TypeError,
                            '‘lastIndexOf’ requires ‘b’ to implement ' +
                            'ArrayLike; Null does not'));
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
      eq(S.lastIndexOf('c').length, 1);
      eq(S.lastIndexOf('c')(['a', 'b', 'c', 'd', 'e']), S.Just(2));
    });

  });

  describe('pluck', function() {

    it('is a ternary function', function() {
      eq(typeof S.pluck, 'function');
      eq(S.pluck.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.pluck([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘pluck’ expected a value of type TypeRep ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.pluck(Number, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘pluck’ expected a value of type String ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.pluck(Number, 'x', {length: 0}); },
                    errorEq(TypeError,
                            '‘pluck’ expected a value of type ' +
                            '(Array a) as its third argument; ' +
                            'received {"length": 0}'));
    });

    it('returns a list of satisfactory plucked values', function() {
      var xs = [{x: '1'}, {x: 2}, {x: null}, {x: undefined}, {}];
      eq(S.pluck(Number, 'x', []), []);
      eq(S.pluck(Number, 'x', xs),
         [S.Nothing(), S.Just(2), S.Nothing(), S.Nothing(), S.Nothing()]);
    });

    it('does not rely on constructor identity', function() {
      eq(S.pluck(Array, 'x', [{x: vm.runInNewContext('[0]')}]), [S.Just([0])]);
      eq(S.pluck(vm.runInNewContext('Array'), 'x', [{x: [0]}]), [S.Just([0])]);
    });

    it('is curried', function() {
      eq(S.pluck(Number).length, 2);
      eq(S.pluck(Number)('x').length, 1);
      eq(S.pluck(Number)('x')([{x: 42}]), [S.Just(42)]);
    });

  });

  describe('reduce', function() {

    it('is a ternary function', function() {
      eq(typeof S.reduce, 'function');
      eq(S.reduce.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.reduce('xxx'); },
                    errorEq(TypeError,
                            '‘reduce’ expected a value of type Function ' +
                            'as its first argument; received "xxx"'));
    });

    it('folds over lists with the supplied accumulator', function() {
      eq(S.reduce(S.add, 0, [1, 2, 3, 4, 5]), 15);
      eq(S.reduce(S.add, 0, []), 0);
      eq(S.reduce(S.lift2(S.add), S.Just(0),
                  [S.Just(1), S.Just(2), S.Just(3), S.Just(4), S.Just(5)]),
         S.Just(15));
    });

    it('dispatches to a "reduce" method if present', function() {
      eq(S.reduce(S.add, 10, S.Just(5)), 15);
    });

    it('is curried', function() {
      eq(S.reduce(S.add).length, 2);
      eq(S.reduce(S.add)(0).length, 1);
      eq(S.reduce(S.add)(0)([1, 2, 3, 4, 5]), 15);
    });

  });

  describe('unfoldr', function() {

    it('is a binary function', function() {
      eq(typeof S.unfoldr, 'function');
      eq(S.unfoldr.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.unfoldr(null); },
                    errorEq(TypeError,
                            '‘unfoldr’ expected a value of type Function ' +
                            'as its first argument; received null'));
    });

    it('correctly unfolds a value into a list', function() {
      var f = function(n) {
        return n >= 5 ? S.Nothing() : S.Just([n, n + 1]);
      };
      eq(S.unfoldr(f, 5), []);
      eq(S.unfoldr(f, 4), [4]);
      eq(S.unfoldr(f, 1), [1, 2, 3, 4]);
    });

  });

});

describe('object', function() {

  describe('get', function() {

    it('is a ternary function', function() {
      eq(typeof S.get, 'function');
      eq(S.get.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.get([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘get’ expected a value of type TypeRep ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.get(Number, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘get’ expected a value of type String ' +
                            'as its second argument; received [1, 2, 3]'));

      assert.throws(function() { S.get(Number, 'x', null); },
                    errorEq(TypeError,
                            '‘get’ requires ‘a’ to implement Accessible; ' +
                            'Null does not'));
    });

    it('returns a Maybe', function() {
      var obj = {x: 0, y: 42};
      eq(S.get(Number, 'x', obj), S.Just(0));
      eq(S.get(Number, 'y', obj), S.Just(42));
      eq(S.get(Number, 'z', obj), S.Nothing());
      eq(S.get(String, 'x', obj), S.Nothing());
    });

    it('does not rely on constructor identity', function() {
      eq(S.get(RegExp, 'x', {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
      eq(S.get(vm.runInNewContext('RegExp'), 'x', {x: /.*/}), S.Just(/.*/));
    });

    it('is curried', function() {
      eq(S.get(Number).length, 2);
      eq(S.get(Number)('x').length, 1);
      eq(S.get(Number)('x')({x: 42}), S.Just(42));
    });

  });

  describe('gets', function() {

    it('is a ternary function', function() {
      eq(typeof S.gets, 'function');
      eq(S.gets.length, 3);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.gets([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘gets’ expected a value of type TypeRep ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.gets(Number, null); },
                    errorEq(TypeError,
                            '‘gets’ expected a value of type (Array String) ' +
                            'as its second argument; received null'));

      assert.throws(function() { S.gets(Number, [], null); },
                    errorEq(TypeError,
                            '‘gets’ requires ‘a’ to implement Accessible; ' +
                            'Null does not'));
    });

    it('returns a Maybe', function() {
      var obj = {x: {z: 0}, y: 42};
      eq(S.gets(Number, ['x'], obj), S.Nothing());
      eq(S.gets(Number, ['y'], obj), S.Just(42));
      eq(S.gets(Number, ['z'], obj), S.Nothing());
      eq(S.gets(Number, ['x', 'z'], obj), S.Just(0));
      eq(S.gets(Number, ['a', 'b', 'c'], obj), S.Nothing());
      eq(S.gets(Number, [], obj), S.Nothing());
      eq(S.gets(Object, [], obj), S.Just({x: {z: 0}, y: 42}));
    });

    it('does not rely on constructor identity', function() {
      eq(S.gets(RegExp, ['x'], {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
      eq(S.gets(vm.runInNewContext('RegExp'), ['x'], {x: /.*/}), S.Just(/.*/));
    });

    it('is curried', function() {
      eq(S.gets(Number).length, 2);
      eq(S.gets(Number)(['x']).length, 1);
      eq(S.gets(Number)(['x'])({x: 42}), S.Just(42));
    });

  });

});

describe('number', function() {

  describe('negate', function() {

    it('is a unary function', function() {
      eq(typeof S.negate, 'function');
      eq(S.negate.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.negate(NaN); },
                    errorEq(TypeError,
                            '‘negate’ expected a value of type ValidNumber ' +
                            'as its first argument; received NaN'));
    });

    it('negates its argument', function() {
      eq(S.negate(0.5), -0.5);
      eq(S.negate(-0.5), 0.5);
      eq(S.negate(0), -0);
      eq(S.negate(-0), 0);
      eq(S.negate(new Number(0.5)), -0.5);
      eq(S.negate(new Number(-0.5)), 0.5);
      eq(S.negate(new Number(0)), -0);
      eq(S.negate(new Number(-0)), 0);
    });

  });

  describe('add', function() {

    it('is a binary function', function() {
      eq(typeof S.add, 'function');
      eq(S.add.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.add('xxx', 1); },
                    errorEq(TypeError,
                            '‘add’ expected a value of type FiniteNumber ' +
                            'as its first argument; received "xxx"'));

      assert.throws(function() { S.add(1, 'xxx'); },
                    errorEq(TypeError,
                            '‘add’ expected a value of type FiniteNumber ' +
                            'as its second argument; received "xxx"'));

      assert.throws(function() { S.add(1, Infinity); },
                    errorEq(TypeError,
                            '‘add’ expected a value of type FiniteNumber ' +
                            'as its second argument; received Infinity'));

      assert.throws(function() { S.add(1, -Infinity); },
                    errorEq(TypeError,
                            '‘add’ expected a value of type FiniteNumber ' +
                            'as its second argument; received -Infinity'));
    });

    it('adds two numbers', function() {
      eq(S.add(1, 1), 2);
      eq(S.add(-1, -1), -2);
      eq(S.add(1.5, 1), 2.5);
      eq(S.add(-1.5, -1), -2.5);
    });

    it('is curried', function() {
      eq(S.add(1).length, 1);
      eq(S.add(1)(1), 2);
    });

  });

  describe('sub', function() {

    it('is a binary function', function() {
      eq(typeof S.sub, 'function');
      eq(S.sub.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.sub('xxx', 1); },
                    errorEq(TypeError,
                            '‘sub’ expected a value of type FiniteNumber ' +
                            'as its first argument; received "xxx"'));

      assert.throws(function() { S.sub(1, 'xxx'); },
                    errorEq(TypeError,
                            '‘sub’ expected a value of type FiniteNumber ' +
                            'as its second argument; received "xxx"'));

      assert.throws(function() { S.sub(1, Infinity); },
                    errorEq(TypeError,
                            '‘sub’ expected a value of type FiniteNumber ' +
                            'as its second argument; received Infinity'));

      assert.throws(function() { S.sub(1, -Infinity); },
                    errorEq(TypeError,
                            '‘sub’ expected a value of type FiniteNumber ' +
                            'as its second argument; received -Infinity'));
    });

    it('subtracts two numbers', function() {
      eq(S.sub(1, 1), 0);
      eq(S.sub(-1, -1), 0);
      eq(S.sub(7.5, 2), 5.5);
      eq(S.sub(-7.5, -2), -5.5);
    });

    it('is curried', function() {
      eq(S.sub(1).length, 1);
      eq(S.sub(1)(1), 0);
    });

  });

  describe('inc', function() {

    it('is a unary function', function() {
      eq(typeof S.inc, 'function');
      eq(S.inc.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.inc('xxx'); },
                    errorEq(TypeError,
                            '‘inc’ expected a value of type FiniteNumber ' +
                            'as its first argument; received "xxx"'));

      assert.throws(function() { S.inc(Infinity); },
                    errorEq(TypeError,
                            '‘inc’ expected a value of type FiniteNumber ' +
                            'as its first argument; received Infinity'));

      assert.throws(function() { S.inc(-Infinity); },
                    errorEq(TypeError,
                            '‘inc’ expected a value of type FiniteNumber ' +
                            'as its first argument; received -Infinity'));
    });

    it('increments a number by one', function() {
      eq(S.inc(1), 2);
      eq(S.inc(-1), 0);
      eq(S.inc(1.5), 2.5);
      eq(S.inc(-1.5), -0.5);
    });

  });

  describe('dec', function() {

    it('is a unary function', function() {
      eq(typeof S.dec, 'function');
      eq(S.dec.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.dec('xxx'); },
                    errorEq(TypeError,
                            '‘dec’ expected a value of type FiniteNumber ' +
                            'as its first argument; received "xxx"'));

      assert.throws(function() { S.dec(Infinity); },
                    errorEq(TypeError,
                            '‘dec’ expected a value of type FiniteNumber ' +
                            'as its first argument; received Infinity'));

      assert.throws(function() { S.dec(-Infinity); },
                    errorEq(TypeError,
                            '‘dec’ expected a value of type FiniteNumber ' +
                            'as its first argument; received -Infinity'));
    });

    it('decrements a number by one', function() {
      eq(S.dec(2), 1);
      eq(S.dec(-1), -2);
      eq(S.dec(1.5), 0.5);
      eq(S.dec(-1.5), -2.5);
    });

  });

  describe('mult', function() {

    it('is a binary function', function() {
      eq(typeof S.mult, 'function');
      eq(S.mult.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.mult('xxx', 2); },
                    errorEq(TypeError,
                            '‘mult’ expected a value of type FiniteNumber ' +
                            'as its first argument; received "xxx"'));

      assert.throws(function() { S.mult(2, 'xxx'); },
                    errorEq(TypeError,
                            '‘mult’ expected a value of type FiniteNumber ' +
                            'as its second argument; received "xxx"'));

      assert.throws(function() { S.mult(2, Infinity); },
                    errorEq(TypeError,
                            '‘mult’ expected a value of type FiniteNumber ' +
                            'as its second argument; received Infinity'));

      assert.throws(function() { S.mult(2, -Infinity); },
                    errorEq(TypeError,
                            '‘mult’ expected a value of type FiniteNumber ' +
                            'as its second argument; received -Infinity'));
    });

    it('multiplies two numbers', function() {
      eq(S.mult(4, 2), 8);
      eq(S.mult(4, -2), -8);
      eq(S.mult(-4, -2), 8);
      eq(S.mult(1.5, 3), 4.5);
      eq(S.mult(-1.5, 3), -4.5);
      eq(S.mult(-1.5, -3), 4.5);
    });

    it('is curried', function() {
      eq(S.mult(1).length, 1);
      eq(S.mult(2)(2), 4);
    });

  });

  describe('div', function() {

    it('is a binary function', function() {
      eq(typeof S.div, 'function');
      eq(S.div.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.div('xxx', 1); },
                    errorEq(TypeError,
                            '‘div’ expected a value of type ' +
                            'FiniteNumber as its first argument; ' +
                            'received "xxx"'));

      assert.throws(function() { S.div(1, 'xxx'); },
                    errorEq(TypeError,
                            '‘div’ expected a value of type ' +
                            'NonZeroFiniteNumber as its second argument; ' +
                            'received "xxx"'));

      assert.throws(function() { S.div(1, 0); },
                    errorEq(TypeError,
                            '‘div’ expected a value of type ' +
                            'NonZeroFiniteNumber as its second argument; ' +
                            'received 0'));

      assert.throws(function() { S.div(1, -0); },
                    errorEq(TypeError,
                            '‘div’ expected a value of type ' +
                            'NonZeroFiniteNumber as its second argument; ' +
                            'received -0'));
    });

    it('divides two numbers', function() {
      eq(S.div(8, 2), 4);
      eq(S.div(8, -2), -4);
      eq(S.div(-8, -2), 4);
      eq(S.div(1.5, 2), 0.75);
      eq(S.div(1.5, -2), -0.75);
      eq(S.div(-1.5, -2), 0.75);
    });

    it('is curried', function() {
      eq(S.div(4).length, 1);
      eq(S.div(8)(2), 4);
    });

  });

  describe('min', function() {

    it('is a binary function', function() {
      eq(typeof S.min, 'function');
      eq(S.min.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.min(/x/); },
                    errorEq(TypeError,
                            '‘min’ requires ‘a’ to implement Ord; ' +
                            'RegExp does not'));

      assert.throws(function() { S.min(NaN); },
                    errorEq(TypeError,
                            '‘min’ requires ‘a’ to implement Ord; ' +
                            'Number does not'));
    });

    it('may be applied to (valid) numbers', function() {
      eq(S.min(10, 2), 2);
      eq(S.min(2, 10), 2);
      eq(S.min(0.1, 0.01), 0.01);
      eq(S.min(0.01, 0.1), 0.01);
      eq(S.min(Infinity, -Infinity), -Infinity);
      eq(S.min(-Infinity, Infinity), -Infinity);
    });

    it('may be applied to strings', function() {
      eq(S.min('abc', 'xyz'), 'abc');
      eq(S.min('xyz', 'abc'), 'abc');
      eq(S.min('10', '2'), '10');
      eq(S.min('2', '10'), '10');
      eq(S.min('A', 'a'), 'A');
      eq(S.min('a', 'A'), 'A');
    });

    it('is curried', function() {
      eq(S.min(10).length, 1);
      eq(S.min(10)(2), 2);
    });

  });

  describe('max', function() {

    it('is a binary function', function() {
      eq(typeof S.max, 'function');
      eq(S.max.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.max(/x/); },
                    errorEq(TypeError,
                            '‘max’ requires ‘a’ to implement Ord; ' +
                            'RegExp does not'));

      assert.throws(function() { S.max(NaN); },
                    errorEq(TypeError,
                            '‘max’ requires ‘a’ to implement Ord; ' +
                            'Number does not'));
    });

    it('may be applied to (valid) numbers', function() {
      eq(S.max(10, 2), 10);
      eq(S.max(2, 10), 10);
      eq(S.max(0.1, 0.01), 0.1);
      eq(S.max(0.01, 0.1), 0.1);
      eq(S.max(Infinity, -Infinity), Infinity);
      eq(S.max(-Infinity, Infinity), Infinity);
    });

    it('may be applied to strings', function() {
      eq(S.max('abc', 'xyz'), 'xyz');
      eq(S.max('xyz', 'abc'), 'xyz');
      eq(S.max('10', '2'), '2');
      eq(S.max('2', '10'), '2');
      eq(S.max('A', 'a'), 'a');
      eq(S.max('a', 'A'), 'a');
    });

    it('is curried', function() {
      eq(S.max(10).length, 1);
      eq(S.max(10)(2), 10);
    });

  });

});

describe('integer', function() {

  describe('even', function() {

    it('is a unary function', function() {
      eq(typeof S.even, 'function');
      eq(S.even.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.even(0.5); },
                    errorEq(TypeError,
                            '‘even’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.even(Infinity); },
                    errorEq(TypeError,
                            '‘even’ expected a value of type Integer ' +
                            'as its first argument; received Infinity'));
    });

    it('returns true for even integer', function() {
      eq(S.even(0), true);
      eq(S.even(-0), true);
      eq(S.even(2), true);
      eq(S.even(-2), true);
      eq(S.even(new Number(0)), true);
      eq(S.even(new Number(-0)), true);
      eq(S.even(new Number(2)), true);
      eq(S.even(new Number(-2)), true);
    });

    it('returns false for odd integer', function() {
      eq(S.even(1), false);
      eq(S.even(-1), false);
      eq(S.even(new Number(1)), false);
      eq(S.even(new Number(-1)), false);
    });

  });

  describe('odd', function() {

    it('is a unary function', function() {
      eq(typeof S.odd, 'function');
      eq(S.odd.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.odd(-0.5); },
                    errorEq(TypeError,
                            '‘odd’ expected a value of type Integer ' +
                            'as its first argument; received -0.5'));

      assert.throws(function() { S.odd(-Infinity); },
                    errorEq(TypeError,
                            '‘odd’ expected a value of type Integer ' +
                            'as its first argument; received -Infinity'));
    });

    it('returns true for odd integer', function() {
      eq(S.odd(1), true);
      eq(S.odd(-1), true);
      eq(S.odd(new Number(1)), true);
      eq(S.odd(new Number(-1)), true);
    });

    it('returns false for even integer', function() {
      eq(S.odd(0), false);
      eq(S.odd(-0), false);
      eq(S.odd(2), false);
      eq(S.odd(-2), false);
      eq(S.odd(new Number(0)), false);
      eq(S.odd(new Number(-0)), false);
      eq(S.odd(new Number(2)), false);
      eq(S.odd(new Number(-2)), false);
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
                            '‘parseDate’ expected a value of type String ' +
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
                            '‘parseFloat’ expected a value of type String ' +
                            'as its first argument; received [1, 2, 3]'));
    });

    it('returns a Maybe', function() {
      eq(S.parseFloat('12.34'), S.Just(12.34));
      eq(S.parseFloat('Infinity'), S.Just(Infinity));
      eq(S.parseFloat('-Infinity'), S.Just(-Infinity));
      eq(S.parseFloat('NaN'), S.Just(NaN));
      eq(S.parseFloat('-NaN'), S.Just(NaN));  // Haskell accepts "-NaN"
      eq(S.parseFloat('0'), S.Just(0));
      eq(S.parseFloat('-0'), S.Just(-0));
      eq(S.parseFloat('42'), S.Just(42));
      eq(S.parseFloat('42.'), S.Just(42));
      eq(S.parseFloat('0.5'), S.Just(0.5));
      eq(S.parseFloat('.25'), S.Just(0.25));
      eq(S.parseFloat('+42'), S.Just(42));
      eq(S.parseFloat('+42.'), S.Just(42));
      eq(S.parseFloat('+0.5'), S.Just(0.5));
      eq(S.parseFloat('+.25'), S.Just(0.25));
      eq(S.parseFloat('-42'), S.Just(-42));
      eq(S.parseFloat('-42.'), S.Just(-42));
      eq(S.parseFloat('-0.5'), S.Just(-0.5));
      eq(S.parseFloat('-.25'), S.Just(-0.25));
      eq(S.parseFloat('0.5 '), S.Just(0.5));
      eq(S.parseFloat(' 0.5'), S.Just(0.5));
      eq(S.parseFloat('0.5x'), S.Nothing());  // parseFloat('0.5x') == 0.25
      eq(S.parseFloat('x0.5'), S.Nothing());
      eq(S.parseFloat('-1e3'), S.Just(-1000));
      eq(S.parseFloat('-1e03'), S.Just(-1000));
      eq(S.parseFloat('-1e+3'), S.Just(-1000));
      eq(S.parseFloat('-1e+03'), S.Just(-1000));
      eq(S.parseFloat('-1e-3'), S.Just(-0.001));
      eq(S.parseFloat('-1e-03'), S.Just(-0.001));
      eq(S.parseFloat('xxx'), S.Nothing());
    });

  });

  describe('parseInt', function() {

    it('is a binary function', function() {
      eq(typeof S.parseInt, 'function');
      eq(S.parseInt.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.parseInt(0.5); },
                    errorEq(TypeError,
                            '‘parseInt’ expected a value of type Integer ' +
                            'as its first argument; received 0.5'));

      assert.throws(function() { S.parseInt(10, 42); },
                    errorEq(TypeError,
                            '‘parseInt’ expected a value of type String ' +
                            'as its second argument; received 42'));
    });

    it('returns a Maybe', function() {
      eq(S.parseInt(10, '42'), S.Just(42));
      eq(S.parseInt(16, '2A'), S.Just(42));
      eq(S.parseInt(10, 'NaN'), S.Nothing());
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
      eq(S.parseInt(10, '12.34'), S.Nothing());  // parseInt('12.34', 10) == 12
      eq(S.parseInt(16, 'alice'), S.Nothing());  // parseInt('alice', 16) == 10
    });

    it('restricts to exactly representable range (-2^53 .. 2^53)', function() {
      eq(S.parseInt(10,  '9007199254740991'), S.Just(9007199254740991));
      eq(S.parseInt(10, '-9007199254740991'), S.Just(-9007199254740991));
      eq(S.parseInt(10,  '9007199254740992'), S.Nothing());
      eq(S.parseInt(10, '-9007199254740992'), S.Nothing());
      eq(S.parseInt(10,  'Infinity'), S.Nothing());
      eq(S.parseInt(10, '-Infinity'), S.Nothing());
    });

    it('is curried', function() {
      eq(S.parseInt(10).length, 1);
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
                            '‘parseJson’ expected a value of type String ' +
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

  describe('regex', function() {

    it('is a binary function', function() {
      eq(typeof S.regex, 'function');
      eq(S.regex.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.regex('y'); },
                    errorEq(TypeError,
                            '‘regex’ expected a value of type ("" | "g" ' +
                            '| "i" | "m" | "gi" | "gm" | "im" | "gim") ' +
                            'as its first argument; received "y"'));

      assert.throws(function() { S.regex('G'); },
                    errorEq(TypeError,
                            '‘regex’ expected a value of type ("" | "g" ' +
                            '| "i" | "m" | "gi" | "gm" | "im" | "gim") ' +
                            'as its first argument; received "G"'));

      assert.throws(function() { S.regex('ig'); },
                    errorEq(TypeError,
                            '‘regex’ expected a value of type ("" | "g" ' +
                            '| "i" | "m" | "gi" | "gm" | "im" | "gim") ' +
                            'as its first argument; received "ig"'));

      function G() {}
      G.prototype.toString = R.always('g');

      assert.throws(function() { S.regex(new G()); },
                    errorEq(TypeError,
                            '‘regex’ expected a value of type ("" | "g" ' +
                            '| "i" | "m" | "gi" | "gm" | "im" | "gim") ' +
                            'as its first argument; received g'));

      assert.throws(function() { S.regex('', /(?:)/); },
                    errorEq(TypeError,
                            '‘regex’ expected a value of type String ' +
                            'as its second argument; received /(?:)/'));
    });

    it('returns a RegExp', function() {
      eq(S.regex('', '\\d'), /\d/);
      eq(S.regex('g', '\\d'), /\d/g);
      eq(S.regex('i', '\\d'), /\d/i);
      eq(S.regex('m', '\\d'), /\d/m);
      eq(S.regex('gi', '\\d'), /\d/gi);
      eq(S.regex('gm', '\\d'), /\d/gm);
      eq(S.regex('im', '\\d'), /\d/im);
      eq(S.regex('gim', '\\d'), /\d/gim);
    });

    it('is curried', function() {
      eq(S.regex('').length, 1);
      eq(S.regex('')('\\d'), /\d/);
    });

  });

  describe('regexEscape', function() {

    it('is a unary function', function() {
      eq(typeof S.regexEscape, 'function');
      eq(S.regexEscape.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.regexEscape(/(?:)/); },
                    errorEq(TypeError,
                            '‘regexEscape’ expected a value of type String ' +
                            'as its first argument; received /(?:)/'));
    });

    it('escapes regular expression metacharacters', function() {
      eq(S.regexEscape('-=*{XYZ}*=-'), '\\-=\\*\\{XYZ\\}\\*=\\-');
    });

    it('property: test(regex("", regexEscape(s)), s)', function() {
      jsc.assert(jsc.forall(jsc.string, function(s) {
        return S.test(S.regex('', S.regexEscape(s)), s);
      }), {tests: 1000});
    });

    it('property: test(regex("", "^" + regexEscape(s) + "$"), s)', function() {
      jsc.assert(jsc.forall(jsc.string, function(s) {
        return S.test(S.regex('', '^' + S.regexEscape(s) + '$'), s);
      }), {tests: 1000});
    });

  });

  describe('test', function() {

    it('is a binary function', function() {
      eq(typeof S.test, 'function');
      eq(S.test.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.test('^a'); },
                    errorEq(TypeError,
                            '‘test’ expected a value of type RegExp ' +
                            'as its first argument; received "^a"'));

      assert.throws(function() { S.test(/^a/, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘test’ expected a value of type String ' +
                            'as its second argument; received [1, 2, 3]'));
    });

    it('returns true if pattern matches string', function() {
      eq(S.test(/^a/, 'abacus'), true);
    });

    it('returns false if pattern does not match string', function() {
      eq(S.test(/^a/, 'banana'), false);
    });

    it('is referentially transparent', function() {
      var pattern = /x/g;
      eq(pattern.lastIndex, 0);
      eq(S.test(pattern, 'xyz'), true);
      eq(pattern.lastIndex, 0);
      eq(S.test(pattern, 'xyz'), true);
    });

    it('is curried', function() {
      eq(S.test(/^a/).length, 1);
      eq(S.test(/^a/)('abacus'), true);
    });

  });

  describe('match', function() {

    it('is a binary function', function() {
      eq(typeof S.match, 'function');
      eq(S.match.length, 2);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.match([1, 2, 3]); },
                    errorEq(TypeError,
                            '‘match’ expected a value of type RegExp ' +
                            'as its first argument; received [1, 2, 3]'));

      assert.throws(function() { S.match(/(?:)/, [1, 2, 3]); },
                    errorEq(TypeError,
                            '‘match’ expected a value of type String ' +
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
      eq(S.match(/x/).length, 1);
      eq(S.match(/x/)('xyz'), S.Just([S.Just('x')]));
    });

  });

});

describe('string', function() {

  describe('toUpper', function() {

    it('is a unary function', function() {
      eq(typeof S.toUpper, 'function');
      eq(S.toUpper.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.toUpper(true); },
                    errorEq(TypeError,
                            '‘toUpper’ expected a value of type String ' +
                            'as its first argument; received true'));
    });

    it('returns the upper-case equivalent of its argument', function() {
      eq(S.toUpper(''), '');
      eq(S.toUpper('ABC def 123'), 'ABC DEF 123');
      eq(S.toUpper(new String('')), '');
      eq(S.toUpper(new String('ABC def 123')), 'ABC DEF 123');
    });

  });

  describe('toLower', function() {

    it('is a unary function', function() {
      eq(typeof S.toLower, 'function');
      eq(S.toLower.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.toLower(true); },
                    errorEq(TypeError,
                            '‘toLower’ expected a value of type String ' +
                            'as its first argument; received true'));
    });

    it('returns the lower-case equivalent of its argument', function() {
      eq(S.toLower(''), '');
      eq(S.toLower('ABC def 123'), 'abc def 123');
      eq(S.toLower(new String('')), '');
      eq(S.toLower(new String('ABC def 123')), 'abc def 123');
    });

  });

  describe('words', function() {

    it('is a unary function', function() {
      eq(typeof S.words, 'function');
      eq(S.words.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.words(['foo']); },
                    errorEq(TypeError,
                            '‘words’ expected a value of type String ' +
                            'as its first argument; received ["foo"]'));
    });

    it('splits a string into a list of words', function() {
      eq(S.words(''), []);
      eq(S.words(' '), []);
      eq(S.words(' \t\r\n'), []);
      eq(S.words('foo bar baz'), ['foo', 'bar', 'baz']);
      eq(S.words(' foo bar baz '), ['foo', 'bar', 'baz']);
      eq(S.words('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['foo', 'bar', 'baz']);
    });

  });

  describe('unwords', function() {

    it('is a unary function', function() {
      eq(typeof S.unwords, 'function');
      eq(S.unwords.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.unwords(null); },
                    errorEq(TypeError,
                            '‘unwords’ expected a value of type ' +
                            '(Array String) as its first argument; ' +
                            'received null'));
    });

    it('joins -- with separating spaces -- a list of words', function() {
      eq(S.unwords([]), '');
      eq(S.unwords(['']), '');
      eq(S.unwords(['', '']), ' ');
      eq(S.unwords([' ']), ' ');
      eq(S.unwords([' ', ' ']), '   ');
      eq(S.unwords(['foo', 'bar', 'baz']), 'foo bar baz');
      eq(S.unwords([' foo ', ' bar ', ' baz ']), ' foo   bar   baz ');
    });

  });

  describe('lines', function() {

    it('is a unary function', function() {
      eq(typeof S.lines, 'function');
      eq(S.lines.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.lines(['foo']); },
                    errorEq(TypeError,
                            '‘lines’ expected a value of type String ' +
                            'as its first argument; received ["foo"]'));
    });

    it('splits a string into a list of lines', function() {
      eq(S.lines(''), []);
      eq(S.lines('\n'), ['']);
      eq(S.lines('\n\n'), ['', '']);
      eq(S.lines('foo\nbar\nbaz'), ['foo', 'bar', 'baz']);
      eq(S.lines('foo\nbar\nbaz\n'), ['foo', 'bar', 'baz']);
      eq(S.lines('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['\tfoo', '\tbar', '\tbaz']);
    });

  });

  describe('unlines', function() {

    it('is a unary function', function() {
      eq(typeof S.unlines, 'function');
      eq(S.unlines.length, 1);
    });

    it('type checks its arguments', function() {
      assert.throws(function() { S.unlines(null); },
                    errorEq(TypeError,
                            '‘unlines’ expected a value of type ' +
                            '(Array String) as its first argument; ' +
                            'received null'));
    });

    it('joins a list of lines after appending "\n" to each', function() {
      eq(S.unlines([]), '');
      eq(S.unlines(['']), '\n');
      eq(S.unlines(['', '']), '\n\n');
      eq(S.unlines(['\n']), '\n\n');
      eq(S.unlines(['\n', '\n']), '\n\n\n\n');
      eq(S.unlines(['foo', 'bar', 'baz']), 'foo\nbar\nbaz\n');
    });

  });

});
