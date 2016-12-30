'use strict';

var compose = require('./compose');
var extend = require('./extend_');
var forall = require('./forall');


module.exports = function(equals) {
  return forall({

    //  (extend f . extend g) w = extend (f . extend g) w
    associativity: function(w, f, g) {
      var lhs = compose(extend(f))(extend(g))(w);
      var rhs = extend(compose(f)(extend(g)))(w);
      return equals(lhs, rhs);
    }

  });
};
