'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('gt', function() {

  eq (typeof S.gt) ('function');
  eq (S.gt.length) (1);
  eq (String (S.gt)) ('gt :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.gt (3)) ([1, 2, 3, 4, 5])) ([4, 5]);

});
