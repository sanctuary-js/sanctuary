'use strict';

var S = require('..');

var eq = require('./internal/eq');


describe('reduce_', function() {

  it('folds over lists with the supplied uncurried accumulator', function() {
    eq(S.reduce_(function(a, b) { return a + b; }, 0, [1, 2, 3, 4, 5]), 15);
    eq(S.reduce_(function(a, b) { return a + b; }, 0, []), 0);
  });

  it('dispatches to a "reduce" method if present', function() {
    eq(S.reduce_(function(a, b) { return a + b; }, 10, S.Just(5)), 15);
  });

});
