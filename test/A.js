'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');


test('A', function() {

  eq(typeof S.A, 'function');
  eq(S.A.length, 2);

  eq(S.A(S.inc, 1), 2);
  eq(R.map(S.A(R.__, 100), [S.inc, Math.sqrt]), [101, 10]);

});
