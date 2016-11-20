'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem = require('./internal/rem');
var throws = require('./internal/throws');


test('encase2', function() {

  eq(typeof S.encase2, 'function');
  eq(S.encase2.length, 3);

  throws(function() { S.encase2([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'encase2 :: Function -> a -> b -> Maybe c\n' +
         '           ^^^^^^^^\n' +
         '              1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(S.encase2(rem, 42, 5), S.Just(2));
  eq(S.encase2(rem, 42, 0), S.Nothing);

});
