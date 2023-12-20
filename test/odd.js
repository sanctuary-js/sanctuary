'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('odd', () => {

  eq (String (S.odd), 'odd :: Integer -> Boolean');

  eq (S.odd (1), true);
  eq (S.odd (-1), true);

  eq (S.odd (0), false);
  eq (S.odd (2), false);
  eq (S.odd (-2), false);

});
