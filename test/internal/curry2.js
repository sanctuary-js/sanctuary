'use strict';

//  curry2 :: ((a, b) -> c) -> a -> b -> c
module.exports = function curry2(f) {
  return function(x) {
    return function(y) {
      return f(x, y);
    };
  };
};
