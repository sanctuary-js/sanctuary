'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('not', function() {

  it('is a unary function', function() {
    eq(typeof S.not, 'function');
    eq(S.not.length, 1);
  });

  it('can be applied to Booleans', function() {
    eq(S.not(false), true);
    eq(S.not(true), false);
    eq(S.not(new Boolean(false)), true);
    eq(S.not(new Boolean(true)), false);
  });

  it('throws when applied to a non-Boolean value', function() {
    throws(function() { S.not(0); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'not :: Boolean -> Boolean\n' +
                   '       ^^^^^^^\n' +
                   '          1\n' +
                   '\n' +
                   '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Boolean’.\n'));
  });

});
