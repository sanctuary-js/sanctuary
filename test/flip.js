'use strict';

var S = require ('..');

var eq = require ('./internal/eq');
var map = require ('./internal/map');


test ('flip', function() {

  eq (typeof S.flip) ('function');
  eq (S.flip.length) (1);
  eq (String (S.flip)) ('flip :: (a -> b -> c) -> b -> a -> c');

  eq (S.flip (S.concat) ('foo') ('bar')) ('barfoo');
  eq (map (S.flip (S.concat) ('!')) (['BAM', 'POW', 'KA-POW'])) (['BAM!', 'POW!', 'KA-POW!']);

});
