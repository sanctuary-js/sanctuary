'use strict';

var vm = require('vm');

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');


test('gets', function() {

  eq(typeof S.gets, 'function');
  eq(S.gets.length, 3);
  eq(S.gets.toString(), 'gets :: (Any -> Boolean) -> Array String -> a -> Maybe b');

  eq(S.gets(S.is($.Number), ['x'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is($.Number), ['y'], {x: {z: 0}, y: 42}), S.Just(42));
  eq(S.gets(S.is($.Number), ['z'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is($.Number), ['x', 'z'], {x: {z: 0}, y: 42}), S.Just(0));
  eq(S.gets(S.is($.Number), ['a', 'b', 'c'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is($.Number), [], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is($.Object), [], {x: {z: 0}, y: 42}), S.Just({x: {z: 0}, y: 42}));
  eq(S.gets(S.is($.RegExp), ['x'], {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));

  eq(S.gets(S.K(true), ['valueOf'], null), S.Nothing);
  eq(S.gets(S.K(true), ['valueOf'], undefined), S.Nothing);

  eq(S.gets(S.is($.Array($.Number)), ['x'], {x: [1, 2]}), S.Just([1, 2]));
  eq(S.gets(S.is($.Array($.Number)), ['x'], {x: [1, 2, null]}), S.Nothing);

});
