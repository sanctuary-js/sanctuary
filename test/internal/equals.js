'use strict';

var Z = require ('sanctuary-type-classes');

var curry2 = require ('./curry2');

//  equals :: a -> b -> Boolean
module.exports = curry2 (Z.equals);
