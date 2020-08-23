'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('findMaybe', () => {

  eq (S.show (S.findMaybe)) ('findMaybe :: Foldable f => (a -> Maybe b) -> f a -> Maybe b');

  eq (S.findMaybe (S.parseInt (16)) ([])) (S.Nothing);
  eq (S.findMaybe (S.parseInt (16)) (['H', 'G'])) (S.Nothing);
  eq (S.findMaybe (S.parseInt (16)) (['H', 'G', 'F', 'E'])) (S.Just (15));
  eq (S.findMaybe (S.parseInt (16)) ({})) (S.Nothing);
  eq (S.findMaybe (S.parseInt (16)) ({a: 'H', b: 'G'})) (S.Nothing);
  eq (S.findMaybe (S.parseInt (16)) ({a: 'H', b: 'G', c: 'F', d: 'E'})) (S.Just (15));

});
