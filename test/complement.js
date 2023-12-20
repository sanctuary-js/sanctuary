'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('complement', () => {

  eq (String (S.complement), 'complement :: (a -> Boolean) -> a -> Boolean');

  eq (S.complement (S.odd) (1), false);
  eq (S.complement (S.odd) (2), true);

});
