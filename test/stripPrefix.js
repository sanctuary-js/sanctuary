'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('stripPrefix', function() {

  eq(typeof S.stripPrefix, 'function');
  eq(S.stripPrefix.length, 2);
  eq(S.stripPrefix.toString(), 'stripPrefix :: String -> String -> Maybe String');

  eq(S.stripPrefix('', ''), S.Just(''));
  eq(S.stripPrefix('', 'abc'), S.Just('abc'));
  eq(S.stripPrefix('a', ''), S.Nothing);
  eq(S.stripPrefix('a', 'abc'), S.Just('bc'));
  eq(S.stripPrefix('a', '[abc]'), S.Nothing);
  eq(S.stripPrefix('aaa', 'a'), S.Nothing);
  eq(S.stripPrefix('https://', 'https://sanctuary.js.org'), S.Just('sanctuary.js.org'));
  eq(S.stripPrefix('https://', 'http://sanctuary.js.org'), S.Nothing);

});
