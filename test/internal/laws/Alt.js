'use strict';

var alt = require('../alt');
var forall = require('../forall');
var map = require('../map');


module.exports = function(equals) {
  return forall({

    //  (a <|> b) <|> c = a <|> (b <|> c)
    associativity: function(a, b, c) {
      var lhs = alt(alt(a)(b))(c);
      var rhs = alt(a)(alt(b)(c));
      return equals(lhs)(rhs);
    },

    //  f <$> (a <|> b) = (f <$> a) <|> (f <$> b)
    distributivity: function(a, b, f) {
      var lhs = map(f)(alt(a)(b));
      var rhs = alt(map(f)(a))(map(f)(b));
      return equals(lhs)(rhs);
    }

  });
};
