'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('toMaybe', function() {

  eq(typeof S.toMaybe, 'function');
  eq(S.toMaybe.length, 1);
  eq(S.toMaybe.toString(), 'toMaybe :: a -> Maybe a');

  eq(S.toMaybe(null), S.Nothing);
  eq(S.toMaybe(undefined), S.Nothing);
  eq(S.toMaybe(0), S.Just(0));
  eq(S.toMaybe(false), S.Just(false));

});
