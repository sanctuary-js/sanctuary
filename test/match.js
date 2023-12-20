'use strict';

const jsc = require ('jsverify');
const Z = require ('sanctuary-type-classes');

const S = require ('..');

const eq = require ('./internal/eq');


test ('match', () => {

  eq (String (S.match)) ('match :: NonGlobalRegExp -> String -> Maybe (Array (Maybe String))');

  const scheme = '([a-z][a-z0-9+.-]*)';
  const authentication = '(.*?):(.*?)@';
  const hostname = '(.*?)';
  const port = ':([0-9]*)';
  const pattern = S.regex ('') (scheme + '://(?:' + authentication + ')?' + hostname + '(?:' + port + ')?(?!\\S)');

  eq (S.match (pattern) ('URL: N/A'))
     (S.Nothing);

  eq (S.match (pattern) ('URL: http://example.com'))
     (S.Just ([S.Just ('http'), S.Nothing, S.Nothing, S.Just ('example.com'), S.Nothing]));

  eq (S.match (pattern) ('URL: http://user:pass@example.com:80'))
     (S.Just ([S.Just ('http'), S.Just ('user'), S.Just ('pass'), S.Just ('example.com'), S.Just ('80')]));

  jsc.assert (jsc.forall (jsc.string, s => {
    const p = '([A-Za-z]+)';
    const lhs = S.head (S.matchAll (S.regex ('g') (p)) (s));
    const rhs = S.match (S.regex ('') (p)) (s);
    return Z.equals (lhs, rhs);
  }), {tests: 1000});

});
