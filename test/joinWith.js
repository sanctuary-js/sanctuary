'use strict';

var S = require ('..');

var eq = require ('./internal/eq');


test ('joinWith', function() {

  eq (typeof S.joinWith) ('function');
  eq (S.joinWith.length) (1);
  eq (String (S.joinWith)) ('joinWith :: String -> Array String -> String');

  eq (S.joinWith ('') (['a', 'b', 'c'])) ('abc');
  eq (S.joinWith (':') ([])) ('');
  eq (S.joinWith (':') ([''])) ('');
  eq (S.joinWith (':') (['', ''])) (':');
  eq (S.joinWith (':') (['', 'foo', ''])) (':foo:');
  eq (S.joinWith (':') (['foo', 'bar', 'baz'])) ('foo:bar:baz');
  eq (S.joinWith ('::') (['foo', 'bar', 'baz'])) ('foo::bar::baz');

});
