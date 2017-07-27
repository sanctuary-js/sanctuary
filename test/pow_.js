'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('pow_', function() {

  eq(typeof S.pow_, 'function');
  eq(S.pow_.length, 2);
  eq(S.pow_.toString(), 'pow_ :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq(S.pow_(8, 2), 64);
  eq(S.map(S.pow_(10), [0, 1, 2, 3]), [1, 10, 100, 1000]);
  eq(S.map(S.pow_(10), [-3, -2, -1]), [0.001, 0.01, 0.1]);

});
