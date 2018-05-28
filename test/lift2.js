'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('lift2', function() {

  eq (typeof S.lift2) ('function');
  eq (S.lift2.length) (1);
  eq (S.show (S.lift2)) ('lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c');

  //  positive :: Number -> Boolean
  function positive(n) { return n > 0; }

  eq (S.lift2 (S.add) (S.Just (3)) (S.Just (3))) (S.Just (6));
  eq (S.lift2 (S.add) (S.Nothing) (S.Just (3))) (S.Nothing);

  eq (S.lift2 (S.add) (S.Right (3)) (S.Left (4))) (S.Left (4));
  eq (S.lift2 (S.add) (S.Right (3)) (S.Right (4))) (S.Right (7));

  eq (S.lift2 (S.add) ([1, 2]) ([10, 20])) ([11, 21, 12, 22]);
  eq (S.lift2 (S.add) ([]) ([1, 2])) ([]);

  eq (S.lift2 (S.and) (S.even) (positive) (42)) (true);
  eq (S.lift2 (S.and) (S.even) (positive) (43)) (false);
  eq (S.lift2 (S.and) (S.even) (positive) (-42)) (false);
  eq (S.lift2 (S.and) (S.even) (positive) (-43)) (false);

});
