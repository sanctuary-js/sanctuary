'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('maybeToEither', function() {

  eq(typeof S.maybeToEither, 'function');
  eq(S.maybeToEither.length, 2);
  eq(S.maybeToEither.toString(), 'maybeToEither :: a -> Maybe b -> Either a b');

  eq(S.maybeToEither('error msg', S.Nothing), S.Left('error msg'));
  eq(S.maybeToEither('error msg', S.Just(42)), S.Right(42));

});
