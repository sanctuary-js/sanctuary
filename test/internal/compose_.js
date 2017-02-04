'use strict';

//  compose :: (b -> c) -> (a -> b) -> a -> c
module.exports = function compose(f) {
  return function(g) {
    return function(x) {
      return f(g(x));
    };
  };
};
