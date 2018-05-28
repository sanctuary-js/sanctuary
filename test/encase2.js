'use strict';

var S = require ('..');

var eq = require ('./internal/eq');
var rem = require ('./internal/rem');


test ('encase2', function() {

  eq (typeof S.encase2) ('function');
  eq (S.encase2.length) (1);
  eq (S.show (S.encase2)) ('encase2 :: (a -> b -> c) -> a -> b -> Maybe c');

  eq (S.encase2 (rem) (42) (5)) (S.Just (2));
  eq (S.encase2 (rem) (42) (0)) (S.Nothing);

});
