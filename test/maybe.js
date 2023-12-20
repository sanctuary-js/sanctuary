'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('maybe', () => {

  eq (String (S.maybe), 'maybe :: b -> (a -> b) -> Maybe a -> b');

  eq (S.maybe (0) (Math.sqrt) (S.Nothing), 0);
  eq (S.maybe (0) (Math.sqrt) (S.Just (9)), 3);

});
