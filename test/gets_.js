'use strict';

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');


test('gets_', function() {

  eq(typeof S.gets_, 'function');
  eq(S.gets_.length, 3);
  eq(S.gets_.toString(), 'gets_ :: Type -> Array String -> a -> Maybe b');

  eq(S.gets_($.Number, ['x'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets_($.Number, ['y'], {x: {z: 0}, y: 42}), S.Just(42));
  eq(S.gets_($.Number, ['z'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets_($.Number, ['x', 'z'], {x: {z: 0}, y: 42}), S.Just(0));
  eq(S.gets_($.Number, ['a', 'b', 'c'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets_($.Number, [], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets_($.Object, [], {x: {z: 0}, y: 42}), S.Just({x: {z: 0}, y: 42}));

  eq(S.gets_($.Any, ['valueOf'], null), S.Nothing);
  eq(S.gets_($.Any, ['valueOf'], undefined), S.Nothing);

  eq(S.gets_($.Array($.Number), ['x'], {x: [1, 2]}), S.Just([1, 2]));
  eq(S.gets_($.Array($.Number), ['x'], {x: [1, 2, null]}), S.Nothing);

});
