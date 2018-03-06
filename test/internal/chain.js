'use strict';

var Z = require ('sanctuary-type-classes');

var curry2 = require ('./curry2');

//  chain_ :: Chain m => (a -> m b) -> m a -> m b
module.exports = curry2 (Z.chain);
