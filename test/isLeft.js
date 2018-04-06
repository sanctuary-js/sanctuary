'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('isLeft', function() {

  eq (typeof S.isLeft) ('function');
  eq (S.isLeft.length) (1);
  eq (String (S.isLeft)) ('isLeft :: Either a b -> Boolean');

  eq (S.isLeft (S.Left (42))) (true);
  eq (S.isLeft (S.Right (42))) (false);

});
