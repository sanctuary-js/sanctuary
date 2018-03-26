'use strict';

//  pair :: a -> b -> Pair a b
module.exports = function pair(x) {
  return function(y) {
    return [x, y];
  };
};
