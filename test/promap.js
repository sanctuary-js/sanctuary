'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('promap', function() {

  eq(typeof S.promap, 'function');
  eq(S.promap.length, 3);
  eq(S.promap.toString(), 'promap :: Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d');

  var before = S.map(S.prop('length'));
  var after = S.flip_(Math.pow)(2);
  eq(S.promap(before, after, S.sum)(['foo', 'bar', 'baz', 'quux']), 169);

  eq(S.promap(Math.abs, S.add(1), Math.sqrt)(-100), 11);

});
