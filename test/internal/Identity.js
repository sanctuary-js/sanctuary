'use strict';

var FL = require('fantasy-land');

var Z = require('sanctuary-type-classes');


//  Identity :: a -> Identity a
function Identity(value) {
  if (!(this instanceof Identity)) return new Identity(value);
  this.value = value;
}

Identity[FL.of] = Identity;

Identity.prototype['@@type'] = 'sanctuary/Identity';

Identity.prototype[FL.equals] = function(other) {
  return Z.equals(this.value, other.value);
};

Identity.prototype[FL.concat] = function(other) {
  return Identity(Z.concat(this.value, other.value));
};

Identity.prototype[FL.map] = function(f) {
  return Identity(f(this.value));
};

Identity.prototype[FL.ap] = function(other) {
  return Z.map(other.value, this);
};

Identity.prototype[FL.chain] = function(f) {
  return f(this.value);
};

Identity.prototype[FL.reduce] = function(f, x) {
  return f(x, this.value);
};

Identity.prototype[FL.traverse] = function(f, of) {
  return Z.map(Identity, f(this.value));
};

Identity.prototype[FL.extend] = function(f) {
  return Identity(f(this));
};

Identity.prototype[FL.extract] = function() {
  return this.value;
};

Identity.prototype.inspect =
Identity.prototype.toString = function() {
  return 'Identity(' + Z.toString(this.value) + ')';
};

module.exports = Identity;
