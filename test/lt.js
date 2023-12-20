'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('lt', () => {

  eq (String (S.lt), 'lt :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lt (3)) ([1, 2, 3, 4, 5]), [1, 2]);

});
