'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('take', function() {

  eq (typeof S.take) ('function');
  eq (S.take.length) (1);
  eq (S.show (S.take)) ('take :: Integer -> Array a -> Maybe (Array a)');

  eq (S.take (0) ([1, 2, 3, 4, 5])) (S.Just ([]));
  eq (S.take (1) ([1, 2, 3, 4, 5])) (S.Just ([1]));
  eq (S.take (2) ([1, 2, 3, 4, 5])) (S.Just ([1, 2]));
  eq (S.take (3) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3]));
  eq (S.take (4) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4]));
  eq (S.take (5) ([1, 2, 3, 4, 5])) (S.Just ([1, 2, 3, 4, 5]));
  eq (S.take (6) ([1, 2, 3, 4, 5])) (S.Nothing);

  eq (S.take (-1) ([1, 2, 3, 4, 5])) (S.Nothing);

});
