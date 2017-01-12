'use strict';

var vm = require('vm');

var S = require('..');

var eq = require('./internal/eq');


test('get', function() {

  eq(typeof S.get, 'function');
  eq(S.get.length, 3);
  eq(S.get.toString(), 'get :: Accessible a => (b -> Boolean) -> String -> a -> Maybe c');

  eq(S.get(S.is(Number), 'x', {x: 0, y: 42}), S.Just(0));
  eq(S.get(S.is(Number), 'y', {x: 0, y: 42}), S.Just(42));
  eq(S.get(S.is(Number), 'z', {x: 0, y: 42}), S.Nothing);
  eq(S.get(S.is(String), 'z', {x: 0, y: 42}), S.Nothing);
  eq(S.get(S.is(String), 'x', {x: 0, y: 42}), S.Nothing);

  eq(S.get(S.is(RegExp), 'x', {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
  eq(S.get(S.is(vm.runInNewContext('RegExp')), 'x', {x: /.*/}), S.Just(/.*/));

});
