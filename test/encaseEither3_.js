'use strict';

var R = require('ramda');
var utils = require('./utils');

var area = R.uncurryN(3, utils.area);
var eq = utils.eq;
import * as S from '../src'


describe('encaseEither3_', function() {

  it('returns a Right on success', function() {
    eq(S.encaseEither3_(S.I, area, 3, 4, 5), S.Right(6));
  });

  it('returns a Left on failure', function() {
    eq(S.encaseEither3_(S.I, area, 2, 2, 5),
       S.Left(new Error('Impossible triangle')));
  });

  it('applies the first argument to the Error', function() {
    eq(S.encaseEither3_(S.prop('message'), area, 2, 2, 5),
       S.Left('Impossible triangle'));
  });

});
