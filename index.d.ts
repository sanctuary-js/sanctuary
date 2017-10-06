export type Nullable<A> = A | null;

export type Pair<A, B> = [A, B];

export type Thunk<A> = () => A;

export type Fn<A, B>               = (a: A) => B;
export type Fn2<A, B, C>           = (a: A, b: B) => C;
export type Fn3<A, B, C, D>        = (a: A, b: B, c: C) => D;
export type Fn4<A, B, C, D, E>     = (a: A, b: B, c: C, d: D) => E;
export type Fn5<A, B, C, D, E, F>  = (a: A, b: B, c: C, d: D, e: E) => F;

export type Predicate<A> = (a: A) => boolean;

export interface StrMap<A> { [k: string]: A; }

export interface Maybe<A> {
  'fantasy-land/equals': (p: Maybe<A>) => boolean;
  'fantasy-land/map': <B>(p: (q: A) => B) => Maybe<B>;
  'fantasy-land/ap': <B>(p: Maybe<(q: A) => B>) => Maybe<B>;
  'fantasy-land/chain': <B>(p: (q: A) => Maybe<B>) => Maybe<B>;
  'fantasy-land/alt': (p: Maybe<A>) => Maybe<A>;
  'fantasy-land/reduce': <B>(p: Fn2<B, A, B>, s: B) => B;
  'fantasy-land/traverse': <B>(p: TypeRep, q: (r: A) => Applicative<B>) => Applicative<Maybe<B>>;
}

export interface Either<A, B> {
  'fantasy-land/equals': (p: Either<A, B>) => boolean;
  'fantasy-land/map': <C>(p: (q: B) => C) => Either<A, C>;
  'fantasy-land/bimap': <C, D>(p: Fn<A, C>, q: Fn<B, D>) => Either<C, D>;
  'fantasy-land/ap': <C>(p: Either<A, (q: B) => C>) => Either<A, C>;
  'fantasy-land/chain': <C>(p: (q: B) => Either<A, C>) => Either<A, C>;
  'fantasy-land/alt': (p: Either<A, B>) => Either<A, B>;
  'fantasy-land/reduce': <C>(p: Fn2<C, B, C>, s: C) => C;
  'fantasy-land/traverse': <C>(p: TypeRep, q: (r: B) => Applicative<C>) => Applicative<Either<A, C>>;
}


type ValidNumber = number;
type FiniteNumber = number;
type NonZeroFiniteNumber = number;
type Integer = number;
type NonNegativeInteger = number;


interface TypeRep {}


