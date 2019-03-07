'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('takeLast', () => {

  eq (typeof S.takeLast) ('function');
  eq (S.takeLast.length) (1);
  eq (S.show (S.takeLast)) ('takeLast :: Integer -> Array a -> Maybe (Array a)');

  eq (S.takeLast (0) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.takeLast (1) ([1, 2, 3, 4, 5])) (S.Just ([5]));
  eq (S.takeLast (2) ([1, 2, 3, 4, 5])) (S.Just ([4, 5]));
  eq (S.takeLast (3) ([1, 2, 3, 4, 5])) (S.Just ([3, 4, 5]));
  eq (S.takeLast (4) ([1, 2, 3, 4, 5])) (S.Just ([2, 3, 4, 5]));
  eq (S.takeLast (5) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4, 5]));
  eq (S.takeLast (6) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.takeLast (-1) ([1, 2, 3, 4, 5])) (S.Nothing);

});
