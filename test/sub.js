'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('sub', function() {

  eq(typeof S.sub, 'function');
  eq(S.sub.length, 2);
  eq(S.sub.toString(), 'sub :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq(S.sub(1, 1), 0);
  eq(S.sub(-1, -1), 0);
  eq(S.sub(7.5, 2), 5.5);
  eq(S.sub(-7.5, -2), -5.5);

});
