'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('test', () => {

  eq (typeof S.test) ('function');
  eq (S.test.length) (1);
  eq (S.show (S.test)) ('test :: RegExp -> String -> Boolean');

  eq (S.test (/^a/) ('abacus')) (true);
  eq (S.test (/^a/) ('banana')) (false);

  const pattern = /x/g;
  eq (pattern.lastIndex) (0);
  eq (S.test (pattern) ('xyz')) (true);
  eq (pattern.lastIndex) (0);
  eq (S.test (pattern) ('xyz')) (true);

});
