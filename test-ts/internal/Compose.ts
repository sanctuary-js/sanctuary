const FL = require('fantasy-land');

const ap = require('./ap');
const equals = require('./equals');
const map = require('./map');
const of = require('./of');
const toString = require('./toString');


//  name :: TypeRep a -> String
function name(typeRep: any): string {
  return typeof typeRep['@@type'] === 'string' ?
           typeRep['@@type'].replace(/^[^/]*[/]/, '') :
           typeRep.name;
}

//  Compose :: (Apply f, Apply g) => TypeRep f -> TypeRep g -> f (g a) -> Compose f g a
export default function Compose(F: any) {
  return function ComposeF(G: any) {
    return class ComposeFG<A> {
      value: A;
      constructor(value: A) {
        this.value = value;
      }

      static '@@type' = 'sanctuary/Compose';

      static [FL.of]<A>(x: A): ComposeFG<A> {
        return new ComposeFG(of(F)(of(G)(x)));
      }

      [FL.equals](other: ComposeFG<A>): boolean {
        return equals(this.value)(other.value);
      }
      [FL.map]<B>(f: (x: A) => B): ComposeFG<B> {
        return new ComposeFG(map(map(f))(this.value));
      }
      [FL.ap]<B>(other: ComposeFG<(x: A) => B>): ComposeFG<B> {
        return new ComposeFG(ap(map(ap)(other.value))(this.value));
      }
      inspect(): string {
        return this.toString();
      }
      toString(): string {
        return 'Compose(' + name(F) + ')' +
                      '(' + name(G) + ')' +
                      '(' + toString(this.value) + ')';
      }
    };
  };
}
