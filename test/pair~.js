import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import pair from 'sanctuary/pair';


test ('pair', () => {

  eq (S.pair === pair, true);
  eq (String (S.pair), 'pair :: (a -> b -> c) -> Pair a b -> c');

  eq (S.pair (S.concat) (S.Pair ('foo') ('bar')), 'foobar');

});
