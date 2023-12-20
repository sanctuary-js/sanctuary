'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('foldMap', () => {

  eq (String (S.foldMap), 'foldMap :: (Monoid b, Foldable f) => TypeRep b -> (a -> b) -> f a -> b');

  const repeat = n => (new Array (n + 1)).join (String (n));
  eq (S.foldMap (String) (repeat) ([]), '');
  eq (S.foldMap (String) (repeat) ([1]), '1');
  eq (S.foldMap (String) (repeat) ([1, 2]), '122');
  eq (S.foldMap (String) (repeat) ([1, 2, 3]), '122333');

});
