'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('tagBy', function() {

  eq(typeof S.tagBy, 'function');
  eq(S.tagBy.length, 2);
  eq(S.tagBy.toString(), 'tagBy :: (a -> Boolean) -> a -> Either a a');

  eq(S.tagBy(S.odd, 5), S.Right(5));
  eq(S.tagBy(S.odd, 6), S.Left(6));

});
