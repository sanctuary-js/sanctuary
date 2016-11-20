'use strict';

var S = require('..');

var area = require('./internal/area');
var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('encase3', function() {

  eq(typeof S.encase3, 'function');
  eq(S.encase3.length, 4);

  throws(function() { S.encase3([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'encase3 :: Function -> a -> b -> c -> Maybe d\n' +
         '           ^^^^^^^^\n' +
         '              1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(S.encase3(area, 3, 4, 5), S.Just(6));
  eq(S.encase3(area, 2, 2, 5), S.Nothing);

});
