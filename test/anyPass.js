'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('anyPass', function() {

  eq(typeof S.anyPass, 'function');
  eq(S.anyPass.length, 2);

  throws(function() { S.anyPass('wrong'); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'anyPass :: Array Function -> a -> Boolean\n' +
         '           ^^^^^^^^^^^^^^\n' +
         '                 1\n' +
         '\n' +
         '1)  "wrong" :: String\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Array Function’.\n');

  eq(S.anyPass([], 'narwhal'), false);
  eq(S.anyPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'narwhal'), true);
  eq(S.anyPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'gorilla'), true);

  var e = false;
  eq(S.anyPass([S.test(/a/), function() { e = true; }], 'narwhal'), true);
  eq(e, false);

});
