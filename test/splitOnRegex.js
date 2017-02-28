'use strict';

var jsc = require('jsverify');

var S = require('..');

var eq = require('./internal/eq');


test('splitOnRegex', function() {

  eq(typeof S.splitOnRegex, 'function');
  eq(S.splitOnRegex.length, 2);
  eq(S.splitOnRegex.toString(), 'splitOnRegex :: GlobalRegExp -> String -> Array String');

  eq(S.splitOnRegex(/b/g, 'abc'), ['a', 'c']);
  eq(S.splitOnRegex(/d/g, 'abc'), ['abc']);
  eq(S.splitOnRegex(/b(?=c)/g, 'abc abd'), ['a', 'c abd']);
  eq(S.splitOnRegex(/b(?!c)/g, 'abc abd'), ['abc a', 'd']);

  eq(S.splitOnRegex(/\s+/g, 'foo  bar baz   qux'), ['foo', 'bar', 'baz', 'qux']);
  eq(S.splitOnRegex(/\s+/g, 'foo  bar baz\tqux\nquux'), ['foo', 'bar', 'baz', 'qux', 'quux']);
  eq(S.splitOnRegex(/\s+/g, 'foobar'), ['foobar']);
  eq(S.splitOnRegex(/([:;])\1/g, 'foo::bar:;baz;;quux'), ['foo', 'bar:;baz', 'quux']);

  eq(S.splitOnRegex(/./g, 'a\rb\nc'), ['', '\r', '\n', '']);
  eq(S.splitOnRegex(/[^]/g, 'a\nb'), ['', '', '', '']);

  eq(S.splitOnRegex(/^/g, 'foo\nbar\nbaz\n'), ['foo\nbar\nbaz\n']);
  eq(S.splitOnRegex(/^/gm, 'foo\nbar\nbaz\n'), ['foo\n', 'bar\n', 'baz\n']);

  eq(S.splitOnRegex(/foo/g, 'FOObar'), ['FOObar']);
  eq(S.splitOnRegex(/foo/gi, 'FOObar'), ['', 'bar']);

  eq(S.splitOnRegex(/(?:)/g, ''), []);
  eq(S.splitOnRegex(/(?:)/g, 'a'), ['a']);
  eq(S.splitOnRegex(/(?:)/g, 'ab'), ['a', 'b']);
  eq(S.splitOnRegex(/(?:)/g, 'abc'), ['a', 'b', 'c']);

  eq(S.splitOnRegex(/[^]/g, ''), ['']);
  eq(S.splitOnRegex(/[^]/g, 'a'), ['', '']);
  eq(S.splitOnRegex(/[^]/g, 'ab'), ['', '', '']);
  eq(S.splitOnRegex(/[^]/g, 'abc'), ['', '', '', '']);

  eq(S.splitOnRegex(/.*/g, ''), []);
  eq(S.splitOnRegex(/.*/g, 'hello'), ['']);
  eq(S.splitOnRegex(/./g, ''), ['']);
  eq(S.splitOnRegex(/./g, 'hello'), ['', '', '', '', '', '']);

  jsc.assert(jsc.forall(jsc.asciistring, function(t) {
    var min = 0;
    var max = t.length;
    var i = jsc.random(min, max);
    var j = jsc.random(min, max);
    var s = t.slice(Math.min(i, j), Math.max(i, j));
    return S.joinWith(s, S.splitOnRegex(S.regex('g', S.regexEscape(s)), t)) === t;
  }), {tests: 1000});

});
