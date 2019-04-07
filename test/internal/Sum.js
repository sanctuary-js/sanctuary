'use strict';

const FL = require ('fantasy-land');
const $ = require ('sanctuary-def');
const show = require ('sanctuary-show');
const Z = require ('sanctuary-type-classes');
const type = require ('sanctuary-type-identifiers');


//    Sum :: Number -> Sum
function Sum(value) {
  if (!(this instanceof Sum)) return new Sum (value);
  this.value = value;
}

Sum['@@type'] = 'sanctuary/Sum';

//    Type :: Type
Sum.Type = $.NullaryType
  (Sum['@@type'])
  ('')
  ([])
  (x => type (x) === Sum['@@type']);

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

module.exports = Sum;
