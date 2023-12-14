import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import pipeK from 'sanctuary/pipeK';

import {Nil, Cons} from './internal/List.js';


test ('pipeK', () => {

  eq (S.pipeK === pipeK, true);
  eq (String (S.pipeK), 'pipeK :: (Foldable f, Chain m) => f (Any -> m Any) -> m a -> m b');

  eq (S.pipeK ([]) (S.Just ([1, 2, 3])), S.Just ([1, 2, 3]));
  eq (S.pipeK ([S.tail]) (S.Just ([1, 2, 3])), S.Just ([2, 3]));
  eq (S.pipeK ([S.tail, S.tail]) (S.Just ([1, 2, 3])), S.Just ([3]));
  eq (S.pipeK ([S.tail, S.tail, S.head]) (S.Just ([1, 2, 3])), S.Just (3));

  eq (S.pipeK (Nil) (S.Just ([1, 2, 3])), S.Just ([1, 2, 3]));
  eq (S.pipeK (Cons (S.tail) (Nil)) (S.Just ([1, 2, 3])), S.Just ([2, 3]));
  eq (S.pipeK (Cons (S.tail) (Cons (S.tail) (Nil))) (S.Just ([1, 2, 3])), S.Just ([3]));
  eq (S.pipeK (Cons (S.tail) (Cons (S.tail) (Cons (S.head) (Nil)))) (S.Just ([1, 2, 3])), S.Just (3));

});
