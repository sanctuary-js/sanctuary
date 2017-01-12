'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('find', function() {

  eq(typeof S.find, 'function');
  eq(S.find.length, 2);
  eq(S.find.toString(), 'find :: (a -> Boolean) -> Array a -> Maybe a');

  eq(S.find(S.even, []), S.Nothing);
  eq(S.find(S.even, [1, 3, 5, 7, 9]), S.Nothing);
  eq(S.find(S.even, [1, 2, 3, 4, 5]), S.Just(2));

});
