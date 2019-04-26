'use strict';

const S = require ('./internal/sanctuary');

const {Nil, Cons} = require ('./internal/List');
const eq = require ('./internal/eq');


test ('anyPass', () => {

  eq (S.show (S.anyPass)) ('anyPass :: Foldable f => f (a -> Boolean) -> a -> Boolean');

  eq (S.anyPass ([]) ('dolphin')) (false);
  eq (S.anyPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('dolphin')) (false);
  eq (S.anyPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('narwhal')) (true);

  eq (S.anyPass (Nil) ('dolphin')) (false);
  eq (S.anyPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('dolphin')) (false);
  eq (S.anyPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('narwhal')) (true);

  let e = false;
  eq (S.anyPass ([S.test (/a/), () => e = true]) ('narwhal')) (true);
  eq (e) (false);

});
