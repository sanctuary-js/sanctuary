'use strict';

var laws = require ('fantasy-laws');
var jsc = require ('jsverify');
var Identity = require ('sanctuary-identity');
var Z = require ('sanctuary-type-classes');

var S = require ('../internal/sanctuary');

var EitherArb = require ('../internal/EitherArb');
var IdentityArb = require ('../internal/IdentityArb');
var add_ = require ('../internal/add_');
var squareRoot = require ('../internal/squareRoot');
var testLaws = require ('../internal/testLaws');


suite ('Either', function() {

  suite ('Setoid laws', function() {
    testLaws (laws.Setoid) ({
      reflexivity: [
        EitherArb (jsc.string, jsc.falsy)
      ],
      symmetry: [
        EitherArb (jsc.bool, jsc.bool),
        EitherArb (jsc.bool, jsc.bool)
      ],
      transitivity: [
        EitherArb (jsc.bool, jsc.bool),
        EitherArb (jsc.bool, jsc.bool),
        EitherArb (jsc.bool, jsc.bool)
      ]
    });
  });

  suite ('Semigroup laws', function() {
    testLaws (laws.Semigroup (Z.equals)) ({
      associativity: [
        EitherArb (jsc.string, jsc.string),
        EitherArb (jsc.string, jsc.string),
        EitherArb (jsc.string, jsc.string)
      ]
    });
  });

  suite ('Functor laws', function() {
    testLaws (laws.Functor (Z.equals)) ({
      identity: [
        EitherArb (jsc.string, jsc.number)
      ],
      composition: [
        EitherArb (jsc.string, jsc.number),
        jsc.constant (Math.sqrt),
        jsc.constant (Math.abs)
      ]
    });
  });

  suite ('Bifunctor laws', function() {
    testLaws (laws.Bifunctor (Z.equals)) ({
      identity: [
        EitherArb (jsc.string, jsc.number)
      ],
      composition: [
        EitherArb (jsc.string, jsc.number),
        jsc.constant (Math.sqrt),
        jsc.constant (function(s) { return s.length; }),
        jsc.constant (Math.sqrt),
        jsc.constant (Math.abs)
      ]
    });
  });

  suite ('Apply laws', function() {
    testLaws (laws.Apply (Z.equals)) ({
      composition: [
        EitherArb (jsc.string, jsc.constant (Math.sqrt)),
        EitherArb (jsc.string, jsc.constant (Math.abs)),
        EitherArb (jsc.string, jsc.number)
      ]
    });
  });

  suite ('Applicative laws', function() {
    testLaws (laws.Applicative (Z.equals, S.Either)) ({
      identity: [
        EitherArb (jsc.string, jsc.number)
      ],
      homomorphism: [
        jsc.constant (Math.abs),
        jsc.number
      ],
      interchange: [
        EitherArb (jsc.string, jsc.constant (Math.abs)),
        jsc.number
      ]
    });
  });

  suite ('Chain laws', function() {
    testLaws (laws.Chain (Z.equals)) ({
      associativity: [
        EitherArb (jsc.string, jsc.array (jsc.number)),
        jsc.constant (function(xs) { return xs.length > 0 ? S.Right (xs[0]) : S.Left ('Empty list'); }),
        jsc.constant (squareRoot)
      ]
    });
  });

  suite ('Monad laws', function() {
    testLaws (laws.Monad (Z.equals, S.Either)) ({
      leftIdentity: [
        jsc.constant (squareRoot),
        jsc.number
      ],
      rightIdentity: [
        EitherArb (jsc.string, jsc.number)
      ]
    });
  });

  suite ('Alt laws', function() {
    testLaws (laws.Alt (Z.equals)) ({
      associativity: [
        EitherArb (jsc.string, jsc.number),
        EitherArb (jsc.string, jsc.number),
        EitherArb (jsc.string, jsc.number)
      ],
      distributivity: [
        EitherArb (jsc.string, jsc.number),
        EitherArb (jsc.string, jsc.number),
        jsc.constant (Math.sqrt)
      ]
    });
  });

  suite ('Foldable laws', function() {
    testLaws (laws.Foldable (Z.equals)) ({
      associativity: [
        jsc.constant (add_),
        jsc.number,
        EitherArb (jsc.string, jsc.number)
      ]
    });
  });

  suite ('Traversable laws', function() {
    testLaws (laws.Traversable (Z.equals)) ({
      naturality: [
        jsc.constant (Identity),
        jsc.constant (S.Maybe),
        jsc.constant (S.compose (S.Just) (S.prop ('value'))),
        EitherArb (jsc.string, IdentityArb (jsc.number))
      ],
      identity: [
        jsc.constant (Identity),
        EitherArb (jsc.string, jsc.number)
      ],
      composition: [
        jsc.constant (Identity),
        jsc.constant (S.Either),
        EitherArb (jsc.string, IdentityArb (EitherArb (jsc.string, jsc.number)))
      ]
    });
  });

  suite ('Extend laws', function() {
    testLaws (laws.Extend (Z.equals)) ({
      associativity: [
        EitherArb (jsc.string, jsc.integer),
        jsc.constant (function(either) { return either.value + 1; }),
        jsc.constant (function(either) { return either.value * either.value; })
      ]
    });
  });

});
