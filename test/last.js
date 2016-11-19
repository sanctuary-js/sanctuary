'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('last', function() {

  eq(typeof S.last, 'function');
  eq(S.last.length, 1);

  throws(function() { S.last({length: -1}); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'last :: List a -> Maybe a\n' +
                 '        ^^^^^^\n' +
                 '          1\n' +
                 '\n' +
                 '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.last([]), S.Nothing);
  eq(S.last(['foo']), S.Just('foo'));
  eq(S.last(['foo', 'bar']), S.Just('bar'));
  eq(S.last(['foo', 'bar', 'baz']), S.Just('baz'));

});