interface Setoid<A> {
  'fantasy-land/equals': (other: Setoid<A>) => boolean;
}
interface Ord<A> extends Setoid<A> {
  'fantasy-land/lte': (other: Ord<A>) => boolean;
}
interface Semigroupoid<A, B> {
  'fantasy-land/compose': <C>(other: Semigroupoid<B, C>) => Semigroupoid<A, C>;
}
interface Category<A> extends Semigroupoid<A, A> {
  constructor: {
    'fantasy-land/id': () => Category<A>
  };
}
interface Semigroup<A> {
  'fantasy-land/concat': (other: Semigroup<A>) => Semigroup<A>;
}
interface Monoid<A> extends Semigroup<A> {
  constructor: {
    'fantasy-land/empty': () => Monoid<A>
  };
}
interface Functor<A> {
  'fantasy-land/map': <B>(p: (q: A) => B) => Functor<B>;
}
interface Bifunctor<A, C> extends Functor<C> {
  'fantasy-land/bimap': <B, D>(p: Fn<A, B>, q: Fn<C, D>) => Bifunctor<B, D>;
}
interface Profunctor<B, C> extends Functor<C> {
  'fantasy-land/promap': <A, D>(p: Fn<A, B>, q: Fn<C, D>) => Profunctor<A, D>;
}
interface Apply<A> extends Functor<A> {
  'fantasy-land/ap': <B>(p: Apply<(q: A) => B>) => Apply<B>;
}
interface ApplicativeTypeRep {
  'fantasy-land/of': (value: any) => any;
}
export interface Applicative<A> extends Apply<A> {
}
interface Chain<A> extends Apply<A> {
  'fantasy-land/chain': <B>(p: (q: A) => Chain<B>) => Chain<B>;
}
interface ChainRec<A> extends Chain<A> {
  constructor: {
    'fantasy-land/chainRec': <B, C>(p: (q: (r: A) => C, s: (t: B) => C, u: A) => ChainRec<C>, v: A) => ChainRec<B>
  };
}
interface Monad<A> extends Applicative<A>, Chain<A> {}
interface Alt<A> extends Functor<A> {
  'fantasy-land/alt': (other: Alt<A>) => Alt<A>;
}
interface PlusTypeRep<A> {
  'fantasy-land/zero': () => Plus<A>;
}
interface Plus<A> extends Alt<A> {
  constructor: PlusTypeRep<A>;
}
interface Alternative<A> extends Applicative<A>, Plus<A> {
  constructor: ApplicativeTypeRep & PlusTypeRep<A>;
}
interface Foldable<A> {
  'fantasy-land/reduce': <B>(p: Fn2<B, A, B>, s: B) => B;
}
interface Traversable<A> extends Functor<A>, Foldable<A> {
  'fantasy-land/traverse': <B>(p: TypeRep, q: (r: A) => Applicative<B>) => Applicative<Traversable<B>>;
}
interface Extend<A> extends Functor<A> {
  'fantasy-land/extend': (p: any) => any;
}
interface Comonad<A> extends Extend<A> {
  'fantasy-land/extract': () => A;
}
interface Contravariant<A> {
  'fantasy-land/contramap': <B>(p: (q: B) => A) => Contravariant<B>;
}


export const Maybe: TypeRep;
export const Nothing: Maybe<any>;
export function Just<A>(value: A): Maybe<A>;

export const Either: TypeRep;
export function Left<A>(value: A): Either<A, any>;
export function Right<A>(value: A): Either<any, A>;

//  TODO: Specify return type
export function create(p: {checkTypes: boolean, env: any[]}): {};

export const env: any[];

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

export function min<A>(p:   Date): (q:   Date) =>   Date;
export function min<A>(p: number): (q: number) => number;
export function min<A>(p: string): (q: string) => string;
export function min<A>(p: Ord<A>): (q: Ord<A>) => Ord<A>;

export function max<A>(p:   Date): (q:   Date) =>   Date;
export function max<A>(p: number): (q: number) => number;
export function max<A>(p: string): (q: string) => string;
export function max<A>(p: Ord<A>): (q: Ord<A>) => Ord<A>;

export function id<A>(p: TypeRep):    Fn<A, A>;
export function id<A>(p: TypeRep): Category<A>;

export function concat<A>(p:     Array<A>): (q:     Array<A>) =>     Array<A>;
export function concat<A>(p:     Maybe<A>): (q:     Maybe<A>) =>     Maybe<A>;
export function concat<A>(p: Semigroup<A>): (q: Semigroup<A>) => Semigroup<A>;
export function concat   (p:       string): (q:       string) =>       string;

export function empty<A>(p: TypeRep): Monoid<A>;

export function map<A, B>(p: Fn<A, B>): {
  (q:  Functor<A>): Functor<B>;
  <C>(q: Fn<C, A>):   Fn<C, B>;
  (q:   StrMap<A>):  StrMap<B>;
  (q:    Maybe<A>):   Maybe<B>;
  (q:    Array<A>):   Array<B>;
};

export function bimap<A, B>(p: Fn<A, B>): <C, D>(q: Fn<C, D>) => (r: Bifunctor<A, C>) => Bifunctor<B, D>;

export function promap<A, B>(p: Fn<A, B>): <C, D>(q: Fn<C, D>) => {
  (r:         Fn<B, C>):         Fn<A, D>;
  (r: Profunctor<B, C>): Profunctor<A, D>;
};

