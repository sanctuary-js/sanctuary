'use strict';

var R = require('ramda');

//  traverse :: (Applicative f, Traversable t) => (a -> f a) -> (b -> f c) -> t b -> f (t c)
module.exports = function traverse(pure) {
  return function(f) {
    return function(traversable) {
      return R.traverse(pure, f, traversable);
    };
  };
};
