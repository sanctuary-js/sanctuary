'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('takeWhile', () => {

  eq (String (S.takeWhile), 'takeWhile :: (a -> Boolean) -> Array a -> Array a');

  eq (S.takeWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4]), [3, 3, 3, 7]);
  eq (S.takeWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4]), []);
  eq (S.takeWhile (S.odd) ([]), []);

});
