'use strict';

var ap = require ('../ap');
var compose = require ('../compose_');
var forall = require ('../forall');
var map = require ('../map');


module.exports = function(equals) {
  return forall ({

    //  (.) <$> u <*> v <*> w = u <*> (v <*> w)
    composition: function(u, v, w) {
      var lhs = ap (ap (map (compose) (u)) (v)) (w);
      var rhs = ap (u) (ap (v) (w));
      return equals (lhs) (rhs);
    }

  });
};
