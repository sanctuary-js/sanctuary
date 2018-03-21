'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('zip', function() {

  eq(typeof S.zip, 'function');
  eq(S.zip.length, 2);
  eq(S.zip.toString(), 'zip :: Array a -> Array b -> Array (Pair a b)');

  eq(S.zip(['a', 'b'], ['x', 'y', 'z']), [['a', 'x'], ['b', 'y']]);
  eq(S.zip([1, 3, 5], [2, 4]), [[1, 2], [3, 4]]);

});
