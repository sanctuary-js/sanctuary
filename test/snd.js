import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('snd', () => {

  eq (String (S.snd), 'snd :: Pair a b -> b');

  eq (S.snd (S.Pair ('foo') (42)), 42);

});
