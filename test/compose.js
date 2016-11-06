'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');


describe('compose', function() {

  it('is a ternary function', function() {
    eq(typeof S.compose, 'function');
    eq(S.compose.length, 3);
  });

  it('composes two functions assumed to be unary', function() {
    eq(S.compose(R.map(Math.sqrt), JSON.parse, '[1, 4, 9]'), [1, 2, 3]);
  });

});
