import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import odd from 'sanctuary/odd';


test ('odd', () => {

  eq (S.odd === odd, true);
  eq (String (S.odd), 'odd :: Integer -> Boolean');

  eq (S.odd (1), true);
  eq (S.odd (-1), true);

  eq (S.odd (0), false);
  eq (S.odd (2), false);
  eq (S.odd (-2), false);

});
