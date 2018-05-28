'use strict';

var S = require ('..');

var area = require ('./internal/area');
var eq = require ('./internal/eq');


test ('encaseEither3', function() {

  eq (typeof S.encaseEither3) ('function');
  eq (S.encaseEither3.length) (1);
  eq (S.show (S.encaseEither3)) ('encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r');

  eq (S.encaseEither3 (S.I) (area) (3) (4) (5)) (S.Right (6));
  eq (S.encaseEither3 (S.I) (area) (2) (2) (5)) (S.Left (new Error ('Impossible triangle')));
  eq (S.encaseEither3 (S.prop ('message')) (area) (2) (2) (5)) (S.Left ('Impossible triangle'));

});
