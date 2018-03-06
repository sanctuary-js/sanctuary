'use strict';

var S = require ('..');

var eq = require ('./internal/eq');
var factorial = require ('./internal/factorial');


test ('encase', function() {

  eq (typeof S.encase) ('function');
  eq (S.encase.length) (1);
  eq (String (S.encase)) ('encase :: (a -> b) -> a -> Maybe b');

  eq (S.encase (factorial) (5)) (S.Just (120));
  eq (S.encase (factorial) (-1)) (S.Nothing);

});
