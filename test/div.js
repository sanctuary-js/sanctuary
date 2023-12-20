import {deepStrictEqual as eq} from 'assert';

import S from '../index.js';


test ('div', () => {

  eq (String (S.div), 'div :: NonZeroFiniteNumber -> FiniteNumber -> FiniteNumber');

  eq (S.map (S.div (2)) ([0, 1, 2, 3]), [0, 0.5, 1, 1.5]);

});
