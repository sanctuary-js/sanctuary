'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('unless', function() {

  eq (typeof S.unless) ('function');
  eq (S.unless.length) (1);
  eq (S.show (S.unless)) ('unless :: (a -> Boolean) -> (a -> a) -> a -> a');

  eq (S.unless (S.lt (0)) (Math.sqrt) (16)) (4);
  eq (S.unless (S.lt (0)) (Math.sqrt) (-1)) (-1);

});
