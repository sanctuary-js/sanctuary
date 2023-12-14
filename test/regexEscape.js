import {deepStrictEqual as eq} from 'node:assert';

import jsc from 'jsverify';
import test from 'oletus';

import * as S from 'sanctuary';
import regexEscape from 'sanctuary/regexEscape';


test ('regexEscape', () => {

  eq (S.regexEscape === regexEscape, true);
  eq (String (S.regexEscape), 'regexEscape :: String -> String');

  eq (S.regexEscape ('-=*{XYZ}*=-'), '\\-=\\*\\{XYZ\\}\\*=\\-');

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
