import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('fst', () => {

  eq (String (S.fst), 'fst :: Pair a b -> a');

  eq (S.fst (S.Pair ('foo') (42)), 'foo');

});
