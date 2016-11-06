'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('eitherToMaybe', function() {

  it('is a unary function', function() {
    eq(typeof S.eitherToMaybe, 'function');
    eq(S.eitherToMaybe.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.eitherToMaybe(/XXX/); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'eitherToMaybe :: Either a b -> Maybe b\n' +
                   '                 ^^^^^^^^^^\n' +
                   '                     1\n' +
                   '\n' +
                   '1)  /XXX/ :: RegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Either a b’.\n'));
  });

  it('returns Nothing when applied to a Left', function() {
    eq(S.eitherToMaybe(S.Left('Cannot divide by zero')), S.Nothing);
  });

  it('returns a Just when applied to a Right', function() {
    eq(S.eitherToMaybe(S.Right(42)), S.Just(42));
  });

});
