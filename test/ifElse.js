'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('ifElse', function() {

  eq(typeof S.ifElse, 'function');
  eq(S.ifElse.length, 4);
  eq(S.ifElse.toString(), 'ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b');

  eq(S.ifElse(S.odd, S.dec, S.inc, 9), 8);
  eq(S.ifElse(S.odd, S.dec, S.inc, 0), 1);

});
