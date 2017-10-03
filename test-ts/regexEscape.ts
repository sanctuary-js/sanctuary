const jsc = require('jsverify');

import * as S from '..';

import eq from './internal/eq';


test('regexEscape', () => {

  eq(typeof S.regexEscape, 'function');
  eq(S.regexEscape.length, 1);
  eq(S.regexEscape.toString(), 'regexEscape :: String -> String');

  eq(S.regexEscape('-=*{XYZ}*=-'), '\\-=\\*\\{XYZ\\}\\*=\\-');

  jsc.assert(jsc.forall(jsc.string, function(s: string) {
    return S.test(S.regex('')(S.regexEscape(s)))(s);
  }), {tests: 1000});

  jsc.assert(jsc.forall(jsc.string, function(s: string) {
    return S.test(S.regex('')('^' + S.regexEscape(s) + '$'))(s);
  }), {tests: 1000});

});
