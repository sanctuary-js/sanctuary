'use strict';

var jsc = require ('jsverify');

var S = require ('../internal/sanctuary');

var EitherArb = require ('../internal/EitherArb');
var Identity = require ('../internal/Identity');
var IdentityArb = require ('../internal/IdentityArb');
var MaybeArb = require ('../internal/MaybeArb');
var add_ = require ('../internal/add_');
var equals = require ('../internal/equals');
var laws = require ('../internal/laws');


suite ('Maybe', function() {

  suite ('Setoid laws', function() {

    var setoidLaws = laws.Setoid;

    setoidLaws.reflexivity (
      MaybeArb (jsc.falsy)
    );

    setoidLaws.symmetry (
      MaybeArb (jsc.bool),
      MaybeArb (jsc.bool)
    );

    setoidLaws.transitivity (
      MaybeArb (jsc.bool),
      MaybeArb (jsc.bool),
      MaybeArb (jsc.bool)
    );

  });

  suite ('Semigroup laws', function() {

    var semigroupLaws = laws.Semigroup (equals);

    semigroupLaws.associativity (
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
      MaybeArb (jsc.string)
    );

  });

  suite ('Monoid laws', function() {

    var monoidLaws = laws.Monoid (equals, S.Maybe);

    monoidLaws.leftIdentity (
      MaybeArb (jsc.string)
    );

    monoidLaws.rightIdentity (
      MaybeArb (jsc.string)
    );

  });

  suite ('Functor laws', function() {

    var functorLaws = laws.Functor (equals);

    functorLaws.identity (
      MaybeArb (jsc.number)
    );

    functorLaws.composition (
      MaybeArb (jsc.number),
      jsc.constant (Math.sqrt),
      jsc.constant (Math.abs)
    );

  });

  suite ('Apply laws', function() {

    var applyLaws = laws.Apply (equals);

    applyLaws.composition (
      MaybeArb (jsc.constant (Math.sqrt)),
      MaybeArb (jsc.constant (Math.abs)),
      MaybeArb (jsc.number)
    );

  });

  suite ('Applicative laws', function() {

    var applicativeLaws = laws.Applicative (equals, S.Maybe);

    applicativeLaws.identity (
      MaybeArb (jsc.number)
    );

    applicativeLaws.homomorphism (
      jsc.constant (Math.abs),
      jsc.number
    );

    applicativeLaws.interchange (
      MaybeArb (jsc.constant (Math.abs)),
      jsc.number
    );

  });

  suite ('Chain laws', function() {

    var chainLaws = laws.Chain (equals);

    chainLaws.associativity (
      MaybeArb (jsc.array (jsc.asciistring)),
      jsc.constant (S.head),
      jsc.constant (S.parseInt (36))
    );

  });

  suite ('Monad laws', function() {

    var monadLaws = laws.Monad (equals, S.Maybe);

    monadLaws.leftIdentity (
      jsc.constant (S.head),
      jsc.array (jsc.number)
    );

    monadLaws.rightIdentity (
      MaybeArb (jsc.number)
    );

  });

  suite ('Alt laws', function() {

    var altLaws = laws.Alt (equals);

    altLaws.associativity (
      MaybeArb (jsc.number),
      MaybeArb (jsc.number),
      MaybeArb (jsc.number)
    );

    altLaws.distributivity (
      MaybeArb (jsc.number),
      MaybeArb (jsc.number),
      jsc.constant (Math.sqrt)
    );

  });

  suite ('Plus laws', function() {

    var plusLaws = laws.Plus (equals, S.Maybe);

    plusLaws.leftIdentity (
      MaybeArb (jsc.number)
    );

    plusLaws.rightIdentity (
      MaybeArb (jsc.number)
    );

    plusLaws.annihilation (
      jsc.constant (Math.sqrt)
    );

  });

  suite ('Alternative laws', function() {

    var alternativeLaws = laws.Alternative (equals, S.Maybe);

    alternativeLaws.distributivity (
      MaybeArb (jsc.number),
      MaybeArb (jsc.constant (Math.sqrt)),
      MaybeArb (jsc.constant (Math.abs))
    );

    alternativeLaws.annihilation (
      MaybeArb (jsc.number)
    );

  });

  suite ('Foldable laws', function() {

    var foldableLaws = laws.Foldable (equals);

    foldableLaws.associativity (
      jsc.constant (add_),
      jsc.number,
      MaybeArb (jsc.number)
    );

  });

  suite ('Traversable laws', function() {

    var traversableLaws = laws.Traversable (equals);

    traversableLaws.naturality (
      jsc.constant (S.eitherToMaybe),
      MaybeArb (EitherArb (jsc.string, jsc.number)),
      jsc.constant (S.Either),
      jsc.constant (S.Maybe)
    );

    traversableLaws.identity (
      MaybeArb (jsc.number),
      jsc.constant (Identity)
    );

    traversableLaws.composition (
      MaybeArb (IdentityArb (MaybeArb (jsc.number))),
      jsc.constant (Identity),
      jsc.constant (S.Maybe)
    );

  });

  suite ('Extend laws', function() {

    var extendLaws = laws.Extend (equals);

    extendLaws.associativity (
      MaybeArb (jsc.integer),
      jsc.constant (function(maybe) { return maybe.value + 1; }),
      jsc.constant (function(maybe) { return maybe.value * maybe.value; })
    );

  });

});
