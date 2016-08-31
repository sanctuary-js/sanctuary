'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('lines', function() {

  it('is a unary function', function() {
    eq(typeof S.lines, 'function');
    eq(S.lines.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.lines(['foo']); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'lines :: String -> Array String\n' +
                   '         ^^^^^^\n' +
                   '           1\n' +
                   '\n' +
                   '1)  ["foo"] :: Array String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('splits a string into a list of lines', function() {
    eq(S.lines(''), []);
    eq(S.lines('\n'), ['']);
    eq(S.lines('\n\n'), ['', '']);
    eq(S.lines('foo\nbar\nbaz'), ['foo', 'bar', 'baz']);
    eq(S.lines('foo\nbar\nbaz\n'), ['foo', 'bar', 'baz']);
    eq(S.lines('\tfoo\r\n\tbar\r\n\tbaz\r\n'), ['\tfoo', '\tbar', '\tbaz']);
  });

});
