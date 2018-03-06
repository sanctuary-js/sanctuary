'use strict';

var $ = require ('sanctuary-def');

var S = require ('../..');

var eq = require ('../internal/eq');


test ('MaybeType', function() {

  eq ($.test ($.env) (S.MaybeType ($.Number)) (S.Nothing)) (true);
  eq ($.test ($.env) (S.MaybeType ($.Number)) (S.Just (42))) (true);
  eq ($.test ($.env) (S.MaybeType ($.Number)) (S.Just ('42'))) (false);
  eq ($.test ($.env) (S.MaybeType ($.Number)) (S.Right (42))) (false);
  eq ($.test ($.env) (S.MaybeType ($.Number)) (null)) (false);

});
