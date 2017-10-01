export type Fn1<A, B>               = (a: A) => B;
export type Fn2<A, B, C>            = (a: A) => Fn1<B, C>;
export type Fn3<A, B, C, D>         = (a: A) => Fn2<B, C, D>;
export type Fn4<A, B, C, D, E>      = (a: A) => Fn3<B, C, D, E>;
export type Fn5<A, B, C, D, E, F>   = (a: A) => Fn4<B, C, D, E, F>;
export type Fn2_<A, B, C>           = (a: A, b: B) => C;
export type Fn3_<A, B, C, D>        = (a: A, b: B, c: C) => D;
export type Fn4_<A, B, C, D, E>     = (a: A, b: B, c: C, d: D) => E;
export type Fn5_<A, B, C, D, E, F>  = (a: A, b: B, c: C, d: D, e: E) => F;

export type Predicate<A> = (a: A) => boolean;

export interface Maybe<A> {
  'fantasy-land/equals': (p: Maybe<A>) => boolean
  'fantasy-land/map': <B>(p: (q: A) => B) => Maybe<B>
  'fantasy-land/ap': <B>(p: Maybe<(q: A) => B>) => Maybe<B>
  'fantasy-land/chain': <B>(p: (q: A) => Maybe<B>) => Maybe<B>
  'fantasy-land/alt': (p: Maybe<A>) => Maybe<A>
  'fantasy-land/reduce': <B>(p: Fn2_<B, A, B>, s: B) => B
  'fantasy-land/traverse': <B>(p: TypeRep, q: (r: A) => Applicative<B>) => Applicative<Maybe<B>>
}

export interface Either<A, B> {
  'fantasy-land/equals': (p: Either<A, B>) => boolean
  'fantasy-land/map': <C>(p: (q: B) => C) => Either<A, C>
  'fantasy-land/bimap': <C, D>(p: Fn1<A, C>, q: Fn1<B, D>) => Either<C, D>
  'fantasy-land/ap': <C>(p: Either<A, (q: B) => C>) => Either<A, C>
  'fantasy-land/chain': <C>(p: (q: B) => Either<A, C>) => Either<A, C>
  'fantasy-land/alt': (p: Either<A, B>) => Either<A, B>
  'fantasy-land/reduce': <C>(p: Fn2_<C, B, C>, s: C) => C
  'fantasy-land/traverse': <C>(p: TypeRep, q: (r: B) => Applicative<C>) => Applicative<Either<A, C>>
}


type ValidNumber = number;
type FiniteNumber = number;
type NonZeroFiniteNumber = number;
type Integer = number;
type NonNegativeInteger = number;


interface TypeRep {}


