'use strict';

//  $ :: a -> (a -> b) -> b
module.exports = function $(x) {
  return function(f) {
    return f (x);
  };
};
