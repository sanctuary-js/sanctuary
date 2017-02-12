'use strict';

var S = require('..');

var add_ = require('./internal/add_');
var eq = require('./internal/eq');


test('curry2', function() {

  eq(typeof S.curry2, 'function');
  eq(S.curry2.length, 3);
  eq(S.curry2.toString(), 'curry2 :: ((a, b) -> c) -> a -> b -> c');

  var curried = S.curry2(add_);
  eq(curried(1, 2), 3);
  eq(curried(1)(2), 3);

});
