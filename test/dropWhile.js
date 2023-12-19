'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('dropWhile', () => {

  eq (String (S.dropWhile)) ('dropWhile :: (a -> Boolean) -> Array a -> Array a');

  eq (S.dropWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])) ([6, 3, 5, 4]);
  eq (S.dropWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])) ([3, 3, 3, 7, 6, 3, 5, 4]);
  eq (S.dropWhile (S.odd) ([])) ([]);

});
