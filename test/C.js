'use strict';

var S = require('..');

var eq = require('./internal/eq');
var map = require('./internal/map');


test('C', function() {

  eq(typeof S.C, 'function');
  eq(S.C.length, 3);
  eq(S.C.toString(), 'C :: (a -> b -> c) -> b -> a -> c');

  eq(S.C(S.concat, 'foo', 'bar'), 'barfoo');
  eq(map(S.C(S.concat, '!'))(['BAM', 'POW', 'KA-POW']), ['BAM!', 'POW!', 'KA-POW!']);

});
