'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('indexOf', function() {

  it('is a binary function', function() {
    eq(typeof S.indexOf, 'function');
    eq(S.indexOf.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.indexOf('x', null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'indexOf :: a -> List a -> Maybe Integer\n' +
                   '                ^^^^^^\n' +
                   '                  1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘List a’.\n'));
  });

  it('returns Nothing for an empty list', function() {
    eq(S.indexOf(10, []), S.Nothing);
  });

  it('returns Nothing if the element is not found', function() {
    eq(S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing);
  });

  it('returns Just the index of the element found', function() {
    eq(S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(1));
  });

  it('can operate on strings', function() {
    eq(S.indexOf('an', 'banana'), S.Just(1));
    eq(S.indexOf('ax', 'banana'), S.Nothing);
  });

});
