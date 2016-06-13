'use strict';

var FL = require('fantasy-land');
var Z = require('sanctuary-type-classes');


//  Compose :: (Apply f, Apply g) => { of :: b -> f b } -> { of :: c -> g c } -> f (g a) -> Compose f g a
module.exports = function Compose(F) {
  return function ComposeF(G) {
    function ComposeFG(value) {
      if (!(this instanceof ComposeFG)) return new ComposeFG(value);
      this.value = value;
    }

    ComposeFG[FL.of] = function(x) {
      return ComposeFG(Z.of(F, Z.of(G, x)));
    };

    ComposeFG.prototype['@@type'] = 'sanctuary/Compose';

    ComposeFG.prototype[FL.equals] = function(other) {
      return Z.equals(this.value, other.value);
    };

    ComposeFG.prototype[FL.map] = function(f) {
      return ComposeFG(Z.map(function(y) { return Z.map(f, y); }, this.value));
    };

    ComposeFG.prototype[FL.ap] = function(other) {
      return ComposeFG(Z.ap(Z.map(function(u) { return function(y) { return Z.ap(u, y); }; }, other.value), this.value));
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
                    '(' + Z.toString(this.value) + ')';
    };

    return ComposeFG;
  };
};
