'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('tagBy', () => {

  eq (typeof S.tagBy) ('function');
  eq (S.tagBy.length) (1);
  eq (S.show (S.tagBy)) ('tagBy :: (a -> Boolean) -> a -> Either a a');

  eq (S.tagBy (S.odd) (5)) (S.Right (5));
  eq (S.tagBy (S.odd) (6)) (S.Left (6));

});
