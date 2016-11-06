'use strict';

var throws = require('assert').throws;

var jsc = require('jsverify');
var R = require('ramda');

var S = require('../..');

var errorEq = require('../internal/errorEq');


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

//  identityToMaybe :: Identity a -> Maybe a
var identityToMaybe = function(i) {
  return S.Just(i.value);
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

describe('Either', function() {

  it('throws if called', function() {
    throws(function() { S.Either(); },
           errorEq(Error, 'Cannot instantiate Either'));
  });

  describe('Traversable laws', function() {

    it('satisfies naturality', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.integer, IdentityArb(jsc.string)), function(either) {
        var lhs = identityToMaybe(either.sequence(Identity.of));
        var rhs = either.map(identityToMaybe).sequence(S.Maybe.of);
        return lhs.equals(rhs);
      }));
    });

    it('satisfies identity', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.integer, jsc.string), function(either) {
        var lhs = either.map(Identity).sequence(Identity.of);
        var rhs = Identity.of(either);
        return lhs.equals(rhs);
      }));
    });

    it('satisfies composition', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.string, IdentityArb(EitherArb(jsc.string, jsc.integer))), function(u) {
        var C = Compose(Identity, S.Either);
        var lhs = u.map(C).sequence(C.of);
        var rhs = C(u.sequence(Identity.of).map(function(x) {
          return x.sequence(S.Either.of);
        }));
        return lhs.equals(rhs);
      }));
    });

  });

});
