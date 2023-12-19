'use strict';

const jsc = require ('jsverify');

const S = require ('..');

const eq = require ('./internal/eq');


test ('regexEscape', () => {

  eq (String (S.regexEscape)) ('regexEscape :: String -> String');

  eq (S.regexEscape ('-=*{XYZ}*=-')) ('\\-=\\*\\{XYZ\\}\\*=\\-');

  jsc.assert (
    jsc.forall (
      jsc.string,
      s => S.test (S.regex ('') (S.regexEscape (s))) (s)
    ),
    {tests: 1000}
  );

  jsc.assert (
    jsc.forall (
      jsc.string,
      s => S.test (S.regex ('') ('^' + S.regexEscape (s) + '$')) (s)
    ),
    {tests: 1000}
  );

});
