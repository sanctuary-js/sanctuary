'use strict';

var eq = require('./utils').eq;
import * as S from '../src'

var add = function(a, b) { return a + b; };

describe('reduce_', function() {

  it('folds over lists with the supplied uncurried accumulator', function() {
    eq(S.reduce_(add, 0, [1, 2, 3, 4, 5]), 15);
    eq(S.reduce_(add, 0, []), 0);
  });

  it('dispatches to a "reduce" method if present', function() {
    eq(S.reduce_(add, 10, S.Just(5)), 15);
  });

});
