'use strict';

var forall = require('./forall');


module.exports = forall({

  //  a `equals` a = true
  reflexivity: function(a) {
    return a.equals(a);
  },

  //  a `equals` b = b `equals` a
  symmetry: function(a, b) {
    return a.equals(b) === b.equals(a);
  },

  //  a `equals` b & b `equals` c => a `equals` c
  transitivity: function(a, b, c) {
    return a.equals(b) && b.equals(c) ? a.equals(c) : true;
  }

});
