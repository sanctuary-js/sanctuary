import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import fromPairs from 'sanctuary/fromPairs';


test ('fromPairs', () => {

  eq (S.fromPairs === fromPairs, true);
  eq (String (S.fromPairs), 'fromPairs :: Foldable f => f (Pair String a) -> StrMap a');

  eq (S.fromPairs ([]),
      {});
  eq (S.fromPairs ([S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)]),
      {a: 1, b: 2, c: 3});
  eq (S.fromPairs ({x: S.Pair ('a') (1), y: S.Pair ('b') (2), z: S.Pair ('c') (3)}),
      {a: 1, b: 2, c: 3});
  eq (S.fromPairs ([S.Pair ('x') (1), S.Pair ('x') (2)]),
      {x: 2});

});
