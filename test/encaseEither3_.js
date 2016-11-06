'use strict';

var S = require('..');

var area_ = require('./internal/area_');
var eq = require('./internal/eq');


describe('encaseEither3_', function() {

  it('returns a Right on success', function() {
    eq(S.encaseEither3_(S.I, area_, 3, 4, 5), S.Right(6));
  });

  it('returns a Left on failure', function() {
    eq(S.encaseEither3_(S.I, area_, 2, 2, 5), S.Left(new Error('Impossible triangle')));
  });

  it('applies the first argument to the Error', function() {
    eq(S.encaseEither3_(S.prop('message'), area_, 2, 2, 5), S.Left('Impossible triangle'));
  });

});
