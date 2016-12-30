'use strict';

//  extend :: Extend w => (w a -> b) -> w a -> w b
module.exports = function extend(f) {
  return function(w) {
    return w.extend(f);
  };
};
