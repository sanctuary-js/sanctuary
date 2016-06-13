'use strict';

var Z = require('sanctuary-type-classes');

var curry2 = require('./curry2');

//  concat :: Semigroup a => a -> a -> a
module.exports = curry2(Z.concat);
