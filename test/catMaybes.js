'use strict';

var assert = require('assert');
var throws = assert.throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('catMaybes', function() {

  it('is a unary function', function() {
    eq(typeof S.catMaybes, 'function');
    eq(S.catMaybes.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.catMaybes({length: 0}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'catMaybes :: Array (Maybe a) -> Array a\n' +
                   '             ^^^^^^^^^^^^^^^\n' +
                   '                    1\n' +
                   '\n' +
                   '1)  {"length": 0} :: Object, StrMap Number, StrMap FiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array (Maybe a)’.\n'));
  });

  it('returns a list containing the value of each Just', function() {
    eq(S.catMaybes([]), []);
    eq(S.catMaybes([S.Nothing(), S.Nothing()]), []);
    eq(S.catMaybes([S.Nothing(), S.Just('b')]), ['b']);
    eq(S.catMaybes([S.Just('a'), S.Nothing()]), ['a']);
    eq(S.catMaybes([S.Just('a'), S.Just('b')]), ['a', 'b']);
  });

});
