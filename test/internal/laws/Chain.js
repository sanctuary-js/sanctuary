'use strict';

var chain = require('./chain_');
var composeK = require('./composeK');
var forall = require('./forall');


module.exports = function(equals) {
  return forall({

    //  (m >>= f) >>= g = m >>= (f >=> g)
    associativity: function(m, f, g) {
      var lhs = chain(g)(chain(f)(m));
      var rhs = chain(composeK(g)(f))(m);
      return equals(lhs, rhs);
    }

  });
};
