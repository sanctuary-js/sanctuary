'use strict';

//  curry2 :: ((a, b) -> c) -> a -> b -> c
module.exports = function curry2<A, B, C>(f: (x: A, y: B) => C) {
  return function(x: A) {
    return function(y: B) {
      return f(x, y);
    };
  };
};
