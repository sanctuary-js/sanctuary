'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('sub_', function() {

  eq(typeof S.sub_, 'function');
  eq(S.sub_.length, 2);
  eq(S.sub_.toString(), 'sub_ :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq(S.sub_(1, 1), 0);
  eq(S.sub_(-1, -1), 0);
  eq(S.sub_(7.5, 2), 5.5);
  eq(S.sub_(-7.5, -2), -5.5);

});
