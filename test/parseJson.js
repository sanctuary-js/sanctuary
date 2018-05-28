'use strict';

var $ = require ('sanctuary-def');

var S = require ('..');

var eq = require ('./internal/eq');


test ('parseJson', function() {

  eq (typeof S.parseJson) ('function');
  eq (S.parseJson.length) (1);
  eq (S.show (S.parseJson)) ('parseJson :: (Any -> Boolean) -> String -> Maybe a');

  eq (S.parseJson (S.is ($.Any)) ('[Invalid JSON]')) (S.Nothing);
  eq (S.parseJson (S.is ($.Array ($.Any))) ('{"foo":"bar"}')) (S.Nothing);
  eq (S.parseJson (S.is ($.Array ($.Any))) ('["foo","bar"]')) (S.Just (['foo', 'bar']));
  eq (S.parseJson (S.is ($.Array ($.Number))) ('[1,2]')) (S.Just ([1, 2]));
  eq (S.parseJson (S.is ($.Array ($.Number))) ('[1,2,null]')) (S.Nothing);

});
