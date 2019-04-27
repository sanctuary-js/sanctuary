'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('gte', () => {

  eq (S.show (S.gte)) ('gte :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.gte (3)) ([1, 2, 3, 4, 5])) ([3, 4, 5]);

});
