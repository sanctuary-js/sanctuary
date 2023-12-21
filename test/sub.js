import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('sub', () => {

  eq (String (S.sub), 'sub :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.map (S.sub (1)) ([1, 2, 3]), [0, 1, 2]);

});
