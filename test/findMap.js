'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('findMap', () => {

  eq (S.show (S.findMap)) ('findMap :: Foldable f => (a -> Maybe b) -> f a -> Maybe b');

  eq (S.findMap (S.parseInt (16)) ([])) (S.Nothing);
  eq (S.findMap (S.parseInt (16)) (['H', 'G'])) (S.Nothing);
  eq (S.findMap (S.parseInt (16)) (['H', 'G', 'F', 'E'])) (S.Just (15));
  eq (S.findMap (S.parseInt (16)) ({})) (S.Nothing);
  eq (S.findMap (S.parseInt (16)) ({a: 'H', b: 'G'})) (S.Nothing);
  eq (S.findMap (S.parseInt (16)) ({a: 'H', b: 'G', c: 'F', d: 'E'})) (S.Just (15));

});
