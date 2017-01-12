'use strict';

var Z = require('sanctuary-type-classes');

var alt = require('./alt_');
var ap = require('./ap');
var forall = require('./forall');


module.exports = function(equals, A) {
  var zero = Z.zero(A);
  return forall({

    //  (f <|> g) <*> x = (f <*> x) <|> (g <*> x)
    distributivity: function(x, f, g) {
      var lhs = ap(alt(f)(g))(x);
      var rhs = alt(ap(f)(x))(ap(g)(x));
      return equals(lhs, rhs);
    },

    //  zero <*> x = zero
    annihilation: function(x) {
      var lhs = ap(zero)(x);
      var rhs = zero;
      return equals(lhs, rhs);
    }

  });
};
