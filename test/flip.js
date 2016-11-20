'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('flip', function() {

  eq(typeof S.flip, 'function');
  eq(S.flip.length, 3);

  throws(function() { S.flip('wrong'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'flip :: Function -> b -> a -> c\n' +
         '        ^^^^^^^^\n' +
         '           1\n' +
         '\n' +
         '1)  "wrong" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(R.map(S.flip(Math.pow)(2), [1, 2, 3, 4, 5]), [1, 4, 9, 16, 25]);
  eq(S.flip(S.indexOf, ['a', 'b', 'c', 'd'], 'c'), S.Just(2));

});
