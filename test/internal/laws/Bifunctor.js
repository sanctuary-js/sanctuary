'use strict';

var bimap = require('./bimap');
var compose = require('./compose');
var forall = require('./forall');
var id = require('./id');


module.exports = function(equals) {
  return forall({

    //  bimap id id p = p
    identity: function(p) {
      var lhs = bimap(id)(id)(p);
      var rhs = p;
      return equals(lhs, rhs);
    },

    //  bimap (f . g) (h . i) p = bimap f h (bimap g i p)
    composition: function(p, f, g, h, i) {
      var lhs = bimap(compose(f)(g))(compose(h)(i))(p);
      var rhs = bimap(f)(h)(bimap(g)(i)(p));
      return equals(lhs, rhs);
    }

  });
};
