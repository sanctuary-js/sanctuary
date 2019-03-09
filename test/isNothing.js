'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('isNothing', () => {

  eq (typeof S.isNothing) ('function');
  eq (S.isNothing.length) (1);
  eq (S.show (S.isNothing)) ('isNothing :: Maybe a -> Boolean');

  eq (S.isNothing (S.Nothing)) (true);
  eq (S.isNothing (S.Just (42))) (false);

});
