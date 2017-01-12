'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('isNothing', function() {

  eq(typeof S.isNothing, 'function');
  eq(S.isNothing.length, 1);
  eq(S.isNothing.toString(), 'isNothing :: Maybe a -> Boolean');

  eq(S.isNothing(S.Nothing), true);
  eq(S.isNothing(S.Just(42)), false);

});
