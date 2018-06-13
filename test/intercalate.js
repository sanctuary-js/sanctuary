'use strict';

var S = require ('./internal/sanctuary');

var List = require ('./internal/List');
var eq = require ('./internal/eq');


var Cons = List.Cons;
var Nil = List.Nil;


test ('intercalate', function() {

  eq (typeof S.intercalate) ('function');
  eq (S.intercalate.length) (1);
  eq (S.show (S.intercalate)) ('intercalate :: (Monoid a, Foldable f) => TypeRep a -> a -> f a -> a');

  eq (S.intercalate (String) (', ') ([])) ('');
  eq (S.intercalate (String) (', ') (['foo'])) ('foo');
  eq (S.intercalate (String) (', ') (['foo', 'bar'])) ('foo, bar');
  eq (S.intercalate (String) (', ') (['foo', 'bar', 'baz'])) ('foo, bar, baz');

  eq (S.intercalate (Array) ([0]) ([])) ([]);
  eq (S.intercalate (Array) ([0]) ([[1]])) ([1]);
  eq (S.intercalate (Array) ([0]) ([[1], [2]])) ([1, 0, 2]);
  eq (S.intercalate (Array) ([0]) ([[1], [2], [3]])) ([1, 0, 2, 0, 3]);

  eq (S.intercalate (String) (', ') (Nil)) ('');
  eq (S.intercalate (String) (', ') (Cons ('foo') (Nil))) ('foo');
  eq (S.intercalate (String) (', ') (Cons ('foo') (Cons ('bar') (Nil)))) ('foo, bar');
  eq (S.intercalate (String) (', ') (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))) ('foo, bar, baz');

});
