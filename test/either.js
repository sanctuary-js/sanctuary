'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('either', () => {

  eq (String (S.either)) ('either :: (a -> c) -> (b -> c) -> Either a b -> c');

  eq (S.either (S.prop ('length')) (Math.sqrt) (S.Left ('abc'))) (3);
  eq (S.either (S.prop ('length')) (Math.sqrt) (S.Right (256))) (16);

});
