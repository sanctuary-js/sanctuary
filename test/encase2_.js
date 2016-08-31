'use strict';

var R = require('ramda');

var utils = require('./utils');

var eq = utils.eq;
var rem = R.uncurryN(2, utils.rem);
import * as S from '../src'


describe('encase2_', function() {

  it('returns a Just on success', function() {
    eq(S.encase2_(rem, 42, 5), S.Just(2));
  });

  it('returns Nothing on failure', function() {
    eq(S.encase2_(rem, 42, 0), S.Nothing);
  });

});
