import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('add', () => {

  eq (String (S.add), 'add :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.add (1) (1), 2);
  eq (S.add (-1) (-1), -2);
  eq (S.add (1.5) (1), 2.5);
  eq (S.add (-1.5) (-1), -2.5);

});
