'use strict';

var $ = require('sanctuary-def');

var S = require('..');

var eq = require('./internal/eq');


test('env', function() {

  eq(typeof S.env, 'object');
  eq($.test([], $.Array($.Type), S.env), true);

});
