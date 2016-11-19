'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('pipe', function() {

  eq(typeof S.pipe, 'function');
  eq(S.pipe.length, 2);

  eq(S.pipe([], '99'), '99');
  eq(S.pipe([parseInt], '99'), 99);
  eq(S.pipe([parseInt, S.inc], '99'), 100);
  eq(S.pipe([parseInt, S.inc, Math.sqrt], '99'), 10);
  eq(S.pipe([parseInt, S.inc, Math.sqrt, S.dec], '99'), 9);

});
