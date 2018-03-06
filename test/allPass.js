'use strict';

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test ('allPass', function() {

  eq (typeof S.allPass) ('function');
  eq (S.allPass.length) (1);
  eq (String (S.allPass)) ('allPass :: Foldable f => f (a -> Boolean) -> a -> Boolean');

  eq (S.allPass ([]) ('abacus')) (true);
  eq (S.allPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('abacus')) (true);
  eq (S.allPass ([S.test (/a/), S.test (/b/), S.test (/c/)]) ('banana')) (false);

  eq (S.allPass (Nil) ('abacus')) (true);
  eq (S.allPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('abacus')) (true);
  eq (S.allPass (Cons (S.test (/a/)) (Cons (S.test (/b/)) (Cons (S.test (/c/)) (Nil)))) ('banana')) (false);

  var e = false;
  eq (S.allPass ([S.test (/a/), function() { e = true; }]) ('monkey')) (false);
  eq (e) (false);

});
