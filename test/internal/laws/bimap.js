'use strict';

//  bimap :: Bifunctor f => (a -> b) -> (c -> d) -> f a c -> f b d
module.exports = function bimap(f) {
  return function(g) {
    return function(bifunctor) {
      return bifunctor.bimap(f, g);
    };
  };
};
