'use strict';

var R = require('ramda');

//  reduce :: Foldable f => ((b, a) -> b) -> b -> f a -> b
module.exports = function reduce(f) {
  return function(x) {
    return function(foldable) {
      return R.reduce(f, x, foldable);
    };
  };
};
