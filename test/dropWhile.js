'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('dropWhile', function() {

  eq (typeof S.dropWhile) ('function');
  eq (S.dropWhile.length) (1);
  eq (S.show (S.dropWhile)) ('dropWhile :: Filterable f => (a -> Boolean) -> f a -> f a');

  eq (S.dropWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])) ([6, 3, 5, 4]);
  eq (S.dropWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])) ([3, 3, 3, 7, 6, 3, 5, 4]);
  eq (S.dropWhile (S.odd) ([])) ([]);

  eq (S.dropWhile (S.odd) (S.Just (1))) (S.Nothing);
  eq (S.dropWhile (S.even) (S.Just (1))) (S.Just (1));
  eq (S.dropWhile (S.odd) (S.Nothing)) (S.Nothing);

});
