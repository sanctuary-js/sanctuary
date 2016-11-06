'use strict';

var S = require('../..');

//  parseHex :: String -> Either String Number
module.exports = function parseHex(s) {
  var n = parseInt(s, 16);
  return isNaN(n) ? S.Left('Invalid hexadecimal string') : S.Right(n);
};
