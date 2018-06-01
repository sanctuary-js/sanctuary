'use strict';

var $ = require ('sanctuary-def');

var S = require ('..');

var eq = require ('./internal/eq');


test ('PairType', function() {

  eq (typeof S.PairType) ('function');
  eq (S.PairType.length) (1);
  eq (S.show (S.PairType)) ('Pair :: Type -> Type -> Type');

  eq (S.is (S.PairType ($.String) ($.Number)) (S.Pair ('hi') (0.25))) (true);
  eq (S.is (S.PairType ($.String) ($.Number)) (S.Pair ('hi') ('hi'))) (false);
  eq (S.is (S.PairType ($.String) ($.Number)) (S.Pair (0.25) (0.25))) (false);
  eq (S.is (S.PairType ($.String) ($.Number)) (S.Pair (null) (null))) (false);
  eq (S.is (S.PairType ($.String) ($.Number)) (null)) (false);

});
