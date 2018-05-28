'use strict';

var jsc = require ('jsverify');

var S = require ('..');

var eq = require ('./internal/eq');
var equals = require ('./internal/equals');


test ('match', function() {

  eq (typeof S.match) ('function');
  eq (S.match.length) (1);
  eq (S.show (S.match)) ('match :: NonGlobalRegExp -> String -> Maybe { groups :: Array (Maybe String), match :: String }');

  var scheme = '([a-z][a-z0-9+.-]*)';
  var authentication = '(.*?):(.*?)@';
  var hostname = '(.*?)';
  var port = ':([0-9]*)';
  var pattern = S.regex ('') (scheme + '://(?:' + authentication + ')?' + hostname + '(?:' + port + ')?(?!\\S)');

  eq (S.match (pattern) ('URL: N/A'))
     (S.Nothing);

  eq (S.match (pattern) ('URL: http://example.com'))
     (S.Just ({match: 'http://example.com',
              groups: [S.Just ('http'), S.Nothing, S.Nothing, S.Just ('example.com'), S.Nothing]}));

  eq (S.match (pattern) ('URL: http://user:pass@example.com:80'))
     (S.Just ({match: 'http://user:pass@example.com:80',
              groups: [S.Just ('http'), S.Just ('user'), S.Just ('pass'), S.Just ('example.com'), S.Just ('80')]}));

  jsc.assert (jsc.forall (jsc.string, function(s) {
    var p = '([A-Za-z]+)';
    var lhs = S.head (S.matchAll (S.regex ('g') (p)) (s));
    var rhs = S.match (S.regex ('') (p)) (s);
    return equals (lhs) (rhs);
  }), {tests: 1000});

});
