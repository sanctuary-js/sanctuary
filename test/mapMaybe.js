'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('mapMaybe', function() {

  eq(typeof S.mapMaybe, 'function');
  eq(S.mapMaybe.length, 2);

  throws(function() { S.mapMaybe([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'mapMaybe :: Function -> Array a -> Array b\n' +
         '            ^^^^^^^^\n' +
         '               1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.mapMaybe(S.head, null); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'mapMaybe :: Function -> Array a -> Array b\n' +
         '                        ^^^^^^^\n' +
         '                           1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Array a’.\n');

  eq(S.mapMaybe(S.head, []), []);
  eq(S.mapMaybe(S.head, [[], [], []]), []);
  eq(S.mapMaybe(S.head, [[1, 2], [3, 4], [5, 6]]), [1, 3, 5]);
  eq(S.mapMaybe(S.head, [[1], [], [3], [], [5], []]), [1, 3, 5]);

});
