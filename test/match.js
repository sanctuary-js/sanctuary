'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('match', function() {

  eq(typeof S.match, 'function');
  eq(S.match.length, 2);

  throws(function() { S.match([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'match :: RegExp -> String -> Maybe (Array (Maybe String))\n' +
         '         ^^^^^^\n' +
         '           1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘RegExp’.\n');

  throws(function() { S.match(/(?:)/, [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'match :: RegExp -> String -> Maybe (Array (Maybe String))\n' +
         '                   ^^^^^^\n' +
         '                     1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  eq(S.match(/abcd/, 'abcdefg'), S.Just([S.Just('abcd')]));
  eq(S.match(/[a-z]a/g, 'bananas'), S.Just([S.Just('ba'), S.Just('na'), S.Just('na')]));
  eq(S.match(/(good)?bye/, 'goodbye'), S.Just([S.Just('goodbye'), S.Just('good')]));
  eq(S.match(/(good)?bye/, 'bye'), S.Just([S.Just('bye'), S.Nothing]));
  eq(S.match(/zzz/, 'abcdefg'), S.Nothing);

});
