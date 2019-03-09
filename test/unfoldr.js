'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('unfoldr', () => {

  eq (typeof S.unfoldr) ('function');
  eq (S.unfoldr.length) (1);
  eq (S.show (S.unfoldr)) ('unfoldr :: (b -> Maybe (Pair a b)) -> b -> Array a');

  const f = n => n >= 5 ? S.Nothing : S.Just (S.Pair (n) (n + 1));
  eq (S.unfoldr (f) (5)) ([]);
  eq (S.unfoldr (f) (4)) ([4]);
  eq (S.unfoldr (f) (1)) ([1, 2, 3, 4]);

});
