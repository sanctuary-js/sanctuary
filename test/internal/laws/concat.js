'use strict';

var R = require('ramda');

//  concat :: Semigroup a => a -> a -> a
module.exports = function concat(x) {
  return function(y) {
    return R.concat(x, y);
  };
};
