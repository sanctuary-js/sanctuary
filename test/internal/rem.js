'use strict';

//  rem :: Number -> Number -> Number !
module.exports = function rem(x) {
  return function(y) {
    if (y === 0) {
      throw new Error('Cannot divide by zero');
    } else {
      return x % y;
    }
  };
};
