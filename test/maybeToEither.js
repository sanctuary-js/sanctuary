'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('maybeToEither', () => {

  eq (S.show (S.maybeToEither)) ('maybeToEither :: a -> Maybe b -> Either a b');

  eq (S.maybeToEither ('error msg') (S.Nothing)) (S.Left ('error msg'));
  eq (S.maybeToEither ('error msg') (S.Just (42))) (S.Right (42));

});
