'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem_ = require('./internal/rem_');


test('on_', function() {

  eq(typeof S.on_, 'function');
  eq(S.on_.length, 4);

  eq(S.on_(rem_, S.prop('x'), {x: 5, y: 5}, {x: 3, y: 3}), 2);

});
