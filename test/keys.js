import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';

import strMap from './internal/strMap.js';


test ('keys', () => {

  eq (String (S.keys), 'keys :: StrMap a -> Array String');

  eq (S.sort (S.keys ({})), []);
  eq (S.sort (S.keys ({a: 1, b: 2, c: 3})), ['a', 'b', 'c']);

  eq (S.keys (strMap), ['enumerable own property']);

});
