'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('fromMaybe_', () => {

  eq (String (S.fromMaybe_), 'fromMaybe_ :: (() -> a) -> Maybe a -> a');

  eq (S.fromMaybe_ (() => 0) (S.Nothing), 0);
  eq (S.fromMaybe_ (() => 0) (S.Just (42)), 42);

  let count = 0;
  eq (S.fromMaybe_ (() => count += 1) (S.Just (42)), 42);
  eq (count, 0);

});
