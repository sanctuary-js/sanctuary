'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('tagBy', () => {

  eq (String (S.tagBy), 'tagBy :: (a -> Boolean) -> a -> Either a a');

  eq (S.tagBy (S.odd) (5), S.Right (5));
  eq (S.tagBy (S.odd) (6), S.Left (6));

});
