'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('odd', function() {

  eq (typeof S.odd) ('function');
  eq (S.odd.length) (1);
  eq (String (S.odd)) ('odd :: Integer -> Boolean');

  eq (S.odd (1)) (true);
  eq (S.odd (-1)) (true);

  eq (S.odd (0)) (false);
  eq (S.odd (2)) (false);
  eq (S.odd (-2)) (false);

});
