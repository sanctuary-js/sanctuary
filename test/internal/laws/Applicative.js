'use strict';

var $ = require('../$');
var ap = require('../ap');
var forall = require('../forall');
var id = require('../id');
var of = require('../of');


module.exports = function(equals, A) {
  var pure = of(A);
  return forall({

    //  pure id <*> v = v
    identity: function(v) {
      var lhs = ap(pure(id))(v);
      var rhs = v;
      return equals(lhs)(rhs);
    },

    //  pure f <*> pure x = pure (f x)
    homomorphism: function(f, x) {
      var lhs = ap(pure(f))(pure(x));
      var rhs = pure(f(x));
      return equals(lhs)(rhs);
    },

    //  u <*> pure y = pure ($ y) <*> u
    interchange: function(u, y) {
      var lhs = ap(u)(pure(y));
      var rhs = ap(pure($(y)))(u);
      return equals(lhs)(rhs);
    }

  });
};
