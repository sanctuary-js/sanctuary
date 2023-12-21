import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('zip', () => {

  eq (String (S.zip), 'zip :: Array a -> Array b -> Array (Pair a b)');

  eq (S.zip (['a', 'b']) (['x', 'y', 'z']),
      [S.Pair ('a') ('x'), S.Pair ('b') ('y')]);
  eq (S.zip ([1, 3, 5]) ([2, 4]),
      [S.Pair (1) (2), S.Pair (3) (4)]);

});
