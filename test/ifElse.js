import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import ifElse from 'sanctuary/ifElse';


test ('ifElse', () => {

  eq (S.ifElse === ifElse, true);
  eq (String (S.ifElse), 'ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b');

  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (9), 8);
  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (0), 1);

});
