'use strict';

var Z = require ('sanctuary-type-classes');

var concat = require ('../concat');
var forall = require ('../forall');


module.exports = function(equals, M) {
  var empty = Z.empty (M);
  return forall ({

    //  empty `concat` m = m
    leftIdentity: function(m) {
      var lhs = concat (empty) (m);
      var rhs = m;
      return equals (lhs) (rhs);
    },

    //  m `concat` empty = m
    rightIdentity: function(m) {
      var lhs = concat (m) (empty);
      var rhs = m;
      return equals (lhs) (rhs);
    }

  });
};
