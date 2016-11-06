'use strict';

//  errorEq :: (TypeRep a, String) -> Error -> Boolean
module.exports = function errorEq(type, message) {
  return function(error) {
    return error.constructor === type && error.message === message;
  };
};
