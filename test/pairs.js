import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import pairs from 'sanctuary/pairs';

import strMap from './internal/strMap.js';


test ('pairs', () => {

  eq (S.pairs === pairs, true);
  eq (String (S.pairs), 'pairs :: StrMap a -> Array (Pair String a)');

  eq (S.sort (S.pairs ({})), []);
  eq (S.sort (S.pairs ({a: 1, b: 2, c: 3})), [S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)]);

  eq (S.pairs (strMap), [S.Pair ('enumerable own property') ('enumerable own property')]);

});
