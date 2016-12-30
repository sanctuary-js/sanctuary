'use strict';

var R = require('ramda');

//  map :: Functor f => (a -> b) -> f a -> f b
module.exports = function map(f) {
  return function(functor) {
    return R.map(f, functor);
  };
};
