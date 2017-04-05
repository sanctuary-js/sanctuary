'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


//  pow :: Number -> Number -> Number
var pow = function(exp) {
  return function(n) {
    return Math.pow(n, exp);
  };
};


describe('zipWith', function() {

  it('is a ternary function', function() {
    eq(typeof S.zipWith, 'function');
    eq(S.zipWith.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.zipWith(['foo', 'bar', 'baz']); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'zipWith :: Function -> Array a -> Array b -> Array c\n' +
                   '           ^^^^^^^^\n' +
                   '              1\n' +
                   '\n' +
                   '1)  ["foo", "bar", "baz"] :: Array String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.zipWith(pow, 42); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'zipWith :: Function -> Array a -> Array b -> Array c\n' +
                   '                       ^^^^^^^\n' +
                   '                          1\n' +
                   '\n' +
                   '1)  42 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array a’.\n'));

    throws(function() { S.zipWith(pow, [], 42); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'zipWith :: Function -> Array a -> Array b -> Array c\n' +
                   '                                  ^^^^^^^\n' +
                   '                                     1\n' +
                   '\n' +
                   '1)  42 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array b’.\n'));
  });

  it('zips two arrays with the specified binary function', function() {
    eq(S.zipWith(pow, [], []), []);
    eq(S.zipWith(pow, [1, 2, 3], []), []);
    eq(S.zipWith(pow, [], [4, 5, 6]), []);
    eq(S.zipWith(pow, [1, 2, 3], [7, 6, 5]), [7, 36, 125]);
    eq(S.zipWith(pow, [1, 2, 3], [7, 6, 5, 4]), [7, 36, 125]);
    eq(S.zipWith(pow, [1, 2, 3, 4], [7, 6, 5]), [7, 36, 125]);

    var expected = [S.Just('f'), S.Just('ba'), S.Just('baz')];
    eq(S.zipWith(S.take, [1, 2, 3], ['foo', 'bar', 'baz']), expected);
    eq(S.zipWith(S.take, [1, 2, 3], ['foo', 'bar', 'baz', 'quux']), expected);
    eq(S.zipWith(S.take, [1, 2, 3, 4], ['foo', 'bar', 'baz']), expected);
  });

  it('is curried', function() {
    eq(S.zipWith(pow).length, 2);
    eq(S.zipWith(pow)([1, 2, 3]).length, 1);
    eq(S.zipWith(pow)([1, 2, 3])([7, 6, 5, 4]), [7, 36, 125]);
  });

});
