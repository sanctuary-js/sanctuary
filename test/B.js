'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');


test('B', function() {

  eq(typeof S.B, 'function');
  eq(S.B.length, 3);

  eq(S.B(R.map(Math.sqrt), JSON.parse, '[1, 4, 9]'), [1, 2, 3]);

});
