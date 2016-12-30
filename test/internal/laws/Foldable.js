'use strict';

var forall = require('./forall');
var reduce = require('./reduce');


module.exports = function(equals) {
  return forall({

    //  reduce f x u = reduce f x (reduce (\xs x -> xs ++ [x]) [] u)
    associativity: function(f, x, u) {
      var lhs = reduce(f)(x)(u);
      var rhs = reduce(f)(x)(reduce(function(xs, x) { return xs.concat([x]); })([])(u));
      return equals(lhs, rhs);
    }

  });
};
