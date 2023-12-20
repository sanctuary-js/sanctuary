'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('unless', () => {

  eq (String (S.unless), 'unless :: (a -> Boolean) -> (a -> a) -> a -> a');

  eq (S.unless (S.lt (0)) (Math.sqrt) (16), 4);
  eq (S.unless (S.lt (0)) (Math.sqrt) (-1), -1);

});
