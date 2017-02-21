'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('when', function() {

  eq(typeof S.when, 'function');
  eq(S.when.length, 3);
  eq(S.when.toString(), 'when :: (a -> Boolean) -> (a -> a) -> a -> a');

  function gte0(x) { return x >= 0; }

  eq(S.when(gte0, Math.sqrt, 16), 4);
  eq(S.when(gte0, Math.sqrt, -1), -1);

});
