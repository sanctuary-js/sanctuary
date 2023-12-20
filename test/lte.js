'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('lte', () => {

  eq (String (S.lte), 'lte :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lte (3)) ([1, 2, 3, 4, 5]), [1, 2, 3]);

});
