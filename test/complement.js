'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('complement', () => {

  eq (String (S.complement)) ('complement :: (a -> Boolean) -> a -> Boolean');

  eq (S.complement (S.odd) (1)) (false);
  eq (S.complement (S.odd) (2)) (true);

});
