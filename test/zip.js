import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';
import Pair from 'sanctuary-pair';

import * as S from 'sanctuary';
import zip from 'sanctuary/zip';


test ('zip', () => {

  eq (S.zip === zip, true);
  eq (String (S.zip), 'zip :: Array a -> Array b -> Array (Pair a b)');

  eq (S.zip (['a', 'b']) (['x', 'y', 'z']),
      [Pair ('a') ('x'), Pair ('b') ('y')]);
  eq (S.zip ([1, 3, 5]) ([2, 4]),
      [Pair (1) (2), Pair (3) (4)]);

});
