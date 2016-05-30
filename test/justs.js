'use strict';

var assert = require('assert');
var throws = assert.throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('justs', function() {

  it('is a unary function', function() {
    eq(typeof S.justs, 'function');
    eq(S.justs.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.justs({length: 0}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'justs :: Array (Maybe a) -> Array a\n' +
                   '         ^^^^^^^^^^^^^^^\n' +
                   '                1\n' +
                   '\n' +
                   '1)  {"length": 0} :: Object, StrMap Number, StrMap FiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array (Maybe a)’.\n'));
  });

  it('returns a list containing the value of each Just', function() {
    eq(S.justs([]), []);
    eq(S.justs([S.Nothing, S.Nothing]), []);
    eq(S.justs([S.Nothing, S.Just('b')]), ['b']);
    eq(S.justs([S.Just('a'), S.Nothing]), ['a']);
    eq(S.justs([S.Just('a'), S.Just('b')]), ['a', 'b']);
  });

});
