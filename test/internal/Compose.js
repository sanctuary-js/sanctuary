'use strict';

var FL = require('fantasy-land');
var R = require('ramda');


//  Compose :: (Apply f, Apply g) => { of :: b -> f b } -> { of :: c -> g c } -> f (g a) -> Compose f g a
module.exports = function Compose(F) {
  return function ComposeF(G) {
    function ComposeFG(value) {
      if (!(this instanceof ComposeFG)) return new ComposeFG(value);
      this.value = value;
    }

    ComposeFG.of = function(x) {
      return ComposeFG(F.of(G.of(x)));
    };

    ComposeFG.prototype['@@type'] = 'sanctuary/Compose';

    ComposeFG.prototype[FL.equals] = function(other) {
      return R.equals(this.value, other.value);
    };

    ComposeFG.prototype[FL.map] = function(f) {
      return ComposeFG(R.map(R.map(f), this.value));
    };

    ComposeFG.prototype[FL.ap] = function(other) {
      return ComposeFG(R.ap(R.map(R.ap, this.value), other.value));
    };

    //  name :: TypeRep a -> String
    function name(typeRep) {
      return typeRep.prototype != null &&
             typeof typeRep.prototype['@@type'] === 'string' ?
               typeRep.prototype['@@type'].replace(/^[^/]*[/]/, '') :
               typeRep.name;
    }

    ComposeFG.prototype.inspect =
    ComposeFG.prototype.toString = function() {
      return 'Compose(' + name(F) + ')' +
                    '(' + name(G) + ')' +
                    '(' + R.toString(this.value) + ')';
    };

    return ComposeFG;
  };
};
