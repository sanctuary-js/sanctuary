'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('pluck', function() {

  eq(typeof S.pluck, 'function');
  eq(S.pluck.length, 2);

  throws(function() { S.pluck('a', [null]); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'pluck :: Accessible a => String -> Array a -> Array b\n' +
         '         ^^^^^^^^^^^^                    ^\n' +
         '                                         1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         '‘pluck’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n');

  throws(function() { S.pluck([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'pluck :: Accessible a => String -> Array a -> Array b\n' +
         '                         ^^^^^^\n' +
         '                           1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  throws(function() { S.pluck('x', {length: 0}); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'pluck :: Accessible a => String -> Array a -> Array b\n' +
         '                                   ^^^^^^^\n' +
         '                                      1\n' +
         '\n' +
         '1)  {"length": 0} :: Object, StrMap Number, StrMap FiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Array a’.\n');

  throws(function() { S.pluck('a', [true]); },
         TypeError,
         '‘pluck’ expected object at index 0 to have a property named ‘a’; true does not');

  throws(function() { S.pluck('a', [{a: 1}, {b: 2}]); },
         TypeError,
         '‘pluck’ expected object at index 1 to have a property named ‘a’; {"b": 2} does not');

  eq(S.pluck('x', []), []);
  eq(S.pluck('x', [{x: 1}, {x: 2}, {x: 3}]), [1, 2, 3]);

});
