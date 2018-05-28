'use strict';

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test ('anyPass', function() {

  eq (typeof S.anyPass) ('function');
  eq (S.anyPass.length) (1);
  eq (S.show (S.anyPass)) ('anyPass :: Foldable f => f (a -> Boolean) -> a -> Boolean');

  eq (S.anyPass ([]) ('dolphin')) (false);
  eq (S.anyPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('dolphin')) (false);
  eq (S.anyPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('narwhal')) (true);

  eq (S.anyPass (Nil) ('dolphin')) (false);
  eq (S.anyPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('dolphin')) (false);
  eq (S.anyPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('narwhal')) (true);

  var e = false;
  eq (S.anyPass ([S.test (/a/), function() { e = true; }]) ('narwhal')) (true);
  eq (e) (false);

});
