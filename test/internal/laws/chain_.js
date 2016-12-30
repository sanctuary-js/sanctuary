'use strict';

var R = require('ramda');

//  chain_ :: Chain m => (a -> m b) -> m a -> m b
module.exports = function chain_(f) {
  return function(chain) {
    return R.chain(f, chain);
  };
};
