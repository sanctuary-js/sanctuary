'use strict';

var Z = require ('sanctuary-type-classes');

var curry2 = require ('./curry2');

//  alt :: Alt f => f a -> f a -> f a
module.exports = curry2 (Z.alt);
