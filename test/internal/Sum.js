import * as FL from 'fantasy-land';
import $ from 'sanctuary-def';
import show from 'sanctuary-show';
import * as Z from 'sanctuary-type-classes';
import type from 'sanctuary-type-identifiers';

import config from 'sanctuary/config';

export {Sum};


//    Sum :: Number -> Sum
function Sum(value) {
  if (!(this instanceof Sum)) return new Sum (value);
  this.value = value;
}

//    sumTypeIdent :: String
const sumTypeIdent = Sum.prototype['@@type'] = 'sanctuary/Sum';

//    Type :: Type
Sum.Type = $.NullaryType
  (sumTypeIdent)
  ('')
  ([])
  (x => type (x) === sumTypeIdent);

config.env.push (Sum.Type);

Sum[FL.empty] = () => Sum (0);

Sum.prototype[FL.equals] = function(other) {
  return Z.equals (this.value, other.value);
};

Sum.prototype[FL.concat] = function(other) {
  return Sum (this.value + other.value);
};

Sum.prototype[FL.invert] = function() {
  return Sum (-this.value);
};

Sum.prototype.inspect =
Sum.prototype['@@show'] = function() {
  return 'Sum (' + show (this.value) + ')';
};
