'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('fromEither', function() {

  eq(typeof S.fromEither, 'function');
  eq(S.fromEither.length, 2);
  eq(S.fromEither.toString(), 'fromEither :: b -> Either a b -> b');

  eq(S.fromEither(0, S.Left(42)), 0);
  eq(S.fromEither(0, S.Right(42)), 42);

});
