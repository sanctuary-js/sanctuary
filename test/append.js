'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('append', function() {

  it('is a binary function', function() {
    eq(typeof S.append, 'function');
    eq(S.append.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.append('c', 'ab'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'append :: a -> Array a -> Array a\n' +
                   '               ^^^^^^^\n' +
                   '                  1\n' +
                   '\n' +
                   '1)  "ab" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array a’.\n'));

    throws(function() { S.append('3', [1, 2]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'append :: a -> Array a -> Array a\n' +
                   '          ^          ^\n' +
                   '          1          2\n' +
                   '\n' +
                   '1)  "3" :: String\n' +
                   '\n' +
                   '2)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '    2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it('appends an element to an array', function() {
    eq(S.append(3, []), [3]);
    eq(S.append(3, [1, 2]), [1, 2, 3]);
    eq(S.append([5, 6], [[1, 2], [3, 4]]), [[1, 2], [3, 4], [5, 6]]);
  });

});