interface Setoid<A> {
  'fantasy-land/equals': (other: Setoid<A>) => boolean
}
interface Ord<A> extends Setoid<A> {
  'fantasy-land/lte': (other: Ord<A>) => boolean
}
interface Semigroupoid<A, B> {
  'fantasy-land/compose': <C>(other: Semigroupoid<B, C>) => Semigroupoid<A, C>
}
interface Category<A> extends Semigroupoid<A, A> {
  constructor: {
    'fantasy-land/id': () => Category<A>
  }
}
interface Semigroup<A> {
  'fantasy-land/concat': (other: Semigroup<A>) => Semigroup<A>
}
interface Monoid<A> extends Semigroup<A> {
  constructor: {
    'fantasy-land/empty': () => Monoid<A>
  }
}
interface Functor<A> {
  'fantasy-land/map': <B>(p: (q: A) => B) => Functor<B>
}
interface Bifunctor<A, C> extends Functor<C> {
  'fantasy-land/bimap': <B, D>(p: Fn1<A, B>, q: Fn1<C, D>) => Bifunctor<B, D>
}
interface Profunctor<B, C> extends Functor<C> {
  'fantasy-land/promap': <A, D>(p: Fn1<A, B>, q: Fn1<C, D>) => Profunctor<A, D>
}
interface Apply<A> extends Functor<A> {
  'fantasy-land/ap': <B>(p: Apply<(q: A) => B>) => Apply<B>
}
interface ApplicativeTypeRep<A> {
  'fantasy-land/of': (value: A) => Applicative<A>
}
interface Applicative<A> extends Apply<A> {
  constructor: ApplicativeTypeRep<A>
}
interface Chain<A> extends Apply<A> {
  'fantasy-land/chain': <B>(p: (q: A) => Chain<B>) => Chain<B>
}
interface ChainRec<A> extends Chain<A> {
  constructor: {
    'fantasy-land/chainRec': <B, C>(p: (q: (r: A) => C, s: (t: B) => C, u: A) => ChainRec<C>, v: A) => ChainRec<B>
  }
}
interface Monad<A> extends Applicative<A>, Chain<A> {}
interface Alt<A> extends Functor<A> {
  'fantasy-land/alt': (other: Alt<A>) => Alt<A>
}
interface PlusTypeRep<A> {
  'fantasy-land/zero': () => Plus<A>
}
interface Plus<A> extends Alt<A> {
  constructor: PlusTypeRep<A>
}
interface Alternative<A> extends Applicative<A>, Plus<A> {
  constructor: ApplicativeTypeRep<A> & PlusTypeRep<A>
}
interface Foldable<A> {
  'fantasy-land/reduce': <B>(p: Fn2_<B, A, B>, s: B) => B
}
interface Traversable<A> extends Functor<A>, Foldable<A> {
  'fantasy-land/traverse': <B>(p: TypeRep, q: (r: A) => Applicative<B>) => Applicative<Traversable<B>>
}
interface Extend<A> extends Functor<A> {
  'fantasy-land/extend': <B>(p: (q: Extend<A>) => B) => Extend<B>
}
interface Comonad<A> extends Extend<A> {
  'fantasy-land/extract': () => A
}
interface Contravariant<A> {
  'fantasy-land/contramap': <B>(p: (q: B) => A) => Contravariant<B>
}


export const Maybe: TypeRep;
export const Nothing: Maybe<any>;
export function Just<A>(value: A): Maybe<A>;

export const Either: TypeRep;
export function Left<A, B>(value: A): Either<A, B>;
export function Right<A, B>(value: B): Either<A, B>;

//  Classify

export function type(x: any): {
  namespace: Maybe<string>
  name: string
  version: NonNegativeInteger
};

export function is(p: TypeRep): Predicate<any>;

//  Showable

export function toString(p: any): string;

//  Fantasy Land

export function equals<A>(p: null):       Predicate<null>;
export function equals<A>(p: undefined):  Predicate<undefined>;
export function equals<A>(p: boolean):    Predicate<boolean>;
export function equals<A>(p: number):     Predicate<number>;
export function equals<A>(p: Date):       Predicate<Date>;
export function equals<A>(p: RegExp):     Predicate<RegExp>;
export function equals<A>(p: string):     Predicate<string>;
export function equals<A>(p: Array<A>):   Predicate<Array<A>>;
export function equals<A>(p: IArguments): Predicate<IArguments>;
export function equals<A>(p: Error):      Predicate<Error>;
//  XXX: This is too general. Can we match "plain" objects only?
//  export function equals<A>(p: Object):     Predicate<Object>;
export function equals<A>(p: Function):   Predicate<Function>;
export function equals<A>(p: Setoid<A>):  Predicate<Setoid<A>>;

