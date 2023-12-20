'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('map', () => {

  eq (String (S.map), 'map :: Functor f => (a -> b) -> f a -> f b');

  eq (S.map (S.not) (S.odd) (2), true);
  eq (S.map (S.not) (S.odd) (3), false);

  eq (S.map (S.mult (4)) (S.Just (2)), S.Just (8));
  eq (S.map (S.mult (4)) (S.Nothing), S.Nothing);

  eq (S.map (S.mult (4)) (S.Left (3)), S.Left (3));
  eq (S.map (S.mult (4)) (S.Right (2)), S.Right (8));

  eq (S.map (S.mult (2)) ([1, 2, 3]), [2, 4, 6]);
  eq (S.map (S.mult (2)) ([]), []);

  eq (S.map (S.mult (2)) ({a: 1, b: 2, c: 3}), {a: 2, b: 4, c: 6});
  eq (S.map (S.mult (2)) ({}), {});

});
