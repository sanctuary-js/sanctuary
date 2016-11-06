'use strict';

var S = require('..');

var area_ = require('./internal/area_');
var eq = require('./internal/eq');


describe('encase3_', function() {

  it('returns a Just on success', function() {
    eq(S.encase3_(area_, 3, 4, 5), S.Just(6));
  });

  it('returns Nothing on failure', function() {
    eq(S.encase3_(area_, 2, 2, 5), S.Nothing);
  });

});
