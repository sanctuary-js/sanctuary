'use strict';

const $ = require ('sanctuary-def');

const S = require ('..');

const eq = require ('./internal/eq');


test ('MaybeType', () => {

  eq (typeof S.MaybeType) ('function');
  eq (S.MaybeType.length) (1);
  eq (S.show (S.MaybeType)) ('Maybe :: Type -> Type');

  eq (S.is (S.MaybeType ($.Number)) (S.Nothing)) (true);
  eq (S.is (S.MaybeType ($.Number)) (S.Just (42))) (true);
  eq (S.is (S.MaybeType ($.Number)) (S.Just ('42'))) (false);
  eq (S.is (S.MaybeType ($.Number)) (S.Right (42))) (false);
  eq (S.is (S.MaybeType ($.Number)) (null)) (false);

});