export function alt<A>(p: Array<A>): Fn<Array<A>, Array<A>>;
export function alt<A>(p: StrMap<A>): Fn<StrMap<A>, StrMap<A>>;
export function alt<A>(p: Alt<A>): Fn<Alt<A>, Alt<A>>;

export function zero<A>(p: TypeRep): Plus<A>;

export function reduce<A, B>(p: Fn<B, Fn<A, B>>): (q: B) => <X>(r: Array<A> | StrMap<A> | Maybe<A> | Either<X, A> | Foldable<A>) => B;

export function traverse(p: TypeRep): {
  <A, B>(q: Fn<A, Array<B>>): {
    (r: Traversable<A>):       Array<Traversable<B>>;
    (r:      StrMap<A>):       Array<     StrMap<B>>;
    (r:       Array<A>):       Array<      Array<B>>;
  };
  <A, B>(q: Fn<A, Maybe<B>>): {
    (r: Traversable<A>):       Maybe<Traversable<B>>;
    (r:      StrMap<A>):       Maybe<     StrMap<B>>;
    (r:       Array<A>):       Maybe<      Array<B>>;
  };
  <A, B>(q: Fn<A, Applicative<B>>): {
    (r: Traversable<A>): Applicative<Traversable<B>>;
    (r:      StrMap<A>): Applicative<     StrMap<B>>;
    (r:       Array<A>): Applicative<      Array<B>>;
  };
};

export function sequence(p: TypeRep): {
  <A>(q: Traversable<Applicative<A>>): Applicative<Traversable<A>>;
  <A>(q: Traversable<Array<A>>): Array<Traversable<A>>;
};

export function ap<A, B>(p: Array<Fn<A, B>>): (q: Array<A>) => Array<B>;
export function ap<A, B>(p: StrMap<Fn<A, B>>): (q: StrMap<A>) => StrMap<B>;
export function ap<A, B>(p: Maybe<Fn<A, B>>): (q: Maybe<A>) => Maybe<B>;
export function ap<A, B>(p: Apply<Fn<A, B>>): (q: Apply<A>) => Apply<B>;

export function lift2<A, B, C>(p: Fn<A, Fn<B, C>>): {
  <X>(q:     Fn<X, A>): Fn<    Fn<X, B>,     Fn<X, C>>;
  (q:        Array<A>): Fn<    Array<B>,     Array<C>>;
  (q:        Maybe<A>): Fn<    Maybe<B>,     Maybe<C>>;
  <X>(q: Either<X, A>): Fn<Either<X, B>, Either<X, C>>;
  (q:        Apply<A>): Fn<    Apply<B>,     Apply<C>>;
};

export function lift3<A, B, C, D>(p: Fn<A, Fn<B, Fn<C, D>>>): {
  <X>(q:     Fn<X, A>): Fn<    Fn<X, B>, Fn<    Fn<X, C>,     Fn<X, D>>>;
  (q:        Array<A>): Fn<    Array<B>, Fn<    Array<C>,     Array<D>>>;
  (q:        Maybe<A>): Fn<    Maybe<B>, Fn<    Maybe<C>,     Maybe<D>>>;
  <X>(q: Either<X, A>): Fn<Either<X, B>, Fn<Either<X, C>, Either<X, D>>>;
  (q:        Apply<A>): Fn<    Apply<B>, Fn<    Apply<C>,     Apply<D>>>;
};

export function apFirst<A>(p: Array<A>): <B>(q: Array<B>) => Array<A>;
export function apFirst<A>(p: Apply<A>): <B>(q: Apply<B>) => Apply<A>;

export function apSecond<A>(p: Array<A>): <B>(q: Array<B>) => Array<B>;
export function apSecond<A>(p: Apply<A>): <B>(q: Apply<B>) => Apply<B>;

export function of<A>(p: TypeRep): (q: A) => Fn<any, A>;
export function of<A>(p: TypeRep): (q: A) => Applicative<A>;

