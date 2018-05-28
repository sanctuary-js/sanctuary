'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('isRight', function() {

  eq (typeof S.isRight) ('function');
  eq (S.isRight.length) (1);
  eq (S.show (S.isRight)) ('isRight :: Either a b -> Boolean');

  eq (S.isRight (S.Left (42))) (false);
  eq (S.isRight (S.Right (42))) (true);

});
