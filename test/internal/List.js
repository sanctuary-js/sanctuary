'use strict';

var FL = require('fantasy-land');
var $ = require('sanctuary-def');
var Z = require('sanctuary-type-classes');
var type = require('sanctuary-type-identifiers');

var curry2 = require('./curry2');
var eq = require('./eq');


var List = {prototype: _List.prototype};

List.prototype.constructor = List;

function _List(tag, head, tail) {
  this.isCons = tag === 'Cons';
  this.isNil = tag === 'Nil';
  if (this.isCons) {
    this.head = head;
    this.tail = tail;
  }
}

List['@@type'] = 'sanctuary/List';

//  Type :: Type -> Type
List.Type = $.UnaryType(
  List['@@type'],
  '',
  function(x) { return type(x) === List['@@type']; },
  function(list) {
    return Z.reduce(function(xs, x) { xs.push(x); return xs; }, [], list);
  }
);

//  Nil :: List a
var Nil = List.Nil = new _List('Nil');

//  Cons :: (a, List a) -> List a
var Cons = List.Cons = function Cons(head, tail) {
  eq(arguments.length, Cons.length);
  return new _List('Cons', head, tail);
};

List[FL.empty] = function() { return Nil; };

List[FL.of] = function(x) { return Cons(x, Nil); };

List[FL.zero] = List[FL.empty];

List.prototype[FL.equals] = function(other) {
  return this.isNil ?
    other.isNil :
    other.isCons &&
      Z.equals(other.head, this.head) &&
      Z.equals(other.tail, this.tail);
};

List.prototype[FL.concat] = function(other) {
  return this.isNil ?
    other :
    Cons(this.head, Z.concat(this.tail, other));
};

List.prototype[FL.filter] = function(pred) {
  return this.isNil ?
    Nil :
    pred(this.head) ?
      Cons(this.head, Z.filter(pred, this.tail)) :
      Z.filter(pred, this.tail);
};

List.prototype[FL.map] = function(f) {
  return this.isNil ?
    Nil :
    Cons(f(this.head), Z.map(f, this.tail));
};

List.prototype[FL.ap] = function(other) {
  return this.isNil || other.isNil ?
    Nil :
    Z.concat(Z.map(other.head, this), Z.ap(other.tail, this));
};

List.prototype[FL.chain] = function(f) {
  return this.isNil ?
    Nil :
    Z.concat(f(this.head), Z.chain(f, this.tail));
};

List.prototype[FL.alt] = List.prototype[FL.concat];

List.prototype[FL.reduce] = function(f, x) {
  return this.isNil ?
    x :
    Z.reduce(f, f(x, this.head), this.tail);
};

List.prototype[FL.traverse] = function(typeRep, f) {
  return this.isNil ?
    Z.of(typeRep, Nil) :
    Z.ap(Z.map(curry2(Cons), f(this.head)), Z.traverse(typeRep, f, this.tail));
};

List.prototype.inspect =
List.prototype.toString = function() {
  return this.isNil ?
    'Nil' :
    'Cons(' + Z.toString(this.head) + ', ' + Z.toString(this.tail) + ')';
};

module.exports = List;
