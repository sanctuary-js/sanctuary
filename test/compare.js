'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('compare', function() {

  eq(typeof S.compare, 'function');
  eq(S.compare.length, 2);
  eq(S.compare.toString(), 'compare :: a -> a -> Ordering');

  eq(S.compare(3, 2), 'GT');
  eq(S.compare(2, 3), 'LT');
  eq(S.compare(3, 3), 'EQ');

});