export function chain<A, B, C>(p: Fn<A, Fn<C, B>>): Fn<Fn<C, A>, Fn<C, B>>;
export function chain<A, B>   (p: Fn<A, Array<B>>): Fn<Array<A>, Array<B>>;
export function chain<A, B>   (p: Fn<A, Chain<B>>): Fn<Chain<A>, Chain<B>>;

export function join<A, B>(p: Fn<B, Fn<B, A>>): Fn<B, A>;
export function join<A>   (p: Array<Array<A>>): Array<A>;
export function join<A>   (p: Maybe<Maybe<A>>): Maybe<A>;
export function join<A>   (p: Chain<Chain<A>>): Chain<A>;

export function chainRec(p: TypeRep): {
  <A, B, C>(q: Fn<A,    Fn<C, Either<A, B>>>): Fn<A,    Fn<C, B>>;
  <A, B>   (q: Fn<A,    Array<Either<A, B>>>): Fn<A,    Array<B>>;
  <A, B>   (q: Fn<A,    Maybe<Either<A, B>>>): Fn<A,    Maybe<B>>;
  <A, B>   (q: Fn<A, ChainRec<Either<A, B>>>): Fn<A, ChainRec<B>>;
};

export function extend<A, B>(p: Fn<Array<A>, B>): Fn<Array<A>, Array<B>>;
export function extend<A, B>(p: Fn<Extend<A>, B>): Fn<Extend<A>, Extend<B>>;

export function extract<A>(p: Comonad<A>): A;

export function contramap<A, B>(p: Fn<B, A>): {
  (   q: Contravariant<A>): Contravariant<B>;
  <C>(q:         Fn<A, C>):         Fn<B, C>;
};

export function filter<A>(p: Predicate<A>): {
  (q: Array<A>): Array<A>;
  (q: Foldable<A>): Foldable<A>;
};

export function filterM<A>(p: Predicate<A>): {
  (q: Maybe<A>): Maybe<A>;
  (q: Array<A>): Array<A>;
  (q: Foldable<A>): Foldable<A>;
};

export function takeWhile<A>(p: Predicate<A>): {
  (q: Maybe<A>): Maybe<A>;
  (q: Array<A>): Array<A>;
  (q: Foldable<A>): Foldable<A>;
};

export function dropWhile<A>(p: Predicate<A>): {
  (q: Maybe<A>): Maybe<A>;
  (q: Array<A>): Array<A>;
  (q: Foldable<A>): Foldable<A>;
};

//  Combinator

export function I<A>(p: A): A;

export function K<A>(p: A): Fn<any, A>;

export function T<A, B>(p: A): Fn<Fn<A, B>, B>;

//  Function

export function curry2<A, B, C>(p: Fn2<A, B, C>): Fn<A, Fn<B, C>>;

export function curry3<A, B, C, D>(p: Fn3<A, B, C, D>): Fn<A, Fn<B, Fn<C, D>>>;

export function curry4<A, B, C, D, E>(p: Fn4<A, B, C, D, E>): Fn<A, Fn<B, Fn<C, Fn<D, E>>>>;

export function curry5<A, B, C, D, E, F>(p: Fn5<A, B, C, D, E, F>): Fn<A, Fn<B, Fn<C, Fn<D, Fn<E, F>>>>>;

export function flip<A, B, C>(p: Fn<A, Fn<B, C>>): Fn<B, Fn<A, C>>;

export function flip_<A, B, C>(p: (q: A, r: B) => C): (s: B) => (t: A) => C;

//  Composition

export function compose<A, B, C>(p: Fn<B, C>): (q: Fn<A, B>) => Fn<A, C>;

export function pipe(p: Array<Fn<any, any>>): Fn<any, any>;

export function on<A, B, C>(p: Fn<B, Fn<B, C>>): Fn<Fn<A, B>, Fn<A, Fn<A, C>>>;

export function on_<A, B, C>(p: (q: B, r: B) => C): (s: (t: A) => B) => (u: A) => (v: A) => C;

//  TODO: Maybe

