'use strict';

var laws = require ('fantasy-laws');
var jsc = require ('jsverify');
var Z = require ('sanctuary-type-classes');

var S = require ('../internal/sanctuary');

var EitherArb = require ('../internal/EitherArb');
var Identity = require ('../internal/Identity');
var IdentityArb = require ('../internal/IdentityArb');
var MaybeArb = require ('../internal/MaybeArb');
var add_ = require ('../internal/add_');
var testLaws = require ('../internal/testLaws');


suite ('Maybe', function() {

  suite ('Setoid laws', function() {
    testLaws (laws.Setoid) ({
      reflexivity: [
        MaybeArb (jsc.falsy)
      ],
      symmetry: [
        MaybeArb (jsc.bool),
        MaybeArb (jsc.bool)
      ],
      transitivity: [
        MaybeArb (jsc.bool),
        MaybeArb (jsc.bool),
        MaybeArb (jsc.bool)
      ]
    });
  });

  suite ('Semigroup laws', function() {
    testLaws (laws.Semigroup (Z.equals)) ({
      associativity: [
        MaybeArb (jsc.string),
        MaybeArb (jsc.string),
        MaybeArb (jsc.string)
      ]
    });
  });

  suite ('Monoid laws', function() {
    testLaws (laws.Monoid (Z.equals, S.Maybe)) ({
      leftIdentity: [
        MaybeArb (jsc.string)
      ],
      rightIdentity: [
        MaybeArb (jsc.string)
      ]
    });
  });

  suite ('Functor laws', function() {
    testLaws (laws.Functor (Z.equals)) ({
      identity: [
        MaybeArb (jsc.number)
      ],
      composition: [
        MaybeArb (jsc.number),
        jsc.constant (Math.sqrt),
        jsc.constant (Math.abs)
      ]
    });
  });

  suite ('Apply laws', function() {
    testLaws (laws.Apply (Z.equals)) ({
      composition: [
        MaybeArb (jsc.constant (Math.sqrt)),
        MaybeArb (jsc.constant (Math.abs)),
        MaybeArb (jsc.number)
      ]
    });
  });

  suite ('Applicative laws', function() {
    testLaws (laws.Applicative (Z.equals, S.Maybe)) ({
      identity: [
        MaybeArb (jsc.number)
      ],
      homomorphism: [
        jsc.constant (Math.abs),
        jsc.number
      ],
      interchange: [
        MaybeArb (jsc.constant (Math.abs)),
        jsc.number
      ]
    });
  });

  suite ('Chain laws', function() {
    testLaws (laws.Chain (Z.equals)) ({
      associativity: [
        MaybeArb (jsc.array (jsc.asciistring)),
        jsc.constant (S.head),
        jsc.constant (S.parseInt (36))
      ]
    });
  });

  suite ('Monad laws', function() {
    testLaws (laws.Monad (Z.equals, S.Maybe)) ({
      leftIdentity: [
        jsc.constant (S.head),
        jsc.array (jsc.number)
      ],
      rightIdentity: [
        MaybeArb (jsc.number)
      ]
    });
  });

  suite ('Alt laws', function() {
    testLaws (laws.Alt (Z.equals)) ({
      associativity: [
        MaybeArb (jsc.number),
        MaybeArb (jsc.number),
        MaybeArb (jsc.number)
      ],
      distributivity: [
        MaybeArb (jsc.number),
        MaybeArb (jsc.number),
        jsc.constant (Math.sqrt)
      ]
    });
  });

  suite ('Plus laws', function() {
    testLaws (laws.Plus (Z.equals, S.Maybe)) ({
      leftIdentity: [
        MaybeArb (jsc.number)
      ],
      rightIdentity: [
        MaybeArb (jsc.number)
      ],
      annihilation: [
        jsc.constant (Math.sqrt)
      ]
    });
  });

  suite ('Alternative laws', function() {
    testLaws (laws.Alternative (Z.equals, S.Maybe)) ({
      distributivity: [
        MaybeArb (jsc.number),
        MaybeArb (jsc.constant (Math.sqrt)),
        MaybeArb (jsc.constant (Math.abs))
      ],
      annihilation: [
        MaybeArb (jsc.number)
      ]
    });
  });

  suite ('Foldable laws', function() {
    testLaws (laws.Foldable (Z.equals)) ({
      associativity: [
        jsc.constant (add_),
        jsc.number,
        MaybeArb (jsc.number)
      ]
    });
  });

  suite ('Traversable laws', function() {
    testLaws (laws.Traversable (Z.equals)) ({
      naturality: [
        jsc.constant (S.Either),
        jsc.constant (S.Maybe),
        jsc.constant (S.eitherToMaybe),
        MaybeArb (EitherArb (jsc.string, jsc.number))
      ],
      identity: [
        jsc.constant (Identity),
        MaybeArb (jsc.number)
      ],
      composition: [
        jsc.constant (Identity),
        jsc.constant (S.Maybe),
        MaybeArb (IdentityArb (MaybeArb (jsc.number)))
      ]
    });
  });

  suite ('Extend laws', function() {
    testLaws (laws.Extend (Z.equals)) ({
      associativity: [
        MaybeArb (jsc.integer),
        jsc.constant (function(maybe) { return maybe.value + 1; }),
        jsc.constant (function(maybe) { return maybe.value * maybe.value; })
      ]
    });
  });

});
