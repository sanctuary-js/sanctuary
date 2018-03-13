const FL = require('fantasy-land');
const $ = require('sanctuary-def');
const Z = require('sanctuary-type-classes');
const type = require('sanctuary-type-identifiers');

const curry2 = require('./curry2');


abstract class _List<A> {
  isNil: boolean;
  isCons: boolean;
  head: A;
  tail: _List<A>;

  static [FL.empty]<A>(): _List<A> { return new _Nil(); };
  static [FL.of]<A>(x: A): _List<A> { return new _Cons(x, new _Nil()); };
  static [FL.zero]<A>(): _List<A> { return new _Nil(); };

  inspect(): string {
    return this.toString();
  }
}

class _Nil<A> extends _List<A> {
  isNil = true;
  isCons = false;

  [FL.equals](other: _List<A>): boolean {
    return other.isNil;
  }
  [FL.concat](other: _List<A>): _List<A> {
    return other;
  }
  [FL.map]<B>(f: (x: A) => B): _List<B> {
    return new _Nil();
  }
  [FL.ap]<B>(other: _List<(x: A) => B>): _List<B> {
    return new _Nil();
  }
  [FL.chain]<B>(f: (x: A) => _List<B>): _List<B> {
    return new _Nil();
  }
  [FL.alt](other: _List<A>): _List<A> {
    return other;
  }
  [FL.reduce]<B>(f: (b: B, a: A) => B, x: B): B {
    return x;
  }
  [FL.traverse](typeRep: any, f: (x: A) => any): any {
    return Z.of(typeRep, new _Nil());
  }
  toString(): string {
    return 'Nil';
  }
}

class _Cons<A> extends _List<A> {
  isNil = false;
  isCons = true;
  constructor(head: A, tail: _List<A>) {
    super();
    this.head = head;
    this.tail = tail;
  }

  [FL.equals](other: _List<A>): boolean {
    return other.isCons &&
           Z.equals(other.head, this.head) &&
           Z.equals(other.tail, this.tail);
  }
  [FL.concat](other: _List<A>): _List<A> {
    return new _Cons(this.head, Z.concat(this.tail, other));
  }
  [FL.map]<B>(f: (x: A) => B): _List<B> {
    return new _Cons(f(this.head), Z.map(f, this.tail));
  }
  [FL.ap]<B>(other: _List<(x: A) => B>): _List<B> {
    return other.isNil ?
      new _Nil() :
      Z.concat(Z.map(other.head, this), Z.ap(other.tail, this));
  }
  [FL.chain]<B>(f: (x: A) => _List<B>): _List<B> {
    return Z.concat(f(this.head), Z.chain(f, this.tail));
  }
  [FL.alt](other: _List<A>): _List<A> {
    return new _Cons(this.head, Z.concat(this.tail, other));
  }
  [FL.reduce]<B>(f: (b: B, a: A) => B, x: B): B {
    return Z.reduce(f, f(x, this.head), this.tail);
  }
  [FL.traverse](typeRep: any, f: (x: A) => any): any {
    return Z.ap(Z.map(curry2(List.Cons), f(this.head)),
                Z.traverse(typeRep, f, this.tail));
  }
  toString(): string {
    return 'Cons(' + Z.toString(this.head) + ', ' + Z.toString(this.tail) + ')';
  }
}

const typeIdent = 'sanctuary/List';

const List: {'@@type': string, prototype: any, Type: any, Nil: any, Cons: any} = {
  '@@type': typeIdent,
  prototype: _List.prototype,
  Type: $.UnaryType(
    typeIdent,
    '',
    function(x: any) { return type(x) === typeIdent; },
    function<A>(list: _List<A>) {
      return Z.reduce(function(xs: Array<A>, x: A) { xs.push(x); return xs; }, [], list);
    }
  ),
  Nil: new _Nil(),
  Cons: function Cons<A>(head: A, tail: _List<A>): _List<A> {
    return new _Cons(head, tail);
  },
};

List.prototype.constructor = List;

export = List;
