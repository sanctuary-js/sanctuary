'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('add', function() {

  it('is a binary function', function() {
    eq(typeof S.add, 'function');
    eq(S.add.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.add('xxx', 1); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                   '       ^^^^^^^^^^^^\n' +
                   '            1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

    throws(function() { S.add(1, 'xxx'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                   '                       ^^^^^^^^^^^^\n' +
                   '                            1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

    throws(function() { S.add(1, Infinity); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                   '                       ^^^^^^^^^^^^\n' +
                   '                            1\n' +
                   '\n' +
                   '1)  Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

    throws(function() { S.add(1, -Infinity); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'add :: FiniteNumber -> FiniteNumber -> FiniteNumber\n' +
                   '                       ^^^^^^^^^^^^\n' +
                   '                            1\n' +
                   '\n' +
                   '1)  -Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));
  });

  it('adds two numbers', function() {
    eq(S.add(1, 1), 2);
    eq(S.add(-1, -1), -2);
    eq(S.add(1.5, 1), 2.5);
    eq(S.add(-1.5, -1), -2.5);
  });

});
