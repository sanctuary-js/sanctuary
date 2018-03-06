'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('ifElse', function() {

  eq (typeof S.ifElse) ('function');
  eq (S.ifElse.length) (1);
  eq (String (S.ifElse)) ('ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b');

  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (9)) (8);
  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (0)) (1);

});