export function lt<A>(p: null):       Predicate<null>;
export function lt<A>(p: undefined):  Predicate<undefined>;
export function lt<A>(p: boolean):    Predicate<boolean>;
export function lt<A>(p: number):     Predicate<number>;
export function lt<A>(p: Date):       Predicate<Date>;
export function lt<A>(p: string):     Predicate<string>;
export function lt<A>(p: Array<A>):   Predicate<Array<A>>;
export function lt<A>(p: IArguments): Predicate<IArguments>;
export function lt<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function lt_<A>(p: null):       Predicate<null>;
export function lt_<A>(p: undefined):  Predicate<undefined>;
export function lt_<A>(p: boolean):    Predicate<boolean>;
export function lt_<A>(p: number):     Predicate<number>;
export function lt_<A>(p: Date):       Predicate<Date>;
export function lt_<A>(p: string):     Predicate<string>;
export function lt_<A>(p: Array<A>):   Predicate<Array<A>>;
export function lt_<A>(p: IArguments): Predicate<IArguments>;
export function lt_<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function lte<A>(p: null):       Predicate<null>;
export function lte<A>(p: undefined):  Predicate<undefined>;
export function lte<A>(p: boolean):    Predicate<boolean>;
export function lte<A>(p: number):     Predicate<number>;
export function lte<A>(p: Date):       Predicate<Date>;
export function lte<A>(p: string):     Predicate<string>;
export function lte<A>(p: Array<A>):   Predicate<Array<A>>;
export function lte<A>(p: IArguments): Predicate<IArguments>;
//  XXX: This is too general. Can we match "plain" objects only?
//  export function lte<A>(p: Object):     Predicate<Object>;
export function lte<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function lte_<A>(p: null):       Predicate<null>;
export function lte_<A>(p: undefined):  Predicate<undefined>;
export function lte_<A>(p: boolean):    Predicate<boolean>;
export function lte_<A>(p: number):     Predicate<number>;
export function lte_<A>(p: Date):       Predicate<Date>;
export function lte_<A>(p: string):     Predicate<string>;
export function lte_<A>(p: Array<A>):   Predicate<Array<A>>;
export function lte_<A>(p: IArguments): Predicate<IArguments>;
export function lte_<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function gt<A>(p: null):       Predicate<null>;
export function gt<A>(p: undefined):  Predicate<undefined>;
export function gt<A>(p: boolean):    Predicate<boolean>;
export function gt<A>(p: number):     Predicate<number>;
export function gt<A>(p: Date):       Predicate<Date>;
export function gt<A>(p: string):     Predicate<string>;
export function gt<A>(p: Array<A>):   Predicate<Array<A>>;
export function gt<A>(p: IArguments): Predicate<IArguments>;
export function gt<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function gt_<A>(p: null):       Predicate<null>;
export function gt_<A>(p: undefined):  Predicate<undefined>;
export function gt_<A>(p: boolean):    Predicate<boolean>;
export function gt_<A>(p: number):     Predicate<number>;
export function gt_<A>(p: Date):       Predicate<Date>;
export function gt_<A>(p: string):     Predicate<string>;
export function gt_<A>(p: Array<A>):   Predicate<Array<A>>;
export function gt_<A>(p: IArguments): Predicate<IArguments>;
export function gt_<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function gte<A>(p: null):       Predicate<null>;
export function gte<A>(p: undefined):  Predicate<undefined>;
export function gte<A>(p: boolean):    Predicate<boolean>;
export function gte<A>(p: number):     Predicate<number>;
export function gte<A>(p: Date):       Predicate<Date>;
export function gte<A>(p: string):     Predicate<string>;
export function gte<A>(p: Array<A>):   Predicate<Array<A>>;
export function gte<A>(p: IArguments): Predicate<IArguments>;
export function gte<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function gte_<A>(p: null):       Predicate<null>;
export function gte_<A>(p: undefined):  Predicate<undefined>;
export function gte_<A>(p: boolean):    Predicate<boolean>;
export function gte_<A>(p: number):     Predicate<number>;
export function gte_<A>(p: Date):       Predicate<Date>;
export function gte_<A>(p: string):     Predicate<string>;
export function gte_<A>(p: Array<A>):   Predicate<Array<A>>;
export function gte_<A>(p: IArguments): Predicate<IArguments>;
export function gte_<A>(p: Ord<A>):     Predicate<Ord<A>>;

export function min<A>(p: Date): Fn1<Date, Date>;
export function min<A>(p: number): Fn1<number, number>;
export function min<A>(p: string): Fn1<string, string>;
export function min<A>(p: Ord<A>): Fn1<Ord<A>, Ord<A>>;

export function max<A>(p: Date): Fn1<Date, Date>;
export function max<A>(p: number): Fn1<number, number>;
export function max<A>(p: string): Fn1<string, string>;
export function max<A>(p: Ord<A>): Fn1<Ord<A>, Ord<A>>;

