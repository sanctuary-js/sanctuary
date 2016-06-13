'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('div', function() {

  eq(typeof S.div, 'function');
  eq(S.div.length, 2);
  eq(S.div.toString(), 'div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber');

  eq(S.div(8, 2), 4);
  eq(S.div(8, -2), -4);
  eq(S.div(-8, -2), 4);
  eq(S.div(1.5, 2), 0.75);
  eq(S.div(1.5, -2), -0.75);
  eq(S.div(-1.5, -2), 0.75);

});
