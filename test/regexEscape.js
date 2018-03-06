'use strict';

var jsc = require ('jsverify');

var S = require ('..');

var eq = require ('./internal/eq');


test ('regexEscape', function() {

  eq (typeof S.regexEscape) ('function');
  eq (S.regexEscape.length) (1);
  eq (String (S.regexEscape)) ('regexEscape :: String -> String');

  eq (S.regexEscape ('-=*{XYZ}*=-')) ('\\-=\\*\\{XYZ\\}\\*=\\-');

  jsc.assert (jsc.forall (jsc.string, function(s) {
    return S.test (S.regex ('') (S.regexEscape (s))) (s);
  }), {tests: 1000});

  jsc.assert (jsc.forall (jsc.string, function(s) {
    return S.test (S.regex ('') ('^' + S.regexEscape (s) + '$')) (s);
  }), {tests: 1000});

});
