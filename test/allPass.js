'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('allPass', function() {

  eq(typeof S.allPass, 'function');
  eq(S.allPass.length, 2);

  throws(function() { S.allPass('wrong'); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'allPass :: Array Function -> a -> Boolean\n' +
                 '           ^^^^^^^^^^^^^^\n' +
                 '                 1\n' +
                 '\n' +
                 '1)  "wrong" :: String\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Array Function’.\n'));

  eq(S.allPass([], 'abacus'), true);
  eq(S.allPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'abacus'), true);
  eq(S.allPass([S.test(/a/), S.test(/b/), S.test(/c/)], 'banana'), false);

  var e = false;
  eq(S.allPass([S.test(/a/), function() { e = true; }], 'monkey'), false);
  eq(e, false);

});
