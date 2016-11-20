'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('reduce', function() {

  eq(typeof S.reduce, 'function');
  eq(S.reduce.length, 3);

  throws(function() { S.reduce('xxx'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'reduce :: Foldable b => Function -> a -> b -> a\n' +
         '                        ^^^^^^^^\n' +
         '                           1\n' +
         '\n' +
         '1)  "xxx" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(S.reduce(S.add, 0, []), 0);
  eq(S.reduce(S.add, 0, [1, 2, 3, 4, 5]), 15);
  eq(S.reduce(S.add, 10, S.Just(5)), 15);
  eq(S.reduce(S.lift2(S.add), S.Just(0), [S.Just(1), S.Just(2), S.Just(3), S.Just(4), S.Just(5)]), S.Just(15));

});
