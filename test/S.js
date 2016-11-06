'use strict';

var S = require('..');

var eq = require('./internal/eq');


describe('S', function() {

  it('is a ternary function', function() {
    eq(typeof S.C, 'function');
    eq(S.C.length, 3);
  });

  it('S(f, g, x) is equivalent to f(x)(g(x))', function() {
    eq(S.S(S.add, Math.sqrt, 100), 110);
  });

});
