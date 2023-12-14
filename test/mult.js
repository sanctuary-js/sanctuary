import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import mult from 'sanctuary/mult';


test ('mult', () => {

  eq (S.mult === mult, true);
  eq (String (S.mult), 'mult :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.mult (4) (2), 8);
  eq (S.mult (4) (-2), -8);
  eq (S.mult (-4) (-2), 8);
  eq (S.mult (1.5) (3), 4.5);
  eq (S.mult (-1.5) (3), -4.5);
  eq (S.mult (-1.5) (-3), 4.5);

});
