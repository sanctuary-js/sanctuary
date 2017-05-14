'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('sort', function() {

  eq(typeof S.sort, 'function');
  eq(S.sort.length, 2);
  eq(S.sort.toString(), 'sort :: ((a, a) -> Number) -> Array a -> Array a');

  eq(S.sort(S.sub, []), []);
  eq(S.sort(S.sub, [4, 2, 7, 5]), [2, 4, 5, 7]);

});
