'use strict';

//    rem :: Number -> Number -> Number !
module.exports = x => y => {
  if (y === 0) {
    throw new Error ('Cannot divide by zero');
  } else {
    return x % y;
  }
};
