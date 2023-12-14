import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import sub from 'sanctuary/sub';


test ('sub', () => {

  eq (S.sub === sub, true);
  eq (String (S.sub), 'sub :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.map (S.sub (1)) ([1, 2, 3]), [0, 1, 2]);

});
