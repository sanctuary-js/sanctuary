'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('reduce_', function() {

  eq(typeof S.reduce_, 'function');
  eq(S.reduce_.length, 3);

  eq(S.reduce_(function(a, b) { return a + b; }, 0, []), 0);
  eq(S.reduce_(function(a, b) { return a + b; }, 0, [1, 2, 3, 4, 5]), 15);
  eq(S.reduce_(function(a, b) { return a + b; }, 10, S.Just(5)), 15);

});
