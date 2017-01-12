'use strict';

var vm = require('vm');

var S = require('..');

var eq = require('./internal/eq');


test('gets', function() {

  eq(typeof S.gets, 'function');
  eq(S.gets.length, 3);
  eq(S.gets.toString(), 'gets :: Accessible a => (b -> Boolean) -> Array String -> a -> Maybe c');

  eq(S.gets(S.is(Number), ['x'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Number), ['y'], {x: {z: 0}, y: 42}), S.Just(42));
  eq(S.gets(S.is(Number), ['z'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Number), ['x', 'z'], {x: {z: 0}, y: 42}), S.Just(0));
  eq(S.gets(S.is(Number), ['a', 'b', 'c'], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Number), [], {x: {z: 0}, y: 42}), S.Nothing);
  eq(S.gets(S.is(Object), [], {x: {z: 0}, y: 42}), S.Just({x: {z: 0}, y: 42}));

  eq(S.gets(S.is(RegExp), ['x'], {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
  eq(S.gets(S.is(vm.runInNewContext('RegExp')), ['x'], {x: /.*/}), S.Just(/.*/));

});
