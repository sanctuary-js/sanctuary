'use strict';

var S = require('..');

var eq = require('./internal/eq');
var rem_ = require('./internal/rem_');


test('encase2_', function() {

  eq(typeof S.encase2_, 'function');
  eq(S.encase2_.length, 3);

  eq(S.encase2_(rem_, 42, 5), S.Just(2));
  eq(S.encase2_(rem_, 42, 0), S.Nothing);

});
