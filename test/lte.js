import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import * as S from 'sanctuary';
import lte from 'sanctuary/lte';


test ('lte', () => {

  eq (S.lte === lte, true);
  eq (String (S.lte), 'lte :: Ord a => a -> a -> Boolean');

  eq (S.filter (S.lte (3)) ([1, 2, 3, 4, 5]), [1, 2, 3]);

});
