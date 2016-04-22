'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('words', function() {

  it('is a unary function', function() {
    eq(typeof S.words, 'function');
    eq(S.words.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.words(['foo']); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'words :: String -> Array String\n' +
                   '         ^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  ["foo"] :: Array String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('splits a string into a list of words', function() {
    eq(S.words(''), []);
    eq(S.words(' '), []);
    eq(S.words(' \t\r\n'), []);
    eq(S.words('foo bar baz'), ['foo', 'bar', 'baz']);
    eq(S.words(' foo bar baz '), ['foo', 'bar', 'baz']);
    eq(S.words('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['foo', 'bar', 'baz']);
  });

});
