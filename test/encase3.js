'use strict';

const S = require ('..');

const area = require ('./internal/area');
const eq = require ('./internal/eq');


test ('encase3', () => {

  eq (typeof S.encase3) ('function');
  eq (S.encase3.length) (1);
  eq (S.show (S.encase3)) ('encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d');

  eq (S.encase3 (area) (3) (4) (5)) (S.Just (6));
  eq (S.encase3 (area) (2) (2) (5)) (S.Nothing);

});
