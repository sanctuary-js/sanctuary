'use strict';

//  factorial :: Number -> Number !
module.exports = function factorial(n) {
  if (n < 0) {
    throw new Error('Cannot determine factorial of negative number');
  } else if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
};
