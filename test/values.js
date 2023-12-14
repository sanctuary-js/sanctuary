import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import values from 'sanctuary/values';

import strMap from './internal/strMap.js';


test ('values', () => {

  eq (S.values === values, true);
  eq (String (S.values), 'values :: StrMap a -> Array a');

  eq (S.sort (S.values ({})), []);
  eq (S.sort (S.values ({a: 1, b: 2, c: 3})), [1, 2, 3]);

  eq (S.values (strMap), ['enumerable own property']);

});
