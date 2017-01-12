'use strict';

var S = require('..');

var eq = require('./internal/eq');


test('and', function() {

  eq(typeof S.and, 'function');
  eq(S.and.length, 2);
  eq(S.and.toString(), 'and :: Boolean -> Boolean -> Boolean');

  eq(S.and(false, false), false);
  eq(S.and(false, true), false);
  eq(S.and(true, false), false);
  eq(S.and(true, true), true);

});
