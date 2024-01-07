import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('pair', () => {

  eq (String (S.pair), 'pair :: (a -> b -> c) -> Pair a b -> c');

  eq (S.pair (S.concat) (S.Pair ('foo') ('bar')), 'foobar');

});
