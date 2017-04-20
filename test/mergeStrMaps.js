'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('mergeStrMaps', function() {

  it('is a unnary function', function() {
    eq(typeof S.mergeStrMaps, 'function');
    eq(S.mergeStrMaps.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.mergeStrMaps([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'mergeStrMaps :: Array (StrMap a) -> StrMap a\n' +
                   '                      ^^^^^^^^^^\n' +
                   '                          1\n' +
                   '\n' +
                   '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘StrMap a’.\n'));

    throws(function() { S.mergeStrMaps([{a: '1'}, {b: 2}]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'mergeStrMaps :: Array (StrMap a) -> StrMap a\n' +
                   '                              ^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  "1" :: String\n' +
                   '    2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it('should merge an array of string maps', function() {
    eq(S.mergeStrMaps([{}, {}]), {});
    eq(S.mergeStrMaps([{}, {a: 1}]), {a: 1});
    eq(S.mergeStrMaps([{a: 1}, {b: 2}]), {a: 1, b: 2});
    eq(S.mergeStrMaps([{a: 1}, {b: 2}, {c: 3, d: 4}]), {a: 1, b: 2, c: 3, d: 4});
  });

  it('should give precedence to later string maps in the array', function() {
    eq(S.mergeStrMaps([{a: 1}, {b: 2}, {b: 3, c: 4}]), {a: 1, b: 3, c: 4});
  });

});