export function id<A>(p: TypeRep): Fn1<A, A>;
export function id<A>(p: TypeRep): Category<A>;

export function concat<A>(p: string): Fn1<string, string>;
export function concat<A>(p: Array<A>): Fn1<Array<A>, Array<A>>;
export function concat<A>(p: Semigroup<A>): Fn1<Semigroup<A>, Semigroup<A>>;

export function empty<A>(p: TypeRep): Monoid<A>;

export function map<A, B>(p: Fn1<A, B>): Fn1<Array<A>, Array<B>>;
export function map<A, B>(p: Fn1<A, B>): Fn1<Maybe<A>, Maybe<B>>;
export function map<A, B, C>(p: Fn1<B, C>): Fn1<Either<A, B>, Either<A, C>>;
export function map<A, B>(p: Fn1<A, B>): Fn1<Functor<A>, Functor<B>>;

export function bimap<A, B, C, D>(p: Fn1<A, B>): Fn2<Fn1<C, D>, Bifunctor<A, C>, Bifunctor<B, D>>;

export function promap<A, B, C, D>(p: Fn1<A, B>): Fn2<Fn1<C, D>,        Fn1<B, C>,        Fn1<A, D>>;
export function promap<A, B, C, D>(p: Fn1<A, B>): Fn2<Fn1<C, D>, Profunctor<B, C>, Profunctor<A, D>>;

export function alt<A>(p: Alt<A>): Fn1<Alt<A>, Alt<A>>;

export function zero<A>(p: TypeRep): Plus<A>;

export function reduce<A, B>(p: Fn2<B, A, B>): (q: B) => {
  (r: Array<A>): B;
  (r: Foldable<A>): B;
};

export function traverse<A, B>(p: TypeRep): (q: Fn1<A, Array<B>>) => (r: Traversable<A>) => Array<Traversable<B>>;
export function traverse<A, B>(p: TypeRep): (q: Fn1<A, Applicative<B>>) => (r: Traversable<A>) => Applicative<Traversable<B>>;

export function sequence<A>(p: TypeRep): (q: Traversable<Array<A>>) => Array<Traversable<A>>;
export function sequence<A>(p: TypeRep): (q: Traversable<Applicative<A>>) => Applicative<Traversable<A>>;

export function ap<A, B>(p: Array<Fn1<A, B>>): (q: Array<A>) => Array<B>;
export function ap<A, B>(p: Apply<Fn1<A, B>>): (q: Apply<A>) => Apply<B>;

export function lift2<A, B, C>(p: (q: A) => (r: B) => C): {
  (s: Array<A>): Fn1<Array<B>, Array<C>>;
  (s: Maybe<A>): Fn1<Maybe<B>, Maybe<C>>;
  (s: Apply<A>): Fn1<Apply<B>, Apply<C>>;
};

export function lift3<A, B, C, D>(p: (q: A) => (r: B) => (s: C) => D): {
  (t: Array<A>): Fn2<Array<B>, Array<C>, Array<D>>;
  (t: Maybe<A>): Fn2<Maybe<B>, Maybe<C>, Maybe<D>>;
  (t: Apply<A>): Fn2<Apply<B>, Apply<C>, Apply<D>>;
};

export function apFirst<A>(p: Array<A>): <B>(q: Array<B>) => Array<A>;
export function apFirst<A>(p: Apply<A>): <B>(q: Apply<B>) => Apply<A>;

export function apSecond<A>(p: Array<A>): <B>(q: Array<B>) => Array<B>;
export function apSecond<A>(p: Apply<A>): <B>(q: Apply<B>) => Apply<B>;

export function of<A>(p: TypeRep): (q: A) => Fn1<any, A>;
export function of<A>(p: TypeRep): (q: A) => Applicative<A>;

export function chain<A, B, C>(p: Fn2<B, A, C>): (q: Fn1<A, B>) => Fn1<A, C>;
export function chain<A, B>(p: Fn1<A, Array<B>>): (q: Array<A>) => Array<B>;
export function chain<A, B>(p: Fn1<A, Chain<B>>): (q: Chain<A>) => Chain<B>;

