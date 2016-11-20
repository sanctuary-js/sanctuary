'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('ifElse', function() {

  eq(typeof S.ifElse, 'function');
  eq(S.ifElse.length, 4);

  throws(function() { S.ifElse('wrong'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'ifElse :: Function -> Function -> Function -> a -> b\n' +
         '          ^^^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  "wrong" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.ifElse(S.odd, 'wrong'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'ifElse :: Function -> Function -> Function -> a -> b\n' +
         '                      ^^^^^^^^\n' +
         '                         1\n' +
         '\n' +
         '1)  "wrong" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.ifElse(S.odd, S.dec, 'wrong'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'ifElse :: Function -> Function -> Function -> a -> b\n' +
         '                                  ^^^^^^^^\n' +
         '                                     1\n' +
         '\n' +
         '1)  "wrong" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  eq(S.ifElse(S.odd, S.dec, S.inc, 9), 8);
  eq(S.ifElse(S.odd, S.dec, S.inc, 0), 1);

});
