'use strict';

const {deepStrictEqual: eq} = require ('assert');

const S = require ('..');


test ('joinWith', () => {

  eq (String (S.joinWith), 'joinWith :: String -> Array String -> String');

  eq (S.joinWith ('') (['a', 'b', 'c']), 'abc');
  eq (S.joinWith (':') ([]), '');
  eq (S.joinWith (':') (['']), '');
  eq (S.joinWith (':') (['', '']), ':');
  eq (S.joinWith (':') (['', 'foo', '']), ':foo:');
  eq (S.joinWith (':') (['foo', 'bar', 'baz']), 'foo:bar:baz');
  eq (S.joinWith ('::') (['foo', 'bar', 'baz']), 'foo::bar::baz');

});
