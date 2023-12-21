import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';

import strMap from './internal/strMap.js';


test ('values', () => {

  eq (String (S.values), 'values :: StrMap a -> Array a');

  eq (S.sort (S.values ({})), []);
  eq (S.sort (S.values ({a: 1, b: 2, c: 3})), [1, 2, 3]);

  eq (S.values (strMap), ['enumerable own property']);

});
