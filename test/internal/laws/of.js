'use strict';

//  of :: Applicative f => TypeRep f -> a -> f a
module.exports = function of(typeRep) {
  return function(x) {
    return typeRep.of(x);
  };
};
