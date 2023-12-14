import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import pow from 'sanctuary/pow';


test ('pow', () => {

  eq (S.pow === pow, true);
  eq (String (S.pow), 'pow :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.pow (2) (8), 64);
  eq (S.map (S.pow (2)) ([-3, -2, -1, 0, 1, 2, 3]), [9, 4, 1, 0, 1, 4, 9]);
  eq (S.map (S.pow (0.5)) ([1, 4, 9, 16, 25]), [1, 2, 3, 4, 5]);

});
