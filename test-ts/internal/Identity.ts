const Z = require('sanctuary-type-classes');


export default class Identity<A> {
  value: A;
  constructor(value: A) {
    this.value = value;
  }

  static '@@type' = 'sanctuary/Identity';

  static 'fantasy-land/of'<A>(x: A): Identity<A> { return new Identity(x); };

  'fantasy-land/equals'(other: Identity<A>): boolean {
    return Z.equals(this.value, other.value);
  }
  'fantasy-land/concat'(other: Identity<A>): Identity<A> {
    return new Identity(Z.concat(this.value, other.value));
  }
  'fantasy-land/map'<B>(f: (x: A) => B): Identity<B> {
    return new Identity(f(this.value));
  }
  'fantasy-land/ap'<B>(other: Identity<(x: A) => B>): Identity<B> {
    return Z.map(other.value, this);
  }
  'fantasy-land/chain'<B>(f: (x: A) => Identity<B>): Identity<B> {
    return f(this.value);
  }
  'fantasy-land/reduce'<B>(f: (b: B, a: A) => B, x: B): B {
    return f(x, this.value);
  }
  'fantasy-land/traverse'(typeRep: any, f: (x: any) => any): any {
    return Z.map(Identity['fantasy-land/of'], f(this.value));
  }
  'fantasy-land/extend'<B>(f: (x: Identity<A>) => B): Identity<B> {
    return new Identity(f(this));
  }
  'fantasy-land/extract'(): A {
    return this.value;
  }
  inspect(): string {
    return this.toString();
  }
  toString(): string {
    return 'Identity(' + Z.toString(this.value) + ')';
  }
}
