'use strict';

var concat = require('../concat');
var forall = require('../forall');


module.exports = function(equals) {
  return forall({

    //  (x `concat` y) `concat` z = x `concat` (y `concat` z)
    associativity: function(x, y, z) {
      var lhs = concat(concat(x)(y))(z);
      var rhs = concat(x)(concat(y)(z));
      return equals(lhs)(rhs);
    }

  });
};
