'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('complement', () => {

  eq (typeof S.complement) ('function');
  eq (S.complement.length) (1);
  eq (S.show (S.complement)) ('complement :: (a -> Boolean) -> a -> Boolean');

  eq (S.complement (S.odd) (1)) (false);
  eq (S.complement (S.odd) (2)) (true);

});
