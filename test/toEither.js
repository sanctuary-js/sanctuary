'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('toEither', () => {

  eq (typeof S.toEither) ('function');
  eq (S.toEither.length) (1);
  eq (S.show (S.toEither)) ('toEither :: a -> b -> Either a b');

  eq (S.toEither ('a') (null)) (S.Left ('a'));
  eq (S.toEither ('a') (undefined)) (S.Left ('a'));
  eq (S.toEither ('a') (42)) (S.Right (42));

});
