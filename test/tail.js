'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('tail', function() {

  eq(typeof S.tail, 'function');
  eq(S.tail.length, 1);

  throws(function() { S.tail({length: -1}); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'tail :: List a -> Maybe (List a)\n' +
                 '        ^^^^^^\n' +
                 '          1\n' +
                 '\n' +
                 '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.tail([]), S.Nothing);
  eq(S.tail(['foo']), S.Just([]));
  eq(S.tail(['foo', 'bar']), S.Just(['bar']));
  eq(S.tail(['foo', 'bar', 'baz']), S.Just(['bar', 'baz']));

});
