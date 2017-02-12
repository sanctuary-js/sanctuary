'use strict';

var Compose = require('../Compose');
var forall = require('../forall');
var id = require('../id');
var map = require('../map');
var of = require('../of');
var traverse = require('../traverse');


module.exports = function(equals) {
  return forall({

    //  t (traverse F id u) = traverse G t u
    naturality: function(t, u, F, G) {
      var lhs = t(traverse(F)(id)(u));
      var rhs = traverse(G)(t)(u);
      return equals(lhs)(rhs);
    },

    //  traverse F F u = of F u
    identity: function(u, F) {
      var lhs = traverse(F)(F)(u);
      var rhs = of(F)(u);
      return equals(lhs)(rhs);
    },

    //  traverse C C u = C (traverse G id <$> traverse F id u)
    composition: function(u, F, G) {
      var C = Compose(F)(G);
      var lhs = traverse(C)(C)(u);
      var rhs = C(map(traverse(G)(id))(traverse(F)(id)(u)));
      return equals(lhs)(rhs);
    }

  });
};
