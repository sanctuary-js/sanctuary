'use strict';

var Z = require('sanctuary-type-classes');

var curry2 = require('./curry2');

//  of :: Applicative f => TypeRep f -> a -> f a
module.exports = curry2(Z.of);
