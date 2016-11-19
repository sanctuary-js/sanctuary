'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('parseDate', function() {

  eq(typeof S.parseDate, 'function');
  eq(S.parseDate.length, 1);

  throws(function() { S.parseDate([1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'parseDate :: String -> Maybe Date\n' +
                 '             ^^^^^^\n' +
                 '               1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘String’.\n'));

  eq(S.parseDate('2001-02-03T04:05:06Z'), S.Just(new Date('2001-02-03T04:05:06Z')));
  eq(S.parseDate('today'), S.Nothing);

});
