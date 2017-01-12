'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('inc', function() {

  eq(typeof S.inc, 'function');
  eq(S.inc.length, 1);
  eq(S.inc.toString(), 'inc :: FiniteNumber -> FiniteNumber');

  eq(S.inc(1), 2);
  eq(S.inc(-1), 0);
  eq(S.inc(1.5), 2.5);
  eq(S.inc(-1.5), -0.5);

});
