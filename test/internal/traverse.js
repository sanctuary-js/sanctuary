'use strict';

var Z = require ('sanctuary-type-classes');

var curry3 = require ('./curry3');

//  traverse :: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f (t b)
module.exports = curry3 (Z.traverse);
