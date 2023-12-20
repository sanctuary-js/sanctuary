'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');


test ('any', () => {

  eq (String (S.any), 'any :: Foldable f => (a -> Boolean) -> f a -> Boolean');

  eq (S.any (S.gt (0)) ([]), false);
  eq (S.any (S.gt (0)) ([0]), false);
  eq (S.any (S.gt (0)) ([1]), true);
  eq (S.any (S.gt (0)) ([0, 0]), false);
  eq (S.any (S.gt (0)) ([0, 1]), true);
  eq (S.any (S.gt (0)) ([1, 0]), true);
  eq (S.any (S.gt (0)) ([1, 1]), true);

  eq (S.any (S.gt (0)) (Nil), false);
  eq (S.any (S.gt (0)) (Cons (0) (Nil)), false);
  eq (S.any (S.gt (0)) (Cons (1) (Nil)), true);
  eq (S.any (S.gt (0)) (Cons (0) (Cons (0) (Nil))), false);
  eq (S.any (S.gt (0)) (Cons (0) (Cons (1) (Nil))), true);
  eq (S.any (S.gt (0)) (Cons (1) (Cons (0) (Nil))), true);
  eq (S.any (S.gt (0)) (Cons (1) (Cons (1) (Nil))), true);

  eq (S.any (S.gt (0)) (S.Nothing), false);
  eq (S.any (S.gt (0)) (S.Just (0)), false);
  eq (S.any (S.gt (0)) (S.Just (1)), true);

});
