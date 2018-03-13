const S = require('../test/internal/sanctuary');

import Identity from './internal/Identity';
import eq from './internal/eq';


test('of', () => {

  eq(typeof S.of, 'function');
  eq(S.of.length, 2);
  eq(S.of.toString(), 'of :: Applicative f => TypeRep f -> a -> f a');

  const of = Identity['fantasy-land/of'];

  eq(S.of(Array)(42), [42]);
  eq(S.of(Function)(42)(null), 42);
  eq(S.of(S.Maybe)(42), S.Just(42));
  eq(S.of(S.Either)(42), S.Right(42));
  eq(S.of(Identity)(42), of(42));

});
