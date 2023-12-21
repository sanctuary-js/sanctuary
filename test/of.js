import {deepStrictEqual as eq} from 'assert';

import Identity from 'sanctuary-identity';

import S from './internal/sanctuary.js';


test ('of', () => {

  eq (String (S.of), 'of :: Applicative f => TypeRep (f a) -> a -> f a');

  eq (S.of (Array) (42), [42]);
  eq (S.of (Function) (42) (null), 42);
  eq (S.of (S.Maybe) (42), S.Just (42));
  eq (S.of (S.Either) (42), S.Right (42));
  eq (S.of (Identity) (42), Identity (42));

});
