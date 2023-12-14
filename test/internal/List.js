import assert from 'node:assert';

import * as FL from 'fantasy-land';
import $ from 'sanctuary-def';
import show from 'sanctuary-show';
import Z from 'sanctuary-type-classes';
import type from 'sanctuary-type-identifiers';

import config from 'sanctuary/config';

export {Nil, Cons};


const List = {prototype: _List.prototype};

List.prototype.constructor = List;

function _List(tag, head, tail) {
  this.isCons = tag === 'Cons';
  this.isNil = tag === 'Nil';
  if (this.isCons) {
    this.head = head;
    this.tail = tail;
  }
}

//    listTypeIdent :: String
const listTypeIdent = List.prototype['@@type'] = 'sanctuary/List';

//    Type :: Type -> Type
List.Type = $.UnaryType
  (listTypeIdent)
  ('')
  ([])
  (x => type (x) === listTypeIdent)
  (list => list);

config.env.push (List.Type ($.Unknown));

//    Nil :: List a
const Nil = List.Nil = new _List ('Nil');

//    Cons :: a -> List a -> List a
const Cons = List.Cons = function Cons(head) {
  assert.strictEqual (arguments.length, Cons.length);
  return function Cons$1(tail) {
    assert.strictEqual (arguments.length, Cons$1.length);
    return new _List ('Cons', head, tail);
  };
};

List[FL.empty] = () => Nil;

List[FL.of] = x => Cons (x) (Nil);

List[FL.zero] = List[FL.empty];

List.prototype[FL.equals] = function(other) {
  return this.isNil ?
    other.isNil :
    other.isCons &&
      Z.equals (other.head, this.head) &&
      Z.equals (other.tail, this.tail);
};

List.prototype[FL.concat] = function(other) {
  return this.isNil ?
    other :
    Cons (this.head) (Z.concat (this.tail, other));
};

List.prototype[FL.filter] = function(pred) {
  return this.isNil ?
    Nil :
    pred (this.head) ?
      Cons (this.head) (Z.filter (pred, this.tail)) :
      Z.filter (pred, this.tail);
};

List.prototype[FL.map] = function(f) {
  return this.isNil ?
    Nil :
    Cons (f (this.head)) (Z.map (f, this.tail));
};

List.prototype[FL.ap] = function(other) {
  return this.isNil || other.isNil ?
    Nil :
    Z.concat (Z.map (other.head, this), Z.ap (other.tail, this));
};

List.prototype[FL.chain] = function(f) {
  return this.isNil ?
    Nil :
    Z.concat (f (this.head), Z.chain (f, this.tail));
};

List.prototype[FL.alt] = List.prototype[FL.concat];

List.prototype[FL.reduce] = function(f, x) {
  return this.isNil ?
    x :
    Z.reduce (f, f (x, this.head), this.tail);
};

List.prototype[FL.traverse] = function(typeRep, f) {
  return this.isNil ?
    Z.of (typeRep, Nil) :
    Z.ap (Z.map (Cons, f (this.head)), Z.traverse (typeRep, f, this.tail));
};

List.prototype.inspect =
List.prototype['@@show'] = function() {
  return this.isNil ?
    'Nil' :
    'Cons (' + show (this.head) + ') (' + show (this.tail) + ')';
};
