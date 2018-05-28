'use strict';

var $ = require ('sanctuary-def');

var S = require ('..');

var eq = require ('./internal/eq');


test ('EitherType', function() {

  eq (typeof S.EitherType) ('function');
  eq (S.EitherType.length) (1);
  eq (S.show (S.EitherType)) ('Either :: Type -> Type -> Type');

  eq (S.is (S.EitherType ($.String) ($.Number)) (S.Left ('Error'))) (true);
  eq (S.is (S.EitherType ($.String) ($.Number)) (S.Right (42))) (true);
  eq (S.is (S.EitherType ($.String) ($.Number)) (S.Right ('42'))) (false);
  eq (S.is (S.EitherType ($.String) ($.Number)) (S.Just (42))) (false);
  eq (S.is (S.EitherType ($.String) ($.Number)) (null)) (false);

});
