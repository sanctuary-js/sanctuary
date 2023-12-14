import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import foldMap from 'sanctuary/foldMap';


test ('foldMap', () => {

  eq (S.foldMap === foldMap, true);
  eq (String (S.foldMap), 'foldMap :: (Monoid b, Foldable f) => TypeRep b -> (a -> b) -> f a -> b');

  const repeat = n => (new Array (n + 1)).join (String (n));
  eq (S.foldMap (String) (repeat) ([]), '');
  eq (S.foldMap (String) (repeat) ([1]), '1');
  eq (S.foldMap (String) (repeat) ([1, 2]), '122');
  eq (S.foldMap (String) (repeat) ([1, 2, 3]), '122333');

});
