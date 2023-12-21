import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('odd', () => {

  eq (String (S.odd), 'odd :: Integer -> Boolean');

  eq (S.odd (1), true);
  eq (S.odd (-1), true);

  eq (S.odd (0), false);
  eq (S.odd (2), false);
  eq (S.odd (-2), false);

});
