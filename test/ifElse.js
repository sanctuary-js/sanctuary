'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('ifElse', () => {

  eq (String (S.ifElse), 'ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b');

  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (9), 8);
  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (0), 1);

});
