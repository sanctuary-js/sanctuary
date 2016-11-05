'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('allPass', function() {

  it('is a binary function', function() {
    eq(typeof S.allPass, 'function');
    eq(S.allPass.length, 2);
  });

  it('type checks its arguments', function() {
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
  });

  it('returns true when given an empty array of predicates', function() {
    eq(S.allPass([], 'quiessence'), true);
  });

  it('returns true when all predicates pass', function() {
    eq(S.allPass([S.test(/q/), S.test(/u/), S.test(/i/), S.test(/c/)], 'quiessence'), true);
  });

  it('returns false when some predicates fail', function() {
    eq(S.allPass([S.test(/q/), S.test(/u/), S.test(/i/), S.test(/c/)], 'quintessential'), false);
    eq(S.allPass([S.test(/q/), S.test(/u/), S.test(/i/), S.test(/c/)], 'incandescent'), false);
    eq(S.allPass([S.test(/q/), S.test(/u/), S.test(/i/), S.test(/c/)], 'fissiparous'), false);
  });

  it('returns false when all predicates fail', function() {
    eq(S.allPass([S.test(/q/), S.test(/u/), S.test(/i/), S.test(/c/)], 'empathy'), false);
  });

  it('short-circuits when one predicate fails', function() {
    var evaluated = false;
    var evaluate = function() { evaluated = true; };

    eq(S.allPass([S.test(/q/), S.test(/u/), S.test(/i/), evaluate], 'incandescent'), false);
    eq(evaluated, false);
  });

});
