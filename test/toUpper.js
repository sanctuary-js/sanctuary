'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('toUpper', function() {

  it('is a unary function', function() {
    eq(typeof S.toUpper, 'function');
    eq(S.toUpper.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.toUpper(true); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'toUpper :: String -> String\n' +
                   '           ^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  true :: Boolean\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('returns the upper-case equivalent of its argument', function() {
    eq(S.toUpper(''), '');
    eq(S.toUpper('ABC def 123'), 'ABC DEF 123');
    eq(S.toUpper(new String('')), '');
    eq(S.toUpper(new String('ABC def 123')), 'ABC DEF 123');
  });

});
