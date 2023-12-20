'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('join', () => {

  eq (String (S.join), 'join :: Chain m => m (m a) -> m a');

  eq (S.join ([]), []);
  eq (S.join ([[]]), []);
  eq (S.join ([[[]]]), [[]]);
  eq (S.join ([[1], [2], [3]]), [1, 2, 3]);
  eq (S.join ([[[1, 2, 3]]]), [[1, 2, 3]]);
  eq (S.join (S.Nothing), S.Nothing);
  eq (S.join (S.Just (S.Nothing)), S.Nothing);
  eq (S.join (S.Just (S.Just (1))), S.Just (1));
  eq (S.join (S.Just (S.Just (S.Just (1)))), S.Just (S.Just (1)));

});
