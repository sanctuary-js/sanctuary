'use strict';

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('allPass', () => {

  eq (S.show (S.allPass)) ('allPass :: Foldable f => f (a -> Boolean) -> a -> Boolean');

  eq (S.allPass ([]) ('abacus')) (true);
  eq (S.allPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('abacus')) (true);
  eq (S.allPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('banana')) (false);

  eq (S.allPass (Nil) ('abacus')) (true);
  eq (S.allPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('abacus')) (true);
  eq (S.allPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('banana')) (false);

  let e = false;
  eq (S.allPass ([S.test (/a/), () => e = true]) ('monkey')) (false);
  eq (e) (false);

});
