'use strict';

var S = require ('..');

var concat = require ('./internal/concat');
var eq = require ('./internal/eq');
var pair = require ('./internal/pair');


test ('zipWith', function() {

  eq (typeof S.zipWith) ('function');
  eq (S.zipWith.length) (1);
  eq (S.show (S.zipWith)) ('zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c');

  eq (S.zipWith (concat) (['a', 'b']) (['x', 'y', 'z'])) (['ax', 'by']);
  eq (S.zipWith (pair) ([1, 3, 5]) ([2, 4])) ([[1, 2], [3, 4]]);

});
