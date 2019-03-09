'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('odd', () => {

  eq (typeof S.odd) ('function');
  eq (S.odd.length) (1);
  eq (S.show (S.odd)) ('odd :: Integer -> Boolean');

  eq (S.odd (1)) (true);
  eq (S.odd (-1)) (true);

  eq (S.odd (0)) (false);
  eq (S.odd (2)) (false);
  eq (S.odd (-2)) (false);

});
