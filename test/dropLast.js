import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('dropLast', () => {

  eq (String (S.dropLast), 'dropLast :: (Applicative f, Foldable f, Monoid f) => Integer -> f a -> Maybe (f a)');

  eq (S.dropLast (0) ([1, 2, 3, 4, 5]), S.Just ([1, 2, 3, 4, 5]));
  eq (S.dropLast (1) ([1, 2, 3, 4, 5]), S.Just ([1, 2, 3, 4]));
  eq (S.dropLast (2) ([1, 2, 3, 4, 5]), S.Just ([1, 2, 3]));
  eq (S.dropLast (3) ([1, 2, 3, 4, 5]), S.Just ([1, 2]));
  eq (S.dropLast (4) ([1, 2, 3, 4, 5]), S.Just ([1]));
  eq (S.dropLast (5) ([1, 2, 3, 4, 5]), S.Just ([]));
  eq (S.dropLast (6) ([1, 2, 3, 4, 5]), S.Nothing);

  eq (S.dropLast (-1) ([1, 2, 3, 4, 5]), S.Nothing);

  eq (S.dropLast (0) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Cons (1) (Cons (2) (Cons (3) (Nil)))));
  eq (S.dropLast (1) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Cons (1) (Cons (2) (Nil))));
  eq (S.dropLast (2) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Cons (1) (Nil)));
  eq (S.dropLast (3) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Nil));
  eq (S.dropLast (4) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Nothing);

  eq (S.dropLast (-1) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Nothing);

});
