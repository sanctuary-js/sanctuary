'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('prepend', function() {

  eq(typeof S.prepend, 'function');
  eq(S.prepend.length, 2);
  eq(S.prepend.toString(), 'prepend :: a -> Array a -> Array a');

  eq(S.prepend(1, []), [1]);
  eq(S.prepend(1, [2, 3]), [1, 2, 3]);
  eq(S.prepend([1, 2], [[3, 4], [5, 6]]), [[1, 2], [3, 4], [5, 6]]);

});
