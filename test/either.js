import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import either from 'sanctuary/either';


test ('either', () => {

  eq (S.either === either, true);
  eq (String (S.either), 'either :: (a -> c) -> (b -> c) -> Either a b -> c');

  eq (S.either (S.prop ('length')) (Math.sqrt) (S.Left ('abc')), 3);
  eq (S.either (S.prop ('length')) (Math.sqrt) (S.Right (256)), 16);

});
