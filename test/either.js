'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('either', function() {

  eq(typeof S.either, 'function');
  eq(S.either.length, 3);
  eq(S.either.toString(), 'either :: (a -> c) -> (b -> c) -> Either a b -> c');

  eq(S.either(S.prop('length'), Math.sqrt, S.Left('abc')), 3);
  eq(S.either(S.prop('length'), Math.sqrt, S.Right(256)), 16);

});
