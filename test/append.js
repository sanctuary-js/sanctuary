'use strict';

var throws = require('assert').throws;

var errorEq = require('./utils').errorEq;
var eq = require('./utils').eq;
var S = require('..');


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

     throws(function() { S.append('c', [1, 2]); },
            errorEq(TypeError,
                    'Type-variable constraint violation\n' +
                    '\n' +
                    'append :: a -> Array a -> Array a\n' +
                    '          ^          ^\n' +
                    '          1          2\n' +
                    '\n' +
                    '1)  "c" :: String\n' +
                    '\n' +
                    '2)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                    '    2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                    '\n' +
                    'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
   });

  it('adds the element to the end of the list', function() {
    eq(S.append('c', ['a', 'b']), ['a', 'b', 'c']);
    eq(S.append({x: 3}, [{x: 1}, {x: 2}]), [{x: 1}, {x: 2}, {x: 3}]);
  });

  it('adds a list to a list of lists', function() {
    eq(S.append([3, 4], [[1], [2]]), [[1], [2], [3, 4]]);
  });

  it('works on empty list', function() {
    eq(S.append(1, []), [1]);
  });

  it('is curried', function() {
    eq(S.append('c').length, 1);
    eq(S.append('c')(['a', 'b']), ['a', 'b', 'c']);
  });

});
