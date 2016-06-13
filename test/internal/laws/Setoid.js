'use strict';

var Z = require('sanctuary-type-classes');

var forall = require('./forall');


module.exports = forall({

  //  a `equals` a = true
  reflexivity: function(a) {
    return Z.equals(a, a);
  },

  //  a `equals` b = b `equals` a
  symmetry: function(a, b) {
    return Z.equals(a, b) === Z.equals(b, a);
  },

  //  a `equals` b & b `equals` c => a `equals` c
  transitivity: function(a, b, c) {
    return Z.equals(a, b) && Z.equals(b, c) ? Z.equals(a, c) : true;
  }

});
