import {deepStrictEqual as eq} from 'node:assert';

import S from '../index.js';


test ('complement', () => {

  eq (String (S.complement), 'complement :: (a -> Boolean) -> a -> Boolean');

  eq (S.complement (S.odd) (1), false);
  eq (S.complement (S.odd) (2), true);

});
