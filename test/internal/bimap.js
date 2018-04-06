'use strict';

var Z = require ('sanctuary-type-classes');

var curry3 = require ('./curry3');

//  bimap :: Bifunctor f => (a -> b) -> (c -> d) -> f a c -> f b d
module.exports = curry3 (Z.bimap);
