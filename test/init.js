'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('init', function() {

  eq(typeof S.init, 'function');
  eq(S.init.length, 1);

  throws(function() { S.init({length: -1}); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'init :: List a -> Maybe (List a)\n' +
         '        ^^^^^^\n' +
         '          1\n' +
         '\n' +
         '1)  {"length": -1} :: Object, StrMap Number, StrMap FiniteNumber, StrMap NonZeroFiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘List a’.\n');

  eq(S.init([]), S.Nothing);
  eq(S.init(['foo']), S.Just([]));
  eq(S.init(['foo', 'bar']), S.Just(['foo']));
  eq(S.init(['foo', 'bar', 'baz']), S.Just(['foo', 'bar']));

});
