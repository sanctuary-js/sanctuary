'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('at', function() {

  eq(typeof S.at, 'function');
  eq(S.at.length, 2);

  throws(function() { S.at(0.5); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'at :: Integer -> List a -> Maybe a\n' +
                 '      ^^^^^^^\n' +
                 '         1\n' +
                 '\n' +
                 '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  throws(function() { S.at(0, null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'at :: Integer -> List a -> Maybe a\n' +
                 '                 ^^^^^^\n' +
                 '                   1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.at(-4, ['foo', 'bar', 'baz']), S.Nothing);
  eq(S.at(-3, ['foo', 'bar', 'baz']), S.Just('foo'));
  eq(S.at(-2, ['foo', 'bar', 'baz']), S.Just('bar'));
  eq(S.at(-1, ['foo', 'bar', 'baz']), S.Just('baz'));
  eq(S.at(-0, ['foo', 'bar', 'baz']), S.Nothing);

  eq(S.at(0, ['foo', 'bar', 'baz']), S.Just('foo'));
  eq(S.at(1, ['foo', 'bar', 'baz']), S.Just('bar'));
  eq(S.at(2, ['foo', 'bar', 'baz']), S.Just('baz'));
  eq(S.at(3, ['foo', 'bar', 'baz']), S.Nothing);

});
