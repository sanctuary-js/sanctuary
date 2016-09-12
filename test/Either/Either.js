'use strict';

var jsc = require('jsverify');

var S = require('../internal/sanctuary');

var EitherArb = require('../internal/EitherArb');
var Identity = require('../internal/Identity');
var IdentityArb = require('../internal/IdentityArb');
var add_ = require('../internal/add_');
var equals = require('../internal/equals');
var laws = require('../internal/laws');
var squareRoot = require('../internal/squareRoot');


suite('Either', function() {

  suite('Setoid laws', function() {

    var setoidLaws = laws.Setoid;

    setoidLaws.reflexivity(
      EitherArb(jsc.string, jsc.falsy)
    );

    setoidLaws.symmetry(
      EitherArb(jsc.bool, jsc.bool),
      EitherArb(jsc.bool, jsc.bool)
    );

    setoidLaws.transitivity(
      EitherArb(jsc.bool, jsc.bool),
      EitherArb(jsc.bool, jsc.bool),
      EitherArb(jsc.bool, jsc.bool)
    );

  });

  suite('Semigroup laws', function() {

    var semigroupLaws = laws.Semigroup(equals);

    semigroupLaws.associativity(
      EitherArb(jsc.string, jsc.string),
      EitherArb(jsc.string, jsc.string),
      EitherArb(jsc.string, jsc.string)
    );

  });

  suite('Functor laws', function() {

    var functorLaws = laws.Functor(equals);

    functorLaws.identity(
      EitherArb(jsc.string, jsc.number)
    );

    functorLaws.composition(
      EitherArb(jsc.string, jsc.number),
      jsc.constant(Math.sqrt),
      jsc.constant(Math.abs)
    );

  });

  suite('Bifunctor laws', function() {

    var bifunctorLaws = laws.Bifunctor(equals);

    bifunctorLaws.identity(
      EitherArb(jsc.string, jsc.number)
    );

    bifunctorLaws.composition(
      EitherArb(jsc.string, jsc.number),
      jsc.constant(Math.sqrt),
      jsc.constant(function(s) { return s.length; }),
      jsc.constant(Math.sqrt),
      jsc.constant(Math.abs)
    );

  });

  suite('Apply laws', function() {

    var applyLaws = laws.Apply(equals);

    applyLaws.composition(
      EitherArb(jsc.string, jsc.constant(Math.sqrt)),
      EitherArb(jsc.string, jsc.constant(Math.abs)),
      EitherArb(jsc.string, jsc.number)
    );

  });

  suite('Applicative laws', function() {

    var applicativeLaws = laws.Applicative(equals, S.Either);

    applicativeLaws.identity(
      EitherArb(jsc.string, jsc.number)
    );

    applicativeLaws.homomorphism(
      jsc.constant(Math.abs),
      jsc.number
    );

    applicativeLaws.interchange(
      EitherArb(jsc.string, jsc.constant(Math.abs)),
      jsc.number
    );

  });

  suite('Chain laws', function() {

    var chainLaws = laws.Chain(equals);

    chainLaws.associativity(
      EitherArb(jsc.string, jsc.array(jsc.number)),
      jsc.constant(function(xs) { return xs.length > 0 ? S.Right(xs[0]) : S.Left('Empty list'); }),
      jsc.constant(squareRoot)
    );

  });

  suite('Monad laws', function() {

    var monadLaws = laws.Monad(equals, S.Either);

    monadLaws.leftIdentity(
      jsc.constant(squareRoot),
      jsc.number
    );

    monadLaws.rightIdentity(
      EitherArb(jsc.string, jsc.number)
    );

  });

  suite('Alt laws', function() {

    var altLaws = laws.Alt(equals);

    altLaws.associativity(
      EitherArb(jsc.string, jsc.number),
      EitherArb(jsc.string, jsc.number),
      EitherArb(jsc.string, jsc.number)
    );

    altLaws.distributivity(
      EitherArb(jsc.string, jsc.number),
      EitherArb(jsc.string, jsc.number),
      jsc.constant(Math.sqrt)
    );

  });

  suite('Foldable laws', function() {

    var foldableLaws = laws.Foldable(equals);

    foldableLaws.associativity(
      jsc.constant(add_),
      jsc.number,
      EitherArb(jsc.string, jsc.number)
    );

  });

  suite('Traversable laws', function() {

    var traversableLaws = laws.Traversable(equals);

    traversableLaws.naturality(
      jsc.constant(S.compose(S.Just, S.prop('value'))),
      EitherArb(jsc.string, IdentityArb(jsc.number)),
      jsc.constant(Identity),
      jsc.constant(S.Maybe)
    );

    traversableLaws.identity(
      EitherArb(jsc.string, jsc.number),
      jsc.constant(Identity)
    );

    traversableLaws.composition(
      EitherArb(jsc.string, IdentityArb(EitherArb(jsc.string, jsc.number))),
      jsc.constant(Identity),
      jsc.constant(S.Either)
    );

  });

  suite('Extend laws', function() {

    var extendLaws = laws.Extend(equals);

    extendLaws.associativity(
      EitherArb(jsc.string, jsc.integer),
      jsc.constant(function(either) { return either.value + 1; }),
      jsc.constant(function(either) { return either.value * either.value; })
    );

  });

});
