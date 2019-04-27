'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('when', () => {

  eq (S.show (S.when)) ('when :: (a -> Boolean) -> (a -> a) -> a -> a');

  eq (S.when (S.gte (0)) (Math.sqrt) (16)) (4);
  eq (S.when (S.gte (0)) (Math.sqrt) (-1)) (-1);

});
