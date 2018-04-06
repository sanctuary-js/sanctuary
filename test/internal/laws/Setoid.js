'use strict';

var equals = require ('../equals');
var forall = require ('../forall');


module.exports = forall ({

  //  a `equals` a = true
  reflexivity: function(a) {
    return equals (a) (a);
  },

  //  a `equals` b = b `equals` a
  symmetry: function(a, b) {
    return equals (a) (b) === equals (b) (a);
  },

  //  a `equals` b & b `equals` c => a `equals` c
  transitivity: function(a, b, c) {
    return equals (a) (b) && equals (b) (c) ? equals (a) (c) : true;
  }

});
