'use strict';

const Z = require ('sanctuary-type-classes');

const curry2 = require ('./curry2');

//    map :: Functor f => (a -> b) -> f a -> f b
module.exports = curry2 (Z.map);
