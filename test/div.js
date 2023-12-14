import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import div from 'sanctuary/div';


test ('div', () => {

  eq (S.div === div, true);
  eq (String (S.div), 'div :: NonZeroFiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.map (S.div (2)) ([0, 1, 2, 3]), [0, 0.5, 1, 1.5]);

});
