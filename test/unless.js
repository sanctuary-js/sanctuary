'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('unless', () => {

  eq (S.show (S.unless)) ('unless :: (a -> Boolean) -> (a -> a) -> a -> a');

  eq (S.unless (S.lt (0)) (Math.sqrt) (16)) (4);
  eq (S.unless (S.lt (0)) (Math.sqrt) (-1)) (-1);

});
