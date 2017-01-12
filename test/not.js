'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('not', function() {

  eq(typeof S.not, 'function');
  eq(S.not.length, 1);
  eq(S.not.toString(), 'not :: Boolean -> Boolean');

  eq(S.not(false), true);
  eq(S.not(true), false);

});
