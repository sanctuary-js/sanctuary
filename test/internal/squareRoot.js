'use strict';

var S = require ('../..');

//  squareRoot :: Number -> Either String Number
module.exports = function squareRoot(n) {
  return n < 0 ? S.Left ('Cannot represent square root of negative number')
               : S.Right (Math.sqrt (n));
};
