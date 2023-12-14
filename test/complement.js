import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import complement from 'sanctuary/complement';


test ('complement', () => {

  eq (S.complement === complement, true);
  eq (String (S.complement), 'complement :: (a -> Boolean) -> a -> Boolean');

  eq (S.complement (S.odd) (1), false);
  eq (S.complement (S.odd) (2), true);

});
