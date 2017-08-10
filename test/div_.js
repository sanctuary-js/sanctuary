'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('div_', function() {

  eq(typeof S.div_, 'function');
  eq(S.div_.length, 2);
  eq(S.div_.toString(), 'div_ :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber');

  eq(S.div_(0, 10), 0);
  eq(S.map(S.div_(24), [1, 2, 3, 4]), [24, 12, 8, 6]);

});
