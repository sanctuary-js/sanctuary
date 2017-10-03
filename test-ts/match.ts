const jsc = require('jsverify');
const Z = require('sanctuary-type-classes');

import * as S from '..';

import eq from './internal/eq';


test('match', () => {

  eq(typeof S.match, 'function');
  eq(S.match.length, 2);
  eq(S.match.toString(), 'match :: NonGlobalRegExp -> String -> Maybe { groups :: Array (Maybe String), match :: String }');

  const scheme = '([a-z][a-z0-9+.-]*)';
  const authentication = '(.*?):(.*?)@';
  const hostname = '(.*?)';
  const port = ':([0-9]*)';
  const pattern = S.regex('')(scheme + '://(?:' + authentication + ')?' + hostname + '(?:' + port + ')?(?!\\S)');

  eq(S.match(pattern)('URL: N/A'),
     S.Nothing);

  eq(S.match(pattern)('URL: http://example.com'),
     S.Just({match: 'http://example.com',
             groups: [S.Just('http'), S.Nothing, S.Nothing, S.Just('example.com'), S.Nothing]}));

  eq(S.match(pattern)('URL: http://user:pass@example.com:80'),
     S.Just({match: 'http://user:pass@example.com:80',
             groups: [S.Just('http'), S.Just('user'), S.Just('pass'), S.Just('example.com'), S.Just('80')]}));

  jsc.assert(jsc.forall(jsc.string, function(s: string) {
    const p = '([A-Za-z]+)';
    const lhs = S.head(S.matchAll(S.regex('g')(p))(s));
    const rhs = S.match(S.regex('')(p))(s);
    return Z.equals(lhs, rhs);
  }), {tests: 1000});

});
