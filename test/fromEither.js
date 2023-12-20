'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('fromEither', () => {

  eq (String (S.fromEither), 'fromEither :: Either a a -> a');

  eq (S.fromEither (S.Left (42)), 42);
  eq (S.fromEither (S.Right (42)), 42);

});
