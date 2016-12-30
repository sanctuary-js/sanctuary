'use strict';

var compose = require('./compose');
var forall = require('./forall');
var id = require('./id');
var map = require('./map');


module.exports = function(equals) {
  return forall({

    //  id <$> u = u
    identity: function(u) {
      var lhs = map(id)(u);
      var rhs = u;
      return equals(lhs, rhs);
    },

    //  (f . g) <$> u = f <$> g <$> u
    composition: function(u, f, g) {
      var lhs = map(compose(f)(g))(u);
      var rhs = compose(map(f))(map(g))(u);
      return equals(lhs, rhs);
    }

  });
};
