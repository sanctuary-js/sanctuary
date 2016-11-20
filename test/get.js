'use strict';

var vm = require('vm');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('get', function() {

  eq(typeof S.get, 'function');
  eq(S.get.length, 3);

  throws(function() { S.get([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'get :: Accessible a => TypeRep -> String -> a -> Maybe b\n' +
         '                       ^^^^^^^\n' +
         '                          1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘TypeRep’.\n');

  throws(function() { S.get(Number, [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'get :: Accessible a => TypeRep -> String -> a -> Maybe b\n' +
         '                                  ^^^^^^\n' +
         '                                    1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  throws(function() { S.get(Number, 'x', null); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'get :: Accessible a => TypeRep -> String -> a -> Maybe b\n' +
         '       ^^^^^^^^^^^^                         ^\n' +
         '                                            1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         '‘get’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n');

  eq(S.get(Number, 'x', {x: 0, y: 42}), S.Just(0));
  eq(S.get(Number, 'y', {x: 0, y: 42}), S.Just(42));
  eq(S.get(Number, 'z', {x: 0, y: 42}), S.Nothing);
  eq(S.get(String, 'x', {x: 0, y: 42}), S.Nothing);

  eq(S.get(RegExp, 'x', {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
  eq(S.get(vm.runInNewContext('RegExp'), 'x', {x: /.*/}), S.Just(/.*/));

});
