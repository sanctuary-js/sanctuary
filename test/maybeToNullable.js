'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('maybeToNullable', () => {

  eq (String (S.maybeToNullable), 'maybeToNullable :: Maybe a -> Nullable a');

  eq (S.maybeToNullable (S.Nothing), null);
  eq (S.maybeToNullable (S.Just (42)), 42);

});
