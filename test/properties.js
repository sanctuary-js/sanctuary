'use strict';

var jsc = require('jsverify');
var Z = require('sanctuary-type-classes');


var basic = jsc.sum([jsc.integer, jsc.string, jsc.bool, jsc.falsy]);

var useful = jsc.sum([basic, jsc.array(basic), jsc.dict(basic), jsc.fn(basic)]);

exports.idempotent = function(f) {
  return jsc.checkForall(useful, function(x) {
    return Z.equals(f(f(x)), f(x));
  });
};

exports.involution = function(f) {
  return jsc.checkForall(useful, function(x) {
    return Z.equals(f(f(x)), x);
  });
};
