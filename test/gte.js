'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('gte', () => {

  eq (String (S.gte), 'gte :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.gte (3)) ([1, 2, 3, 4, 5]), [3, 4, 5]);

});
