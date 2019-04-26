'use strict';

const $ = require ('sanctuary-def');

const S = require ('..');

const eq = require ('./internal/eq');


test ('parseJson', () => {

  eq (S.show (S.parseJson)) ('parseJson :: (Any -> Boolean) -> String -> Maybe a');

  eq (S.parseJson (S.is ($.Any)) ('[Invalid JSON]')) (S.Nothing);
  eq (S.parseJson (S.is ($.Array ($.Any))) ('{"foo":"bar"}')) (S.Nothing);
  eq (S.parseJson (S.is ($.Array ($.Any))) ('["foo","bar"]')) (S.Just (['foo', 'bar']));
  eq (S.parseJson (S.is ($.Array ($.Number))) ('[1,2]')) (S.Just ([1, 2]));
  eq (S.parseJson (S.is ($.Array ($.Number))) ('[1,2,null]')) (S.Nothing);

});
