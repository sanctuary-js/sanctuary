import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('Pair', () => {

  eq (String (S.Pair), 'Pair :: a -> b -> Pair a b');

  eq (S.Pair ('foo') (42), S.Pair ('foo') (42));

});
