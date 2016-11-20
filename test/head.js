'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('head', function() {

  eq(typeof S.head, 'function');
  eq(S.head.length, 1);

  throws(function() { S.head({length: -1}); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'head :: List a -> Maybe a\n' +
         '        ^^^^^^\n' +
         '          1\n' +
         '\n' +
         '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘List a’.\n');

  eq(S.head([]), S.Nothing);
  eq(S.head(['foo']), S.Just('foo'));
  eq(S.head(['foo', 'bar']), S.Just('foo'));
  eq(S.head(['foo', 'bar', 'baz']), S.Just('foo'));

});
