import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import add from 'sanctuary/add';


test ('add', () => {

  eq (S.add === add, true);
  eq (String (S.add), 'add :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.add (1) (1), 2);
  eq (S.add (-1) (-1), -2);
  eq (S.add (1.5) (1), 2.5);
  eq (S.add (-1.5) (-1), -2.5);

});