export function join<A>(p: Array<Array<A>>): Array<A>;
export function join<A>(p: Maybe<Maybe<A>>): Maybe<A>;
export function join<A>(p: Chain<Chain<A>>): Chain<A>;

export function chainRec(p: TypeRep): {
  <A, B>(q: (r: A) =>    Array<Either<A, B>>): (s: A) =>    Array<B>;
  <A, B>(q: (r: A) =>    Maybe<Either<A, B>>): (s: A) =>    Maybe<B>;
  <A, B>(q: (r: A) => ChainRec<Either<A, B>>): (s: A) => ChainRec<B>;
}

//  TODO: Fantasy Land / extend, extract, contramap

export function filter<A>(p: Predicate<A>): (q: Array<A>) => Array<A>;
//  TODO: filter non-array types

//  Combinator

export function I<A>(p: A): A;

export function K<A>(p: A): Fn1<any, A>;

export function T<A, B>(p: A): Fn1<Fn1<A, B>, B>;

//  Function

export function curry2<A, B, C>(p: Fn2_<A, B, C>): Fn2<A, B, C>;

export function curry3<A, B, C, D>(p: Fn3_<A, B, C, D>): Fn3<A, B, C, D>;

export function curry4<A, B, C, D, E>(p: Fn4_<A, B, C, D, E>): Fn4<A, B, C, D, E>;

export function curry5<A, B, C, D, E, F>(p: Fn5_<A, B, C, D, E, F>): Fn5<A, B, C, D, E, F>;

export function flip<A, B, C>(p: Fn2<A, B, C>): Fn2<B, A, C>;

export function flip_<A, B, C>(p: (q: A, r: B) => C): (s: B) => (t: A) => C;

//  Composition

export function compose<A, B, C>(p: Fn1<B, C>): (q: Fn1<A, B>) => Fn1<A, C>;

//  TODO: Allow functions of types other than ‘a -> a’
export function pipe<A>(fns: Array<(a: A) => A>): (x: A) => A;

export function on<A, B, C>(p: Fn2<B, B, C>): Fn3<Fn1<A, B>, A, A, C>;

export function on_<A, B, C>(p: (q: B, r: B) => C): (s: (t: A) => B) => (u: A) => (v: A) => C;

//  TODO: Maybe

//  TODO: Either

//  Logic

export function and(p: boolean): Predicate<boolean>;

export function or(p: boolean): Predicate<boolean>;

export function not(p: boolean): boolean;

export function complement<A>(p: Predicate<A>): Predicate<A>;

export function ifElse<A, B>(p: Predicate<A>): Fn2<Fn1<A, B>, Fn1<A, B>, Fn1<A, B>>;

export function when<A>(p: Predicate<A>): Fn1<Fn1<A, A>, Fn1<A, A>>;

export function unless<A>(p: Predicate<A>): Fn1<Fn1<A, A>, Fn1<A, A>>;

export function allPass<A>(p: Array<Predicate<A>>): Predicate<A>;

export function anyPass<A>(p: Array<Predicate<A>>): Predicate<A>;

//  List

export interface ListToMaybeList {
  (xs: string): Maybe<string>;
  <A>(xs: Array<A>): Maybe<Array<A>>;
}

export interface ListToMaybeElement {
  (xs: string): Maybe<string>;
  <A>(xs: Array<A>): Maybe<A>;
}

export interface ListToMaybeIndex<A> {
  (xs: string): Maybe<Integer>;
  (xs: Array<A>): Maybe<Integer>;
}

export function slice(beg: Integer): Fn1<Integer, ListToMaybeList>;

export function at(n: Integer): ListToMaybeElement;

export function head(xs: string): Maybe<string>;
export function head<A>(xs: Array<A>): Maybe<A>;

export function last(xs: string): Maybe<string>;
export function last<A>(xs: Array<A>): Maybe<A>;

export function tail(xs: string): Maybe<string>;
export function tail<A>(xs: Array<A>): Maybe<Array<A>>;

export function init(xs: string): Maybe<string>;
export function init<A>(xs: Array<A>): Maybe<Array<A>>;

