'use strict';

var vm = require('vm');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('gets', function() {

  eq(typeof S.gets, 'function');
  eq(S.gets.length, 3);

  throws(function() { S.gets([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'gets :: Accessible a => Function -> Array String -> a -> Maybe c\n' +
         '                        ^^^^^^^^\n' +
         '                           1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.gets(S.is(Number), null); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'gets :: Accessible a => Function -> Array String -> a -> Maybe c\n' +
         '                                    ^^^^^^^^^^^^\n' +
         '                                         1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Array String’.\n');

  throws(function() { S.gets(S.is(Number), [], null); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'gets :: Accessible a => Function -> Array String -> a -> Maybe c\n' +
         '        ^^^^^^^^^^^^                                ^\n' +
         '                                                    1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         '‘gets’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n');

  eq(S.gets(S.is(Number), ['x'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Number), ['y'], {x: {z: 0}, y: 42}), S.Just(42));
  eq(S.gets(S.is(Number), ['z'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Number), ['x', 'z'], {x: {z: 0}, y: 42}), S.Just(0));
  eq(S.gets(S.is(Number), ['a', 'b', 'c'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Number), [], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Object), [], {x: {z: 0}, y: 42}), S.Just({x: {z: 0}, y: 42}));

  eq(S.gets(S.is(RegExp), ['x'], {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
  eq(S.gets(S.is(vm.runInNewContext('RegExp')), ['x'], {x: /.*/}), S.Just(/.*/));

});
