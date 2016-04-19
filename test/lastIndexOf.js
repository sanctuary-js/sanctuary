'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('lastIndexOf', function() {

  it('is a binary function', function() {
    eq(typeof S.lastIndexOf, 'function');
    eq(S.lastIndexOf.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.lastIndexOf('x', null); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'lastIndexOf :: ArrayLike b => a -> b -> Maybe Integer\n' +
                   '               ^^^^^^^^^^^         ^\n' +
                   '                                   1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   '‘lastIndexOf’ requires ‘b’ to satisfy the ArrayLike type-class constraint; the value at position 1 does not.\n'));
  });

  it('returns a Nothing for an empty list', function() {
    eq(S.lastIndexOf('a', []), S.Nothing());
  });

  it('returns a Nothing if the element is not found', function() {
    eq(S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a']), S.Nothing());
  });

  it('returns Just the last index of the element found', function() {
    eq(S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a']), S.Just(5));
  });

  it('can operate on strings', function() {
    eq(S.lastIndexOf('an', 'banana'), S.Just(3));
    eq(S.lastIndexOf('ax', 'banana'), S.Nothing());
  });

  it('is curried', function() {
    eq(S.lastIndexOf('c').length, 1);
    eq(S.lastIndexOf('c')(['a', 'b', 'c', 'd', 'e']), S.Just(2));
  });

});
