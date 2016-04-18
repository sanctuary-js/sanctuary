'use strict';

var R = require('ramda');
var utils = require('./utils');

var area = R.uncurryN(3, utils.area);
var eq = utils.eq;
var S = require('..');


describe('encase3_', function() {

  it('returns a Just on success', function() {
    eq(S.encase3_(area, 3, 4, 5), S.Just(6));
  });

  it('returns a Nothing on failure', function() {
    eq(S.encase3_(area, 2, 2, 5), S.Nothing());
  });

});
