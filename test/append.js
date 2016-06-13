'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('append', function() {

  eq(typeof S.append, 'function');
  eq(S.append.length, 2);
  eq(S.append.toString(), 'append :: a -> Array a -> Array a');

  eq(S.append(3, []), [3]);
  eq(S.append(3, [1, 2]), [1, 2, 3]);
  eq(S.append([5, 6], [[1, 2], [3, 4]]), [[1, 2], [3, 4], [5, 6]]);

});
