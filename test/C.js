'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');


test('C', function() {

  eq(typeof S.C, 'function');
  eq(S.C.length, 3);

  eq(S.C(S.concat, 'foo', 'bar'), 'barfoo');
  eq(R.map(S.C(S.concat, '!'), ['BAM', 'POW', 'KA-POW']), ['BAM!', 'POW!', 'KA-POW!']);

});
