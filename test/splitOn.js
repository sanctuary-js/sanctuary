'use strict';

var jsc = require('jsverify');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('splitOn', function() {

  eq(typeof S.splitOn, 'function');
  eq(S.splitOn.length, 2);

  throws(function() { S.splitOn(/x/); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'splitOn :: String -> String -> Array String\n' +
         '           ^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  /x/ :: RegExp\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  throws(function() { S.splitOn('', null); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'splitOn :: String -> String -> Array String\n' +
         '                     ^^^^^^\n' +
         '                       1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  eq(S.splitOn('', 'abc'), ['a', 'b', 'c']);
  eq(S.splitOn(':', ''), ['']);
  eq(S.splitOn(':', ':'), ['', '']);
  eq(S.splitOn(':', ':foo:'), ['', 'foo', '']);
  eq(S.splitOn(':', 'foo:bar:baz'), ['foo', 'bar', 'baz']);
  eq(S.splitOn('::', 'foo::bar::baz'), ['foo', 'bar', 'baz']);

  jsc.assert(jsc.forall(jsc.asciistring, function(t) {
    var min = 0;
    var max = t.length;
    var i = jsc.random(min, max);
    var j = jsc.random(min, max);
    var s = t.slice(Math.min(i, j), Math.max(i, j));
    return S.joinWith(s, S.splitOn(s, t)) === t;
  }), {tests: 1000});

});
