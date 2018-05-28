'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('slice', function() {

  eq (typeof S.slice) ('function');
  eq (S.slice.length) (1);
  eq (S.show (S.slice)) ('slice :: Integer -> Integer -> Array a -> Maybe (Array a)');

  eq (S.slice (6) (1) ([1, 2, 3, 4, 5])) (S.Nothing);
  eq (S.slice (1) (6) ([1, 2, 3, 4, 5])) (S.Nothing);
  eq (S.slice (1) (-6) ([1, 2, 3, 4, 5])) (S.Nothing);
  eq (S.slice (-6) (1) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.slice (1) (1) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.slice (1) (-4) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.slice (-4) (1) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.slice (-4) (-4) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.slice (0) (0) ([])) (S.Just ([]));

  eq (S.slice (1) (3) ([1, 2, 3, 4, 5])) (S.Just ([2, 3]));
  eq (S.slice (-3) (5) ([1, 2, 3, 4, 5])) (S.Just ([3, 4, 5]));
  eq (S.slice (1) (-2) ([1, 2, 3, 4, 5])) (S.Just ([2, 3]));

  eq (S.slice (0) (5) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4, 5]));

});
