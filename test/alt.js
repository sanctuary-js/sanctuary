'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('alt', () => {

  eq (typeof S.alt) ('function');
  eq (S.alt.length) (1);
  eq (S.show (S.alt)) ('alt :: Alt f => f a -> f a -> f a');

  eq (S.alt ([]) ([])) ([]);
  eq (S.alt ([1, 2, 3]) ([])) ([1, 2, 3]);
  eq (S.alt ([]) ([1, 2, 3])) ([1, 2, 3]);
  eq (S.alt ([4, 5, 6]) ([1, 2, 3])) ([1, 2, 3, 4, 5, 6]);
  eq (S.alt ({}) ({})) ({});
  eq (S.alt ({a: 1, b: 2, c: 3}) ({})) ({a: 1, b: 2, c: 3});
  eq (S.alt ({}) ({a: 1, b: 2, c: 3})) ({a: 1, b: 2, c: 3});
  eq (S.alt ({d: 4, e: 5, f: 6}) ({a: 1, b: 2, c: 3})) ({a: 1, b: 2, c: 3, d: 4, e: 5, f: 6});
  eq (S.alt ({c: 4, d: 5, e: 6}) ({a: 1, b: 2, c: 3})) ({a: 1, b: 2, c: 4, d: 5, e: 6});
  eq (S.alt (S.Nothing) (S.Nothing)) (S.Nothing);
  eq (S.alt (S.Just (1)) (S.Nothing)) (S.Just (1));
  eq (S.alt (S.Nothing) (S.Just (2))) (S.Just (2));
  eq (S.alt (S.Just (4)) (S.Just (3))) (S.Just (3));

});
