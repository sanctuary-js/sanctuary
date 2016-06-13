'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('allPass', function() {

  eq(typeof S.allPass, 'function');
  eq(S.allPass.length, 2);
  eq(S.allPass.toString(), 'allPass :: Array (a -> Boolean) -> a -> Boolean');

  eq(S.allPass([], 'abacus'), true);
  eq(S.allPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'abacus'), true);
  eq(S.allPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'banana'), false);

  var e = false;
  eq(S.allPass([S.test(/a/), function() { e = true; }], 'monkey'), false);
  eq(e, false);

});
