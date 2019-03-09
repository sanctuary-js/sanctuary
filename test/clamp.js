'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('clamp', () => {

  eq (typeof S.clamp) ('function');
  eq (S.clamp.length) (1);
  eq (S.show (S.clamp)) ('clamp :: Ord a => a -> a -> a -> a');

  eq (S.clamp (0) (100) (-1)) (0);
  eq (S.clamp (0) (100) (0)) (0);
  eq (S.clamp (0) (100) (50)) (50);
  eq (S.clamp (0) (100) (100)) (100);
  eq (S.clamp (0) (100) (101)) (100);

  eq (S.clamp ('A') ('Z') ('0')) ('A');
  eq (S.clamp ('A') ('Z') ('A')) ('A');
  eq (S.clamp ('A') ('Z') ('X')) ('X');
  eq (S.clamp ('A') ('Z') ('Z')) ('Z');
  eq (S.clamp ('A') ('Z') ('~')) ('Z');

});
