'use strict';

var throws = require('assert').throws;

var errorEq = require('./utils').errorEq;
var eq = require('./utils').eq;
var S = require('..');


describe('prepend', function() {

  it('is a binary function', function() {
    eq(typeof S.prepend, 'function');
    eq(S.prepend.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.prepend('a', 'bc'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'prepend :: a -> Array a -> Array a\n' +
                   '                ^^^^^^^\n' +
                   '                   1\n' +
                   '\n' +
                   '1)  "bc" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array a’.\n'));

    throws(function() { S.prepend('1', [2, 3]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'prepend :: a -> Array a -> Array a\n' +
                   '           ^          ^\n' +
                   '           1          2\n' +
                   '\n' +
                   '1)  "1" :: String\n' +
                   '\n' +
                   '2)  2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '    3 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it('prepends an element to an array', function() {
    eq(S.prepend(1, []), [1]);
    eq(S.prepend(1, [2, 3]), [1, 2, 3]);
    eq(S.prepend([1, 2], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);
  });

  it('is curried', function() {
    eq(S.prepend(1).length, 1);
    eq(S.prepend(1)([2, 3]), [1, 2, 3]);
  });

});
