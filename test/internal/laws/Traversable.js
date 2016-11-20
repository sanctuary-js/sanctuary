'use strict';

var Compose = require('../Compose');
var forall = require('./forall');
var id = require('./id');
var map = require('./map');
var of = require('./of');
var traverse = require('./traverse');


module.exports = function(equals) {
  return forall({

    //  t (traverse (of F) id u) = traverse (of G) t u
    naturality: function(t, u, F, G) {
      var lhs = t(traverse(of(F))(id)(u));
      var rhs = traverse(of(G))(t)(u);
      return equals(lhs, rhs);
    },

    //  traverse (of F) (of F) u = of F u
    identity: function(u, F) {
      var lhs = traverse(of(F))(of(F))(u);
      var rhs = of(F)(u);
      return equals(lhs, rhs);
    },

    //  traverse (of C) C u = C (traverse (of G) id <$> traverse (of F) id u)
    composition: function(u, F, G) {
      var C = Compose(F)(G);
      var lhs = traverse(of(C))(C)(u);
      var rhs = C(map(traverse(of(G))(id))(traverse(of(F))(id)(u)));
      return equals(lhs, rhs);
    }

  });
};
