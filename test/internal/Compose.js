'use strict';

var FL = require('fantasy-land');

var ap = require('./ap');
var equals = require('./equals');
var map = require('./map');
var of = require('./of');
var toString = require('./toString');


//  Compose :: (Apply f, Apply g) => TypeRep f -> TypeRep g -> f (g a) -> Compose f g a
module.exports = function Compose(F) {
  return function ComposeF(G) {
    function ComposeFG(value) {
      if (!(this instanceof ComposeFG)) return new ComposeFG(value);
      this.value = value;
    }

    ComposeFG['@@type'] = 'sanctuary/Compose';

    ComposeFG[FL.of] = function(x) {
      return ComposeFG(of(F)(of(G)(x)));
    };

    ComposeFG.prototype[FL.equals] = function(other) {
      return equals(this.value)(other.value);
    };

    ComposeFG.prototype[FL.map] = function(f) {
      return ComposeFG(map(map(f))(this.value));
    };

    ComposeFG.prototype[FL.ap] = function(other) {
      return ComposeFG(ap(map(ap)(other.value))(this.value));
    };

    //  name :: TypeRep a -> String
    function name(typeRep) {
      return typeof typeRep['@@type'] === 'string' ?
               typeRep['@@type'].replace(/^[^/]*[/]/, '') :
               typeRep.name;
    }

    ComposeFG.prototype.inspect =
    ComposeFG.prototype.toString = function() {
      return 'Compose(' + name(F) + ')' +
                    '(' + name(G) + ')' +
                    '(' + toString(this.value) + ')';
    };

    return ComposeFG;
  };
};
