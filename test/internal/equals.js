'use strict';

const Z = require ('sanctuary-type-classes');

const curry2 = require ('./curry2');

//    equals :: a -> b -> Boolean
module.exports = curry2 (Z.equals);
