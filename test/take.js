import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import take from 'sanctuary/take';

import {Nil, Cons} from './internal/List.js';


test ('take', () => {

  eq (S.take === take, true);
  eq (String (S.take), 'take :: (Applicative f, Foldable f, Monoid f) => Integer -> f a -> Maybe (f a)');

  eq (S.take (0) ([1, 2, 3, 4, 5]), S.Just ([]));
  eq (S.take (1) ([1, 2, 3, 4, 5]), S.Just ([1]));
  eq (S.take (2) ([1, 2, 3, 4, 5]), S.Just ([1, 2]));
  eq (S.take (3) ([1, 2, 3, 4, 5]), S.Just ([1, 2, 3]));
  eq (S.take (4) ([1, 2, 3, 4, 5]), S.Just ([1, 2, 3, 4]));
  eq (S.take (5) ([1, 2, 3, 4, 5]), S.Just ([1, 2, 3, 4, 5]));
  eq (S.take (6) ([1, 2, 3, 4, 5]), S.Nothing);

  eq (S.take (-1) ([1, 2, 3, 4, 5]), S.Nothing);

  eq (S.take (0) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Nil));
  eq (S.take (1) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Cons (1) (Nil)));
  eq (S.take (2) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Cons (1) (Cons (2) (Nil))));
  eq (S.take (3) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Just (Cons (1) (Cons (2) (Cons (3) (Nil)))));
  eq (S.take (4) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Nothing);

  eq (S.take (-1) (Cons (1) (Cons (2) (Cons (3) (Nil)))), S.Nothing);

});