export function isNothing<A>(p: Maybe<A>): boolean;

export function isJust<A>(p: Maybe<A>): boolean;

export function fromMaybe<A>(p: A): Fn<Maybe<A>, A>;

export function fromMaybe_<A>(p: Thunk<A>): Fn<Maybe<A>, A>;

export function maybeToNullable<A>(p: Maybe<A>): Nullable<A>;

export function toMaybe<A>(p: A | null | undefined): Maybe<A>;

export function maybe<B>(p: B): <A>(q: Fn<A, B>) => Fn<Maybe<A>, B>;

export function maybe_<B>(p: Thunk<B>): <A>(q: Fn<A, B>) => Fn<Maybe<A>, B>;

export function justs<A>(p: Array<Maybe<A>>): Array<A>;

export function mapMaybe<A, B>(p: Fn<A, Maybe<B>>): Fn<Array<A>, Array<B>>;

export function encase<A, B>(p: Fn<A, B>): Fn<A, Maybe<B>>;

export function encase2<A, B, C>(p: Fn<A, Fn<B, C>>): Fn<A, Fn<B, Maybe<C>>>;

export function encase3<A, B, C, D>(p: Fn<A, Fn<B, Fn<C, D>>>): Fn<A, Fn<B, Fn<C, Maybe<D>>>>;

export function maybeToEither<A>(p: A): <B>(q: Maybe<B>) => Either<A, B>;

//  TODO: Either

export function isLeft<A, B>(p: Either<A, B>): boolean;

export function isRight<A, B>(p: Either<A, B>): boolean;

export function fromEither<B>(p: B): <A>(q: Either<A, B>) => B;

export function toEither<A>(p: A): <B>(q: B | null | undefined) => Either<A, B>;

export function either<A, C>(p: Fn<A, C>): <B>(q: Fn<B, C>) => Fn<Either<A, B>, C>;

export function lefts<A, B>(p: Array<Either<A, B>>): Array<A>;

export function rights<A, B>(p: Array<Either<A, B>>): Array<B>;

export function tagBy<A>(p: Predicate<A>): Fn<A, Either<A, A>>;

export function encaseEither<L>(p: Fn<Error, L>): <A, R>(q: Fn<A, R>) => Fn<A, Either<L, R>>;

export function encaseEither2<L>(p: Fn<Error, L>): <A, B, R>(q: Fn<A, Fn<B, R>>) => Fn<A, Fn<B, Either<L, R>>>;

export function encaseEither3<L>(p: Fn<Error, L>): <A, B, C, R>(q: Fn<A, Fn<B, Fn<C, R>>>) => Fn<A, Fn<B, Fn<C, Either<L, R>>>>;

export function eitherToMaybe<A, B>(p: Either<A, B>): Maybe<B>;

//  Logic

export function and(p: boolean): Predicate<boolean>;

export function or(p: boolean): Predicate<boolean>;

export function not(p: boolean): boolean;

export function complement<A>(p: Predicate<A>): Predicate<A>;

export function ifElse<A, B>(p: Predicate<A>): Fn<Fn<A, B>, Fn<Fn<A, B>, Fn<A, B>>>;

export function when<A>(p: Predicate<A>): Fn<Fn<A, A>, Fn<A, A>>;

export function unless<A>(p: Predicate<A>): Fn<Fn<A, A>, Fn<A, A>>;

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

export function slice(beg: Integer): Fn<Integer, ListToMaybeList>;

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

//  Array
//  TODO: Fantasyland overloads, non-curried versions

export function append<A>(p: A): {
  (q: Applicative<A>): Applicative<A>;
  (q: Maybe<A>): Maybe<A>;
  <X>(q: Either<X, A>): Either<X, A>;
  (q: Array<A>): Array<A>;
};

export function prepend<A>(p: A): {
  (q: Applicative<A>): Applicative<A>;
  (q: Maybe<A>): Maybe<A>;
  <X>(q: Either<X, A>): Either<X, A>;
  (q: Array<A>): Array<A>;
};

