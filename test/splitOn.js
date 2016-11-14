'use strict';

var throws = require('assert').throws;

var jsc = require('jsverify');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('splitOn', function() {

  it('is a binary function', function() {
    eq(typeof S.splitOn, 'function');
    eq(S.splitOn.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.splitOn(/x/); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'splitOn :: String -> String -> Array String\n' +
                   '           ^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  /x/ :: RegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));

    throws(function() { S.splitOn('', null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'splitOn :: String -> String -> Array String\n' +
                   '                     ^^^^^^\n' +
                   '                       1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('splits a string at occurrences of a separator', function() {
    eq(S.splitOn('', 'abc'), ['a', 'b', 'c']);
    eq(S.splitOn(':', ''), ['']);
    eq(S.splitOn(':', ':'), ['', '']);
    eq(S.splitOn(':', ':foo:'), ['', 'foo', '']);
    eq(S.splitOn(':', 'foo:bar:baz'), ['foo', 'bar', 'baz']);
    eq(S.splitOn('::', 'foo::bar::baz'), ['foo', 'bar', 'baz']);
  });

  it('property: joinWith(s, splitOn(s, t)) = t', function() {
    jsc.assert(jsc.forall(jsc.asciistring, function(t) {
      var min = 0;
      var max = t.length;
      var i = jsc.random(min, max);
      var j = jsc.random(min, max);
      var s = t.slice(Math.min(i, j), Math.max(i, j));
      return S.joinWith(s, S.splitOn(s, t)) === t;
    }), {tests: 1000});
  });

});
