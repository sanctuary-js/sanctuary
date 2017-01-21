'use strict';

var Z = require('sanctuary-type-classes');

var alt = require('../alt');
var forall = require('../forall');
var map = require('../map');


module.exports = function(equals, P) {
  var zero = Z.zero(P);
  return forall({

    //  zero <|> x = x
    leftIdentity: function(x) {
      var lhs = alt(zero)(x);
      var rhs = x;
      return equals(lhs)(rhs);
    },

    //  x <|> zero = x
    rightIdentity: function(x) {
      var lhs = alt(x)(zero);
      var rhs = x;
      return equals(lhs)(rhs);
    },

    //  f <$> zero = zero
    annihilation: function(f) {
      var lhs = map(f)(zero);
      var rhs = zero;
      return equals(lhs)(rhs);
    }

  });
};
