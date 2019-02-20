'use strict';

var jsc = require ('jsverify');

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');
var equals = require ('./internal/equals');


var Cons = List.Cons;
var Nil = List.Nil;


test ('none', function() {

  eq (typeof S.none) ('function');
  eq (S.none.length) (1);
  eq (S.show (S.none)) ('none :: Foldable f => (a -> Boolean) -> f a -> Boolean');

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

  jsc.assert (jsc.forall (jsc.array (jsc.integer), function(xs) {
    var p = S.odd;
    var lhs = S.none (p) (xs);
    var rhs = S.not (S.any (p) (xs));
    return equals (lhs) (rhs);
  }), {tests: 1000});

  jsc.assert (jsc.forall (jsc.array (jsc.integer), function(xs) {
    var p = S.odd;
    var lhs = S.none (p) (xs);
    var rhs = S.all (S.complement (p)) (xs);
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
