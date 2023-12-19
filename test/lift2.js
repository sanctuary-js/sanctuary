'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('lift2', () => {

  eq (String (S.lift2)) ('lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c');

  eq (S.lift2 (S.add) (S.Just (3)) (S.Just (3))) (S.Just (6));
  eq (S.lift2 (S.add) (S.Nothing) (S.Just (3))) (S.Nothing);

  eq (S.lift2 (S.add) (S.Right (3)) (S.Left (4))) (S.Left (4));
  eq (S.lift2 (S.add) (S.Right (3)) (S.Right (4))) (S.Right (7));

  eq (S.lift2 (S.add) ([1, 2]) ([10, 20])) ([11, 21, 12, 22]);
  eq (S.lift2 (S.add) ([]) ([1, 2])) ([]);

  eq (S.lift2 (S.and) (S.even) (S.gt (0)) (42)) (true);
  eq (S.lift2 (S.and) (S.even) (S.gt (0)) (43)) (false);
  eq (S.lift2 (S.and) (S.even) (S.gt (0)) (-42)) (false);
  eq (S.lift2 (S.and) (S.even) (S.gt (0)) (-43)) (false);

});
