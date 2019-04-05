'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('takeWhile', () => {

  eq (typeof S.takeWhile) ('function');
  eq (S.takeWhile.length) (1);
  eq (S.show (S.takeWhile)) ('takeWhile :: (a -> Boolean) -> Array a -> Array a');

  eq (S.takeWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])) ([3, 3, 3, 7]);
  eq (S.takeWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])) ([]);
  eq (S.takeWhile (S.odd) ([])) ([]);

});
