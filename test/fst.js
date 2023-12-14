import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import fst from 'sanctuary/fst';


test ('fst', () => {

  eq (S.fst === fst, true);
  eq (String (S.fst), 'fst :: Pair a b -> a');

  eq (S.fst (S.Pair ('foo') (42)), 'foo');

});
