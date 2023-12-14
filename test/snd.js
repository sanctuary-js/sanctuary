import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import snd from 'sanctuary/snd';


test ('snd', () => {

  eq (S.snd === snd, true);
  eq (String (S.snd), 'snd :: Pair a b -> b');

  eq (S.snd (S.Pair ('foo') (42)), 42);

});
