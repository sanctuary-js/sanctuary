'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem_ = require('./internal/rem_');


describe('encaseEither2_', function() {

  it('returns a Right on success', function() {
    eq(S.encaseEither2_(S.I, rem_, 42, 5), S.Right(2));
  });

  it('returns a Left on failure', function() {
    eq(S.encaseEither2_(S.I, rem_, 42, 0), S.Left(new Error('Cannot divide by zero')));
  });

  it('applies the first argument to the Error', function() {
    eq(S.encaseEither2_(S.prop('message'), rem_, 42, 0), S.Left('Cannot divide by zero'));
  });

});
