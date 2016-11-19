'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');


test('compose', function() {

  eq(typeof S.compose, 'function');
  eq(S.compose.length, 3);

  eq(S.compose(R.map(Math.sqrt), JSON.parse, '[1, 4, 9]'), [1, 2, 3]);

});
