'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('slice', function() {

  eq(typeof S.slice, 'function');
  eq(S.slice.length, 3);

  throws(function() { S.slice(0.5); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'slice :: Integer -> Integer -> List a -> Maybe (List a)\n' +
                 '         ^^^^^^^\n' +
                 '            1\n' +
                 '\n' +
                 '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  throws(function() { S.slice(0, [1, 2, 3]); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'slice :: Integer -> Integer -> List a -> Maybe (List a)\n' +
                 '                    ^^^^^^^\n' +
                 '                       1\n' +
                 '\n' +
                 '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  throws(function() { S.slice(0, 0, {length: -1}); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'slice :: Integer -> Integer -> List a -> Maybe (List a)\n' +
                 '                               ^^^^^^\n' +
                 '                                 1\n' +
                 '\n' +
                 '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.slice(6, 1, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.slice(1, 6, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.slice(1, -6, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.slice(-6, 1, [1, 2, 3, 4, 5]), S.Nothing);

  eq(S.slice(1, 1, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.slice(1, -4, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.slice(-4, 1, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.slice(-4, -4, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.slice(0, 0, []), S.Just([]));
  eq(S.slice(0, -0, []), S.Just([]));
  eq(S.slice(-0, 0, []), S.Just([]));
  eq(S.slice(-0, -0, []), S.Just([]));

  eq(S.slice(1, 3, [1, 2, 3, 4, 5]), S.Just([2, 3]));
  eq(S.slice(-3, 5, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
  eq(S.slice(1, -2, [1, 2, 3, 4, 5]), S.Just([2, 3]));

  eq(S.slice(-0, 5, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.slice(2, -0, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
  eq(S.slice(new Number(-0), 5, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.slice(2, new Number(-0), [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));

  eq(S.slice(0, 5, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));

  eq(S.slice(0, -0, 'ramda'), S.Just('ramda'));
  eq(S.slice(1, -3, 'ramda'), S.Just('a'));
  eq(S.slice(2, -3, 'ramda'), S.Just(''));
  eq(S.slice(3, -3, 'ramda'), S.Nothing);

});
