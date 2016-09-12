'use strict';

var S = require('./internal/sanctuary');

var Identity = require('./internal/Identity');
var eq = require('./internal/eq');


test('of', function() {

  eq(typeof S.of, 'function');
  eq(S.of.length, 2);
  eq(S.of.toString(), 'of :: Applicative f => TypeRep f -> a -> f a');

  eq(S.of(Array, 42), [42]);
  eq(S.of(Function, 42)(null), 42);
  eq(S.of(S.Maybe, 42), S.Just(42));
  eq(S.of(S.Either, 42), S.Right(42));
  eq(S.of(Identity, 42), Identity(42));

});
