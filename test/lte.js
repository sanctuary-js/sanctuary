'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('lte', function() {

  eq (typeof S.lte) ('function');
  eq (S.lte.length) (1);
  eq (String (S.lte)) ('lte :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lte (3)) ([1, 2, 3, 4, 5])) ([1, 2, 3]);

});
