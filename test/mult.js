import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('mult', () => {

  eq (String (S.mult), 'mult :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.mult (4) (2), 8);
  eq (S.mult (4) (-2), -8);
  eq (S.mult (-4) (-2), 8);
  eq (S.mult (1.5) (3), 4.5);
  eq (S.mult (-1.5) (3), -4.5);
  eq (S.mult (-1.5) (-3), 4.5);

});
