'use strict';

const vm = require ('vm');

const $ = require ('sanctuary-def');

const S = require ('..');

const eq = require ('./internal/eq');


test ('get', () => {

  eq (S.show (S.get)) ('get :: (Any -> Boolean) -> String -> a -> Maybe b');

  eq (S.get (S.is ($.Number)) ('x') ({x: 0, y: 42})) (S.Just (0));
  eq (S.get (S.is ($.Number)) ('y') ({x: 0, y: 42})) (S.Just (42));
  eq (S.get (S.is ($.Number)) ('z') ({x: 0, y: 42})) (S.Nothing);
  eq (S.get (S.is ($.String)) ('z') ({x: 0, y: 42})) (S.Nothing);
  eq (S.get (S.is ($.String)) ('x') ({x: 0, y: 42})) (S.Nothing);
  eq (S.get (S.is ($.RegExp)) ('x') ({x: vm.runInNewContext ('/.*/')})) (S.Just (/.*/));

  eq (S.get (S.K (true)) ('valueOf') (null)) (S.Nothing);
  eq (S.get (S.K (true)) ('valueOf') (undefined)) (S.Nothing);

  eq (S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2]})) (S.Just ([1, 2]));
  eq (S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, null]})) (S.Nothing);

});
