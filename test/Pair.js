import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import Pair from 'sanctuary/Pair';


test ('Pair', () => {

  eq (S.Pair === Pair, true);
  eq (String (S.Pair), 'Pair :: a -> b -> Pair a b');

  eq (S.Pair ('foo') (42), S.Pair ('foo') (42));

});
