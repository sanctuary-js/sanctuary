import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import even from 'sanctuary/even';


test ('even', () => {

  eq (S.even === even, true);
  eq (String (S.even), 'even :: Integer -> Boolean');

  eq (S.even (0), true);
  eq (S.even (2), true);
  eq (S.even (-2), true);

  eq (S.even (1), false);
  eq (S.even (-1), false);

});
