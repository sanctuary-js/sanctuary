'use strict';

const S = require ('..');

const eq = require ('./internal/eq');


test ('test', () => {

  eq (String (S.test)) ('test :: RegExp -> String -> Boolean');

  eq (S.test (/^a/) ('abacus')) (true);
  eq (S.test (/^a/) ('banana')) (false);

  const pattern = /x/g;
  eq (pattern.lastIndex) (0);
  eq (S.test (pattern) ('xyz')) (true);
  eq (pattern.lastIndex) (0);
  eq (S.test (pattern) ('xyz')) (true);

  {
    // `lastIndex` property is respected and preserved
    const pattern = /x/g;
    eq (pattern.lastIndex) (0);
    pattern.exec ('xyz');
    eq (pattern.lastIndex) (1);
    eq (S.test (pattern) ('xyz')) (false);
    eq (pattern.lastIndex) (1);
  }

});
