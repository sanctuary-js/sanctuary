'use strict';

var jsc = require('jsverify');

var S = require('../..');

var Compose = require('../internal/Compose');
var EitherArb = require('../internal/EitherArb');
var Identity = require('../internal/Identity');
var IdentityArb = require('../internal/IdentityArb');
var MaybeArb = require('../internal/MaybeArb');


suite('Maybe', function() {

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
        var C = Compose(Identity)(S.Maybe);
        var lhs = u.map(C).sequence(C.of);
        var rhs = C(u.sequence(Identity.of).map(function(x) {
          return x.sequence(S.Maybe.of);
        }));
        return lhs.equals(rhs);
      }));
    });

  });

});
