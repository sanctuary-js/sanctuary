'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem_ = require('./internal/rem_');


describe('on_', function() {

  it('is a quaternary function', function() {
    eq(typeof S.on_, 'function');
    eq(S.on_.length, 4);
  });

  it('passes the last two arguments through the modifying function into the converging function', function() {
    eq(S.on_(rem_, S.prop('x'), {x: 5, y: 5}, {x: 3, y: 3}), 2);
  });

});
