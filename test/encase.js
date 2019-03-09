'use strict';

const S = require ('..');

const eq = require ('./internal/eq');
const factorial = require ('./internal/factorial');


test ('encase', () => {

  eq (typeof S.encase) ('function');
  eq (S.encase.length) (1);
  eq (S.show (S.encase)) ('encase :: (a -> b) -> a -> Maybe b');

  eq (S.encase (factorial) (5)) (S.Just (120));
  eq (S.encase (factorial) (-1)) (S.Nothing);

});
