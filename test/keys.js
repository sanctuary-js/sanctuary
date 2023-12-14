import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import keys from 'sanctuary/keys';

import strMap from './internal/strMap.js';


test ('keys', () => {

  eq (S.keys === keys, true);
  eq (String (S.keys), 'keys :: StrMap a -> Array String');

  eq (S.sort (S.keys ({})), []);
  eq (S.sort (S.keys ({a: 1, b: 2, c: 3})), ['a', 'b', 'c']);

  eq (S.keys (strMap), ['enumerable own property']);

});
