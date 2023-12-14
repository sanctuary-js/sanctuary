import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import swap from 'sanctuary/swap';


test ('swap', () => {

  eq (S.swap === swap, true);
  eq (String (S.swap), 'swap :: Pair a b -> Pair b a');

  eq (S.swap (S.Pair ('foo') (42)), S.Pair (42) ('foo'));

});
