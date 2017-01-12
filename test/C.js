'use strict';

var Z = require('sanctuary-type-classes');

var S = require('..');

var eq = require('./internal/eq');


test('C', function() {

  eq(typeof S.C, 'function');
  eq(S.C.length, 3);
  eq(S.C.toString(), 'C :: (a -> b -> c) -> b -> a -> c');

  eq(S.C(S.concat, 'foo', 'bar'), 'barfoo');
  eq(Z.map(S.C(S.concat, '!'), ['BAM', 'POW', 'KA-POW']), ['BAM!', 'POW!', 'KA-POW!']);

});
