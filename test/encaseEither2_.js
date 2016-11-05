'use strict';

var R = require('ramda');
var utils = require('./utils');

var eq = utils.eq;
var rem = R.uncurryN(2, utils.rem);
var S = require('..');


describe('encaseEither2_', function() {

  it('returns a Right on success', function() {
    eq(S.encaseEither2_(S.I, rem, 42, 5), S.Right(2));
  });

  it('returns a Left on failure', function() {
    eq(S.encaseEither2_(S.I, rem, 42, 0), S.Left(new Error('Cannot divide by zero')));
  });

  it('applies the first argument to the Error', function() {
    eq(S.encaseEither2_(S.prop('message'), rem, 42, 0), S.Left('Cannot divide by zero'));
  });

});
