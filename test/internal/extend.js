'use strict';

var Z = require('sanctuary-type-classes');

var curry2 = require('./curry2');

//  extend :: Extend w => (w a -> b) -> w a -> w b
module.exports = curry2(Z.extend);
