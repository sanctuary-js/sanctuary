'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('complement', function() {

  eq (typeof S.complement) ('function');
  eq (S.complement.length) (1);
  eq (String (S.complement)) ('complement :: (a -> Boolean) -> a -> Boolean');

  eq (S.complement (S.odd) (1)) (false);
  eq (S.complement (S.odd) (2)) (true);

});
