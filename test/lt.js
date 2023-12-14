import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import lt from 'sanctuary/lt';


test ('lt', () => {

  eq (S.lt === lt, true);
  eq (String (S.lt), 'lt :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lt (3)) ([1, 2, 3, 4, 5]), [1, 2]);

});
