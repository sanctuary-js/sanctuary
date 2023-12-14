import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import clamp from 'sanctuary/clamp';


test ('clamp', () => {

  eq (S.clamp === clamp, true);
  eq (String (S.clamp), 'clamp :: Ord a => a -> a -> a -> a');

  eq (S.clamp (0) (100) (-1), 0);
  eq (S.clamp (0) (100) (0), 0);
  eq (S.clamp (0) (100) (50), 50);
  eq (S.clamp (0) (100) (100), 100);
  eq (S.clamp (0) (100) (101), 100);

  eq (S.clamp ('A') ('Z') ('0'), 'A');
  eq (S.clamp ('A') ('Z') ('A'), 'A');
  eq (S.clamp ('A') ('Z') ('X'), 'X');
  eq (S.clamp ('A') ('Z') ('Z'), 'Z');
  eq (S.clamp ('A') ('Z') ('~'), 'Z');

});
