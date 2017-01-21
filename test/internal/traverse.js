'use strict';

var Z = require('sanctuary-type-classes');

var curry3 = require('./curry3');

//  traverse :: (Applicative f, Traversable t) => (a -> f a) -> (b -> f c) -> t b -> f (t c)
module.exports = curry3(Z.traverse);
