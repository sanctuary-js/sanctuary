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
                   'Type-class constraint violation\n' +
                   '\n' +
                   'indexOf :: ArrayLike b => a -> b -> Maybe Integer\n' +
                   '           ^^^^^^^^^^^         ^\n' +
                   '                               1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   '‘indexOf’ requires ‘b’ to satisfy the ArrayLike type-class constraint; the value at position 1 does not.\n'));
  });

  it('returns a Nothing for an empty list', function() {
    eq(S.indexOf(10, []), S.Nothing());
  });

  it('returns a Nothing if the element is not found', function() {
    eq(S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing());
  });

  it('returns Just the index of the element found', function() {
    eq(S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(1));
  });

  it('can operate on strings', function() {
    eq(S.indexOf('an', 'banana'), S.Just(1));
    eq(S.indexOf('ax', 'banana'), S.Nothing());
  });

  it('is curried', function() {
    eq(S.indexOf('c').length, 1);
    eq(S.indexOf('c')(['a', 'b', 'c', 'd', 'e']), S.Just(2));
  });

});