export function joinWith(sep: string): Fn<Array<string>, string>;

export function elem<A>(p: A): (q: Array<A> | StrMap<A> | Foldable<A>) => boolean;

export function find<A>(p: Predicate<A>): (q: Array<A> | StrMap<A> | Foldable<A>) => Maybe<A>;

export function pluck(p: string): {
  (q:   Array<any>):   Array<any>;
  (q:   Maybe<any>):   Maybe<any>;
  (q: Functor<any>): Functor<any>;
};

export function unfoldr<A, B>(p: Fn<B, Maybe<Pair<A, B>>>): Fn<B, Array<A>>;

export function range(start: Integer): Fn<Integer, Array<Integer>>;

export function groupBy<A>(p: Fn<A, Fn<A, boolean>>): Fn<Array<A>, Array<Array<A>>>;

export function reverse(xs: string): string;
export function reverse<A>(xs: Array<A>): Array<A>;

export function sort<A>(xs: Array<A>): Array<A>;

export function sortBy<A, B>(p: Fn<A, B>): Fn<Array<A>, Array<A>>;

//  Object

export function prop(p: string): <A, B>(q: A) => B;

export function props(p: Array<string>): <A, B>(q: A) => B;

export function get(p: Predicate<any>): Fn<string, Fn<any, Maybe<any>>>;

export function gets(p: Predicate<any>): Fn<Array<string>, Fn<any, Maybe<any>>>;

//  StrMap

export function keys<A>(p: StrMap<A>): Array<string>;

export function values<A>(p: StrMap<A>): Array<A>;

export function pairs<A>(p: StrMap<A>): Array<Pair<string, A>>;

//  Number

export function negate(n: ValidNumber): ValidNumber;

export function add(x: FiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function sum(p: Foldable<FiniteNumber>): FiniteNumber;
export function sum(p: Array<FiniteNumber>): FiniteNumber;

export function sub(x: FiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function sub_(x: FiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function mult(x: FiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function product(p: Foldable<FiniteNumber>): FiniteNumber;
export function product(p: Array<FiniteNumber>): FiniteNumber;

export function div(p: NonZeroFiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function div_(p: FiniteNumber): Fn<NonZeroFiniteNumber, FiniteNumber>;

export function pow(p: FiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function pow_(p: FiniteNumber): Fn<FiniteNumber, FiniteNumber>;

export function mean(p: Foldable<FiniteNumber>): Maybe<FiniteNumber>;
export function mean(p: Array<FiniteNumber>): Maybe<FiniteNumber>;

//  Integer

export function even(n: Integer): boolean;

export function odd(n: Integer): boolean;

//  Parse

export function parseDate(s: string): Maybe<Date>;

export function parseFloat(s: string): Maybe<number>;

export function parseInt(radix: Integer): Fn<string, Maybe<Integer>>;

export function parseJson<A>(pred: Predicate<any>): Fn<string, Maybe<A>>;

//  RegExp

export function regex(flags: string): Fn<string, RegExp>;

export function regexEscape(s: string): string;

export function test(pattern: RegExp): Predicate<string>;

interface MatchObj {
  match: string;
  groups: Array<Maybe<string>>;
}

export function match(pattern: RegExp): Fn<string, Array<Maybe<MatchObj>>>;

export function matchAll(pattern: RegExp): Fn<string, Array<MatchObj>>;

//  String

export function toUpper(s: string): string;

export function toLower(s: string): string;

export function trim(s: string): string;

export function stripPrefix(prefix: string): Fn<string, Maybe<string>>;

export function stripSuffix(suffix: string): Fn<string, Maybe<string>>;

export function words(s: string): Array<string>;

export function unwords(xs: Array<string>): string;

export function lines(s: string): Array<string>;

export function unlines(xs: Array<string>): string;

export function splitOn(separator: string): Fn<string, Array<string>>;

export function splitOnRegex(pattern: RegExp): Fn<string, Array<string>>;
