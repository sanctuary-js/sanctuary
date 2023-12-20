'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('even', () => {

  eq (String (S.even), 'even :: Integer -> Boolean');

  eq (S.even (0), true);
  eq (S.even (2), true);
  eq (S.even (-2), true);

  eq (S.even (1), false);
  eq (S.even (-1), false);

});
