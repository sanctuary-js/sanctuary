'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');
var factorial = require('./internal/factorial');


describe('encaseEither', function() {

  it('is a ternary function', function() {
    eq(typeof S.encaseEither, 'function');
    eq(S.encaseEither.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.encaseEither(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'encaseEither :: Function -> Function -> a -> Either l r\n' +
                   '                ^^^^^^^^\n' +
                   '                   1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.encaseEither(S.I, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'encaseEither :: Function -> Function -> a -> Either l r\n' +
                   '                            ^^^^^^^^\n' +
                   '                               1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('returns a Right on success', function() {
    eq(S.encaseEither(S.I, factorial, 5), S.Right(120));
  });

  it('returns a Left on failure', function() {
    eq(S.encaseEither(S.I, factorial, -1), S.Left(new Error('Cannot determine factorial of negative number')));
  });

  it('applies the first argument to the Error', function() {
    eq(S.encaseEither(S.prop('message'), factorial, -1), S.Left('Cannot determine factorial of negative number'));
  });

  it('can be applied to a function of arbitrary arity', function() {
    eq(S.encaseEither(S.I, function(a, b, c, d) { return a; }, 42), S.Right(42));
  });

});
