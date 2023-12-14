import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import apSecond from 'sanctuary/apSecond';


test ('apSecond', () => {

  eq (S.apSecond === apSecond, true);
  eq (String (S.apSecond), 'apSecond :: Apply f => f a -> f b -> f b');

  eq (S.apSecond ([1, 2]) ([3, 4]), [3, 4, 3, 4]);
  eq (S.apSecond (S.Just (1)) (S.Just (2)), S.Just (2));

});
