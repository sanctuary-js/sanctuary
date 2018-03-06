'use strict';

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test ('size', function() {

  eq (typeof S.size) ('function');
  eq (S.size.length) (1);
  eq (String (S.size)) ('size :: Foldable f => f a -> Integer');

  eq (S.size ([])) (0);
  eq (S.size (['foo'])) (1);
  eq (S.size (['foo', 'bar'])) (2);
  eq (S.size (['foo', 'bar', 'baz'])) (3);

  eq (S.size (Nil)) (0);
  eq (S.size (Cons ('foo') (Nil))) (1);
  eq (S.size (Cons ('foo') (Cons ('bar') (Nil)))) (2);
  eq (S.size (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))) (3);

  eq (S.size (S.Nothing)) (0);
  eq (S.size (S.Just (0))) (1);

});
