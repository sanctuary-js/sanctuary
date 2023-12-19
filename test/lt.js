'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('lt', () => {

  eq (String (S.lt)) ('lt :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lt (3)) ([1, 2, 3, 4, 5])) ([1, 2]);

});
