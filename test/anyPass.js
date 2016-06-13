'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('anyPass', function() {

  eq(typeof S.anyPass, 'function');
  eq(S.anyPass.length, 2);
  eq(S.anyPass.toString(), 'anyPass :: Array (a -> Boolean) -> a -> Boolean');

  eq(S.anyPass([], 'narwhal'), false);
  eq(S.anyPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'narwhal'), true);
  eq(S.anyPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'gorilla'), true);

  var e = false;
  eq(S.anyPass([S.test(/a/), function() { e = true; }], 'narwhal'), true);
  eq(e, false);

});
