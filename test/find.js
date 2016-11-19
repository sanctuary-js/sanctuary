'use strict';

var throws = require('assert').throws;

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('find', function() {

  eq(typeof S.find, 'function');
  eq(S.find.length, 2);

  throws(function() { S.find([1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'find :: Function -> Array a -> Maybe a\n' +
                 '        ^^^^^^^^\n' +
                 '           1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Function’.\n'));

  throws(function() { S.find(R.T, null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'find :: Function -> Array a -> Maybe a\n' +
                 '                    ^^^^^^^\n' +
                 '                       1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Array a’.\n'));

  eq(S.find(S.even, []), S.Nothing);
  eq(S.find(S.even, [1, 3, 5, 7, 9]), S.Nothing);
  eq(S.find(S.even, [1, 2, 3, 4, 5]), S.Just(2));

});
