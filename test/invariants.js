'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('invariants', function() {

  it('f() is equivalent to f for every "regular" function', function() {
    for (var prop in S) {
      if (typeof S[prop] === 'function' && /^(?![A-Z])/.test(prop)) {
        var result = S[prop]();
        eq(typeof result, 'function');
        eq(result.length, S[prop].length);
      }
    }
  });

  it('f(R.__) is equivalent to f for every "regular" function', function() {
    for (var prop in S) {
      if (typeof S[prop] === 'function' && /^(?![A-Z])/.test(prop)) {
        var result = S[prop](R.__);
        eq(typeof result, 'function');
        eq(result.length, S[prop].length);
      }
    }
  });

  it('exported functions throw if applied to too many arguments', function() {
    throws(function() { S.I(1, 2); },
           errorEq(TypeError,
                   '‘I’ requires one argument; received two arguments'));

    throws(function() { S.K(1, 2, 3); },
           errorEq(TypeError,
                   '‘K’ requires two arguments; received three arguments'));

    throws(function() { S.K(1)(2, 3); },
           errorEq(TypeError,
                   '‘K’ requires two arguments; received three arguments'));

    throws(function() { S.K(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); },
           errorEq(TypeError,
                   '‘K’ requires two arguments; received 10 arguments'));
  });

});
