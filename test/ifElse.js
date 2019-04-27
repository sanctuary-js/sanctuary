'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('ifElse', () => {

  eq (S.show (S.ifElse)) ('ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b');

  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (9)) (8);
  eq (S.ifElse (S.odd) (S.sub (1)) (S.add (1)) (0)) (1);

});
