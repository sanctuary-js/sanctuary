'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('or', function() {

  eq(typeof S.or, 'function');
  eq(S.or.length, 2);

  eq(S.or(false, false), false);
  eq(S.or(false, true), true);
  eq(S.or(true, false), true);
  eq(S.or(true, true), true);
  eq(S.or(new Boolean(false), new Boolean(false)), false);
  eq(S.or(new Boolean(false), new Boolean(true)), true);
  eq(S.or(new Boolean(true), new Boolean(false)), true);
  eq(S.or(new Boolean(true), new Boolean(true)), true);

});
