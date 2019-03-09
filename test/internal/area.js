'use strict';

//    area :: Number -> Number -> Number -> Number !
module.exports = a => b => c => {
  if (Math.max (a, b, c) < (a + b + c) / 2) {
    const s = (a + b + c) / 2;
    return Math.sqrt (s * (s - a) * (s - b) * (s - c));
  } else {
    throw new Error ('Impossible triangle');
  }
};
