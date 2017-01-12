'use strict';

var jsc = require('jsverify');

var S = require('..');

var eq = require('./internal/eq');


test('splitOn', function() {

  eq(typeof S.splitOn, 'function');
  eq(S.splitOn.length, 2);
  eq(S.splitOn.toString(), 'splitOn :: String -> String -> Array String');

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
