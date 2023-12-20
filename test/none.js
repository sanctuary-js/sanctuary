'use strict';

const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('none', () => {

  eq (String (S.none)) ('none :: Foldable f => (a -> Boolean) -> f a -> Boolean');

  eq (S.none (S.gt (0)) ([])) (true);
  eq (S.none (S.gt (0)) ([0])) (true);
  eq (S.none (S.gt (0)) ([1])) (false);
  eq (S.none (S.gt (0)) ([0, 0])) (true);
  eq (S.none (S.gt (0)) ([0, 1])) (false);
  eq (S.none (S.gt (0)) ([1, 0])) (false);
  eq (S.none (S.gt (0)) ([1, 1])) (false);

  eq (S.none (S.gt (0)) (Nil)) (true);
  eq (S.none (S.gt (0)) (Cons (0) (Nil))) (true);
  eq (S.none (S.gt (0)) (Cons (1) (Nil))) (false);
  eq (S.none (S.gt (0)) (Cons (0) (Cons (0) (Nil)))) (true);
  eq (S.none (S.gt (0)) (Cons (0) (Cons (1) (Nil)))) (false);
  eq (S.none (S.gt (0)) (Cons (1) (Cons (0) (Nil)))) (false);
  eq (S.none (S.gt (0)) (Cons (1) (Cons (1) (Nil)))) (false);

  eq (S.none (S.gt (0)) (S.Nothing)) (true);
  eq (S.none (S.gt (0)) (S.Just (0))) (true);
  eq (S.none (S.gt (0)) (S.Just (1))) (false);

  jsc.assert (jsc.forall (jsc.array (jsc.integer), xs => {
    const p = S.odd;
    const lhs = S.none (p) (xs);
    const rhs = S.not (S.any (p) (xs));
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

  jsc.assert (jsc.forall (jsc.array (jsc.integer), xs => {
    const p = S.odd;
    const lhs = S.none (p) (xs);
    const rhs = S.all (S.complement (p)) (xs);
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
