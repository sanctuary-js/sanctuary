'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('fromEither', () => {

  eq (S.show (S.fromEither)) ('fromEither :: b -> Either a b -> b');

  eq (S.fromEither (0) (S.Left (42))) (0);
  eq (S.fromEither (0) (S.Right (42))) (42);

});
