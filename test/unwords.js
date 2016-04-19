'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('unwords', function() {

  it('is a unary function', function() {
    eq(typeof S.unwords, 'function');
    eq(S.unwords.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.unwords(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'unwords :: Array String -> String\n' +
                   '           ^^^^^^^^^^^^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array String’.\n'));
  });

  it('joins -- with separating spaces -- a list of words', function() {
    eq(S.unwords([]), '');
    eq(S.unwords(['']), '');
    eq(S.unwords(['', '']), ' ');
    eq(S.unwords([' ']), ' ');
    eq(S.unwords([' ', ' ']), '   ');
    eq(S.unwords(['foo', 'bar', 'baz']), 'foo bar baz');
    eq(S.unwords([' foo ', ' bar ', ' baz ']), ' foo   bar   baz ');
  });

});
