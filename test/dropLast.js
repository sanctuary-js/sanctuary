'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('dropLast', function() {

  eq (typeof S.dropLast) ('function');
  eq (S.dropLast.length) (1);
  eq (S.show (S.dropLast)) ('dropLast :: Integer -> Array a -> Maybe (Array a)');

  eq (S.dropLast (0) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4, 5]));
  eq (S.dropLast (1) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4]));
  eq (S.dropLast (2) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3]));
  eq (S.dropLast (3) ([1, 2, 3, 4, 5])) (S.Just ([1, 2]));
  eq (S.dropLast (4) ([1, 2, 3, 4, 5])) (S.Just ([1]));
  eq (S.dropLast (5) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.dropLast (6) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.dropLast (-1) ([1, 2, 3, 4, 5])) (S.Nothing);

});
