'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


suite('invariants', function() {

  test('f() is equivalent to f for every "regular" function', function() {
    for (var prop in S) {
      if (typeof S[prop] === 'function' && /^(?![A-Z])/.test(prop)) {
        var result = S[prop]();
        eq(typeof result, 'function');
        eq(result.length, S[prop].length);
      }
    }
  });

  test('f(R.__) is equivalent to f for every "regular" function', function() {
    for (var prop in S) {
      if (typeof S[prop] === 'function' && /^(?![A-Z])/.test(prop)) {
        var result = S[prop](R.__);
        eq(typeof result, 'function');
        eq(result.length, S[prop].length);
      }
    }
  });

  test('exported functions throw if applied to too many arguments', function() {
    throws(function() { S.I(1, 2); },
           TypeError,
           '‘I’ requires one argument; received two arguments');

    throws(function() { S.K(1, 2, 3); },
           TypeError,
           '‘K’ requires two arguments; received three arguments');

    throws(function() { S.K(1)(2, 3); },
           TypeError,
           '‘K’ requires two arguments; received three arguments');

    throws(function() { S.K(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); },
           TypeError,
           '‘K’ requires two arguments; received 10 arguments');
  });

});
