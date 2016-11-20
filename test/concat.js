'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('concat', function() {

  eq(typeof S.concat, 'function');
  eq(S.concat.length, 2);

  throws(function() { S.concat(/XXX/); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'concat :: Semigroup a => a -> a -> a\n' +
         '          ^^^^^^^^^^^    ^\n' +
         '                         1\n' +
         '\n' +
         '1)  /XXX/ :: RegExp\n' +
         '\n' +
         '‘concat’ requires ‘a’ to satisfy the Semigroup type-class constraint; the value at position 1 does not.\n');

  throws(function() { S.concat('abc', [1, 2, 3]); },
         TypeError,
         'Type-variable constraint violation\n' +
         '\n' +
         'concat :: Semigroup a => a -> a -> a\n' +
         '                         ^    ^\n' +
         '                         1    2\n' +
         '\n' +
         '1)  "abc" :: String\n' +
         '\n' +
         '2)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n');

  eq(S.concat([], []), []);
  eq(S.concat([1, 2, 3], []), [1, 2, 3]);
  eq(S.concat([], [4, 5, 6]), [4, 5, 6]);
  eq(S.concat([1, 2, 3], [4, 5, 6]), [1, 2, 3, 4, 5, 6]);

  eq(S.concat('', ''), '');
  eq(S.concat('foo', ''), 'foo');
  eq(S.concat('', 'bar'), 'bar');
  eq(S.concat('foo', 'bar'), 'foobar');

  eq(S.concat(S.Nothing, S.Nothing), S.Nothing);
  eq(S.concat(S.Just('foo'), S.Nothing), S.Just('foo'));
  eq(S.concat(S.Nothing, S.Just('bar')), S.Just('bar'));
  eq(S.concat(S.Just('foo'), S.Just('bar')), S.Just('foobar'));

  eq(S.concat(S.Left('abc'), S.Left('def')), S.Left('abcdef'));
  eq(S.concat(S.Right([1, 2, 3]), S.Left('def')), S.Right([1, 2, 3]));
  eq(S.concat(S.Left('abc'), S.Right([4, 5, 6])), S.Right([4, 5, 6]));
  eq(S.concat(S.Right([1, 2, 3]), S.Right([4, 5, 6])), S.Right([1, 2, 3, 4, 5, 6]));

});
