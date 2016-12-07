'use strict';

var jsc = require('jsverify');

var S = require('../..');

var Compose = require('../internal/Compose');
var EitherArb = require('../internal/EitherArb');
var Identity = require('../internal/Identity');
var IdentityArb = require('../internal/IdentityArb');


suite('Either', function() {

  suite('Traversable laws', function() {

    test('satisfies naturality', function() {
      var identityToMaybe = S.compose(S.Just, S.prop('value'));
      jsc.assert(jsc.forall(EitherArb(jsc.integer, IdentityArb(jsc.string)), function(either) {
        var lhs = identityToMaybe(either.sequence(Identity.of));
        var rhs = either.map(identityToMaybe).sequence(S.Maybe.of);
        return lhs.equals(rhs);
      }));
    });

    test('satisfies identity', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.integer, jsc.string), function(either) {
        var lhs = either.map(Identity).sequence(Identity.of);
        var rhs = Identity.of(either);
        return lhs.equals(rhs);
      }));
    });

    test('satisfies composition', function() {
      jsc.assert(jsc.forall(EitherArb(jsc.string, IdentityArb(EitherArb(jsc.string, jsc.integer))), function(u) {
        var C = Compose(Identity)(S.Either);
        var lhs = u.map(C).sequence(C.of);
        var rhs = C(u.sequence(Identity.of).map(function(x) {
          return x.sequence(S.Either.of);
        }));
        return lhs.equals(rhs);
      }));
    });

  });

});
