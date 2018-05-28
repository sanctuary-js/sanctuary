'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('test', function() {

  eq (typeof S.test) ('function');
  eq (S.test.length) (1);
  eq (S.show (S.test)) ('test :: RegExp -> String -> Boolean');

  eq (S.test (/^a/) ('abacus')) (true);
  eq (S.test (/^a/) ('banana')) (false);

  var pattern = /x/g;
  eq (pattern.lastIndex) (0);
  eq (S.test (pattern) ('xyz')) (true);
  eq (pattern.lastIndex) (0);
  eq (S.test (pattern) ('xyz')) (true);

});
