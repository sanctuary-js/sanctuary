'use strict';

var R = require('ramda');

//  ap :: Apply f => f (a -> b) -> f a -> f b
module.exports = function ap(applyF) {
  return function(applyX) {
    return R.ap(applyF, applyX);
  };
};
