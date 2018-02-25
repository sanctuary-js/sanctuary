'use strict';

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');


test('get_', function() {

  eq(typeof S.get_, 'function');
  eq(S.get_.length, 3);
  eq(S.get_.toString(), 'get_ :: Type -> String -> a -> Maybe b');

  eq(S.get_($.Number, 'x', {x: 0, y: 42}), S.Just(0));
  eq(S.get_($.Number, 'y', {x: 0, y: 42}), S.Just(42));
  eq(S.get_($.Number, 'z', {x: 0, y: 42}), S.Nothing);
  eq(S.get_($.String, 'z', {x: 0, y: 42}), S.Nothing);
  eq(S.get_($.String, 'x', {x: 0, y: 42}), S.Nothing);

  eq(S.get_($.Any, 'valueOf', null), S.Nothing);
  eq(S.get_($.Any, 'valueOf', undefined), S.Nothing);

  eq(S.get_($.Array($.Number), 'x', {x: [1, 2]}), S.Just([1, 2]));
  eq(S.get_($.Array($.Number), 'x', {x: [1, 2, null]}), S.Nothing);

});
