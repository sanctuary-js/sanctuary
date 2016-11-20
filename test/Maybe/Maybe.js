'use strict';

var jsc = require('jsverify');
var R = require('ramda');

var S = require('../..');

var throws = require('../internal/throws');


//  Identity :: a -> Identity a
var Identity = function Identity(x) {
  return {
    of: Identity,
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

//  IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
var IdentityArb = function(arb) {
  return arb.smap(Identity, function(i) { return i.value; });
};

//  MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
var MaybeArb = function(arb) {
  return jsc.oneof(JustArb(arb), jsc.constant(S.Nothing));
};

//  JustArb :: Arbitrary a -> Arbitrary (Maybe a)
var JustArb = function(arb) {
  return arb.smap(S.Just, function(m) { return m.value; }, R.toString);
};

//  EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
var EitherArb = function(lArb, rArb) {
  return jsc.oneof(LeftArb(lArb), RightArb(rArb));
};

//  LeftArb :: Arbitrary a -> Arbitrary (Either a b)
var LeftArb = function(arb) {
  return arb.smap(S.Left, function(e) { return e.value; }, R.toString);
};

//  RightArb :: Arbitrary a -> Arbitrary (Either b a)
var RightArb = function(arb) {
  return arb.smap(S.Right, function(e) { return e.value; }, R.toString);
};

//  Compose :: Apply f, Apply g
//          => { of: b -> f b } -> { of: c -> g c }
//          -> f (g a) -> Compose f g a
var Compose = function(F, G) {
  var _Compose = function _Compose(x) {
    return {
      constructor: _Compose,
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
  };
  _Compose.of = function(x) {
    return _Compose(F.of(G.of(x)));
  };
  return _Compose;
};

suite('Maybe', function() {

  test('throws if called', function() {
    throws(function() { S.Maybe(); }, Error, 'Cannot instantiate Maybe');
  });

  suite('Traversable laws', function() {

    test('satisfies naturality', function() {
      jsc.assert(jsc.forall(MaybeArb(EitherArb(jsc.integer, jsc.string)), function(maybe) {
        var lhs = S.eitherToMaybe(maybe.sequence(S.Either.of));
        var rhs = maybe.map(S.eitherToMaybe).sequence(S.Maybe.of);
        return lhs.equals(rhs);
      }));
    });

    test('satisfies identity', function() {
      jsc.assert(jsc.forall(MaybeArb(jsc.integer), function(maybe) {
        var lhs = maybe.map(Identity).sequence(Identity.of);
        var rhs = Identity.of(maybe);
        return lhs.equals(rhs);
      }));
    });

    test('satisfies composition', function() {
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
