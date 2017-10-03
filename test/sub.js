'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('sub', function() {

  eq(typeof S.sub, 'function');
  eq(S.sub.length, 2);
  eq(S.sub.toString(), 'sub :: FiniteNumber -> FiniteNumber -> FiniteNumber');

  eq(S.map(S.sub(1), [1, 2, 3]), [0, 1, 2]);

});