export function take(n: Integer): ListToMaybeList;

export function takeLast(n: Integer): ListToMaybeList;

export function drop(n: Integer): ListToMaybeList;

export function dropLast(n: Integer): ListToMaybeList;

export function reverse(xs: string): string;
export function reverse<A>(xs: Array<A>): Array<A>;

export function indexOf<A>(a: A): ListToMaybeIndex<A>;

export function lastIndexOf<A>(a: A): ListToMaybeIndex<A>;

//  Array
//  TODO: Fantasyland overloads, non-curried versions

export function append<A>(x: A): Fn1<Array<A>, Array<A>>;

export function prepend<A>(x: A): Fn1<Array<A>, Array<A>>;

export function joinWith(sep: string): Fn1<Array<string>, string>;

export function elem<A>(x: A): Predicate<Array<A> | {[s: string]: A}>;

export function find<A>(p: Predicate<A>): Predicate<Array<A>>;

export function pluck(k: string): <A>(xs: Array<{[s: string]: A}>) => Array<A>;

export function unfoldr<A, B>(p: Fn1<B, Maybe<[A, B]>>): Fn1<B, Array<A>>;

export function range(start: Integer): Fn1<Integer, Array<Integer>>;

export function groupBy<A>(p: Fn2<A, A, boolean>): Fn1<Array<A>, Array<Array<A>>>;

export function groupBy_<A>(eq: (x1: A, x2: A) => boolean): (xs: Array<A>) => Array<Array<A>>;

export function sort<A>(xs: Array<A>): Array<A>;

export function sortBy<A, B>(p: Fn1<A, B>): Fn1<Array<A>, Array<A>>;


//  TODO: Object

//  Number

export function negate(n: ValidNumber): ValidNumber;

export function add(x: FiniteNumber): Fn1<FiniteNumber, FiniteNumber>;

export function sum(p: Array<FiniteNumber>): FiniteNumber;
export function sum(p: Foldable<FiniteNumber>): FiniteNumber;

export function sub(x: FiniteNumber): Fn1<FiniteNumber, FiniteNumber>;

export function sub_(x: FiniteNumber): Fn1<FiniteNumber, FiniteNumber>;

export function mult(x: FiniteNumber): Fn1<FiniteNumber, FiniteNumber>;

export function product(p: Array<FiniteNumber>): FiniteNumber;
export function product(p: Foldable<FiniteNumber>): FiniteNumber;

export function div(x: FiniteNumber): Fn1<NonZeroFiniteNumber, FiniteNumber>;

export function mean(p: Array<FiniteNumber>): Maybe<FiniteNumber>;
export function mean(p: Foldable<FiniteNumber>): Maybe<FiniteNumber>;

//  Integer

export function even(n: Integer): boolean;

export function odd(n: Integer): boolean;

//  Parse

export function parseDate(s: string): Maybe<Date>;

export function parseFloat(s: string): Maybe<number>;

export function parseInt(radix: Integer): Fn1<string, Maybe<Integer>>;

export function parseJson<A>(pred: Predicate<any>): Fn1<string, Maybe<A>>;

//  RegExp

export function regex(flags: string): Fn1<string, RegExp>;

export function regexEscape(s: string): string;

export function test(pattern: RegExp): Predicate<string>;

interface MatchObj {
  match: string
  groups: Array<Maybe<string>>
}

export function match(pattern: RegExp): Fn1<string, Array<Maybe<MatchObj>>>;

export function matchAll(pattern: RegExp): Fn1<string, Array<MatchObj>>;

//  String

export function toUpper(s: string): string;

export function toLower(s: string): string;

export function trim(s: string): string;

export function stripPrefix(prefix: string): Fn1<string, Maybe<string>>;

export function stripSuffix(suffix: string): Fn1<string, Maybe<string>>;

export function words(s: string): Array<string>;

export function unwords(xs: Array<string>): string;

export function lines(s: string): Array<string>;

export function unlines(xs: Array<string>): string;

export function splitOn(separator: string): Fn1<string, Array<string>>;

export function splitOnRegex(pattern: RegExp): Fn1<string, Array<string>>;
