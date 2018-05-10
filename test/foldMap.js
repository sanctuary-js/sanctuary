'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('foldMap', function() {

  eq (typeof S.foldMap) ('function');
  eq (S.foldMap.length) (1);
  eq (String (S.foldMap)) ('foldMap :: (Monoid b, Foldable f) => TypeRep b -> (a -> b) -> f a -> b');

  function repeat(n) { return (new Array (n + 1)).join (String (n)); }
  eq (S.foldMap (String) (repeat) ([])) ('');
  eq (S.foldMap (String) (repeat) ([1])) ('1');
  eq (S.foldMap (String) (repeat) ([1, 2])) ('122');
  eq (S.foldMap (String) (repeat) ([1, 2, 3])) ('122333');

});
