import {deepStrictEqual as eq} from 'node:assert';

import test from 'oletus';

import S from '../index.js';


test ('chain', () => {

  eq (String (S.chain), 'chain :: Chain m => (a -> m b) -> m a -> m b');

  eq (S.chain (S.I) ([[1, 2], [3, 4], [5, 6]]), [1, 2, 3, 4, 5, 6]);
  eq (S.chain (S.parseFloat) (S.Nothing), S.Nothing);
  eq (S.chain (S.parseFloat) (S.Just ('X')), S.Nothing);
  eq (S.chain (S.parseFloat) (S.Just ('0')), S.Just (0));

});
