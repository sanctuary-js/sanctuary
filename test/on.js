'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem = require('./internal/rem');


describe('on', function() {

  it('is a quaternary function', function() {
    eq(typeof S.on, 'function');
    eq(S.on.length, 4);
  });

  it('passes the last two arguments through the modifying function into the converging function', function() {
    eq(S.on(rem, S.prop('x'), {x: 5, y: 5}, {x: 3, y: 3}), 2);
    eq(S.on(S.concat, S.reverse)([1, 2, 3], [4, 5, 6]), [3, 2, 1, 6, 5, 4]);
  });

});
