import {deepStrictEqual as eq} from 'node:assert';

import S from './internal/sanctuary.js';

import {Nil, Cons} from './internal/List.mjs';


test ('all', () => {

  eq (String (S.all), 'all :: Foldable f => (a -> Boolean) -> f a -> Boolean');

  eq (S.all (S.gt (0)) ([]), true);
  eq (S.all (S.gt (0)) ([0]), false);
  eq (S.all (S.gt (0)) ([1]), true);
  eq (S.all (S.gt (0)) ([0, 0]), false);
  eq (S.all (S.gt (0)) ([0, 1]), false);
  eq (S.all (S.gt (0)) ([1, 0]), false);
  eq (S.all (S.gt (0)) ([1, 1]), true);

  eq (S.all (S.gt (0)) (Nil), true);
  eq (S.all (S.gt (0)) (Cons (0) (Nil)), false);
  eq (S.all (S.gt (0)) (Cons (1) (Nil)), true);
  eq (S.all (S.gt (0)) (Cons (0) (Cons (0) (Nil))), false);
  eq (S.all (S.gt (0)) (Cons (0) (Cons (1) (Nil))), false);
  eq (S.all (S.gt (0)) (Cons (1) (Cons (0) (Nil))), false);
  eq (S.all (S.gt (0)) (Cons (1) (Cons (1) (Nil))), true);

  eq (S.all (S.gt (0)) (S.Nothing), true);
  eq (S.all (S.gt (0)) (S.Just (0)), false);
  eq (S.all (S.gt (0)) (S.Just (1)), true);

});
