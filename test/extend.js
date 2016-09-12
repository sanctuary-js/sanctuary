'use strict';

var S = require('./internal/sanctuary');

var Identity = require('./internal/Identity');
var eq = require('./internal/eq');


test('extend', function() {

  eq(typeof S.extend, 'function');
  eq(S.extend.length, 2);
  eq(S.extend.toString(), 'extend :: Extend w => (w a -> b) -> w a -> w b');

  eq(S.extend(S.prop('length'), []), [0]);
  eq(S.extend(S.prop('length'), [1, 2, 3]), [3]);
  eq(S.extend(S.reduce(S.add, 1), Identity(42)), Identity(43));

});
