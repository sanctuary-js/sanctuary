'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('maybeToNullable', function() {

  it('is a unary function', function() {
    eq(typeof S.maybeToNullable, 'function');
    eq(S.maybeToNullable.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.maybeToNullable(/XXX/); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'maybeToNullable :: Maybe a -> Nullable a\n' +
                   '                   ^^^^^^^\n' +
                   '                      1\n' +
                   '\n' +
                   '1)  /XXX/ :: RegExp\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));
  });

  it('can be applied to a Nothing', function() {
    eq(S.maybeToNullable(S.Nothing()), null);
  });

  it('can be applied to a Just', function() {
    eq(S.maybeToNullable(S.Just(42)), 42);
  });

});
