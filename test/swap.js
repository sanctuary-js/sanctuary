import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('swap', () => {

  eq (String (S.swap), 'swap :: Pair a b -> Pair b a');

  eq (S.swap (S.Pair ('foo') (42)), S.Pair (42) ('foo'));

});
