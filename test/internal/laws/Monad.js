'use strict';

var chain = require ('../chain');
var forall = require ('../forall');
var of = require ('../of');


module.exports = function(equals, M) {
  var pure = of (M);
  return forall ({

    //  pure x >>= f = f x
    leftIdentity: function(f, x) {
      var lhs = chain (f) (pure (x));
      var rhs = f (x);
      return equals (lhs) (rhs);
    },

    //  m >>= pure = m
    rightIdentity: function(m) {
      var lhs = chain (pure) (m);
      var rhs = m;
      return equals (lhs) (rhs);
    }

  });
};
