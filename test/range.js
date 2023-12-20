'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('range', () => {

  eq (String (S.range), 'range :: Integer -> Integer -> Array Integer');

  eq (S.range (0) (0), []);
  eq (S.range (0) (10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  eq (S.range (0) (-10), []);
  eq (S.range (-2) (-1), [-2]);
  eq (S.range (-2) (3), [-2, -1, 0, 1, 2]);

});
