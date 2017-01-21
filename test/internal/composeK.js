'use strict';

var chain = require('./chain');

//  composeK :: Chain m => (b -> m c) -> (a -> m b) -> a -> m c
//
//  Right-to-left Kleisli composition. Equivalent to Haskell's (<=<) function.
module.exports = function composeK(f) {
  return function(g) {
    return function(x) {
      return chain(f)(g(x));
    };
  };
};
