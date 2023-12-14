import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import max from 'sanctuary/max';


test ('max', () => {

  eq (S.max === max, true);
  eq (String (S.max), 'max :: Ord a => a -> a -> a');

  eq (S.max (10) (2), 10);
  eq (S.max (2) (10), 10);
  eq (S.max (0.1) (0.01), 0.1);
  eq (S.max (0.01) (0.1), 0.1);
  eq (S.max (Infinity) (-Infinity), Infinity);
  eq (S.max (-Infinity) (Infinity), Infinity);

  eq (S.max (new Date (10)) (new Date (2)), new Date (10));
  eq (S.max (new Date (2)) (new Date (10)), new Date (10));

  eq (S.max ('abc') ('xyz'), 'xyz');
  eq (S.max ('xyz') ('abc'), 'xyz');
  eq (S.max ('10') ('2'), '2');
  eq (S.max ('2') ('10'), '2');
  eq (S.max ('A') ('a'), 'a');
  eq (S.max ('a') ('A'), 'a');

});
