'use strict';

//  curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d
module.exports = function curry3(f) {
  return function(x) {
    return function(y) {
      return function(z) {
        return f(x, y, z);
      };
    };
  };
};
