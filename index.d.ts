interface AwaitingTwo<A, B, R> {
  (a: A, b: B): R
  (a: A): (b: B) => R
}

interface AwaitingThree<A, B, C, R> {
  (a: A, b: B, c: C): R
  (a: A, b: B): (c: C) => R
  (a: A): AwaitingTwo<B, C, R>
}


export interface Maybe<A> {
  'fantasy-land/equals': (other: Maybe<A>) => boolean
  'fantasy-land/map': <B>(f: (A) => B) => Maybe<B>
  'fantasy-land/ap': <B>(other: Maybe<(A) => B>) => Maybe<B>
  'fantasy-land/chain': <B>(f: (A) => Maybe<B>) => Maybe<B>
  'fantasy-land/alt': (other: Maybe<A>) => Maybe<A>
  'fantasy-land/reduce': <B>(f: (B, A) => B, x: B) => B
  'fantasy-land/traverse': <B>(typeRep: TypeRep, f: (A) => Applicative<B>) => Applicative<Maybe<B>>
}

export interface Either<A, B> {
  'fantasy-land/equals': (other: Either<A, B>) => boolean
  'fantasy-land/map': <C>(f: (B) => C) => Either<A, C>
  'fantasy-land/bimap': <C, D>(f: (A) => C, g: (B) => D) => Either<C, D>
  'fantasy-land/ap': <C>(other: Either<A, (B) => C>) => Either<A, C>
  'fantasy-land/chain': <C>(f: (B) => Either<A, C>) => Either<A, C>
  'fantasy-land/alt': (other: Either<A, B>) => Either<A, B>
  'fantasy-land/reduce': <C>(f: (C, B) => C, x: C) => C
  'fantasy-land/traverse': <C>(typeRep: TypeRep, f: (B) => Applicative<C>) => Applicative<Either<A, C>>
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
  'fantasy-land/map': <B>(f: (A) => B) => Functor<B>
}
interface Bifunctor<A, C> extends Functor<C> {
  'fantasy-land/bimap': <B, D>(f: (A) => B, g: (C) => D) => Bifunctor<B, D>
}
interface Profunctor<B, C> extends Functor<C> {
  'fantasy-land/promap': <A, D>(f: (A) => B, g: (C) => D) => Profunctor<A, D>
}
interface Apply<A> extends Functor<A> {
  'fantasy-land/ap': <B>(other: Apply<(A) => B>) => Apply<B>
}
interface ApplicativeTypeRep<A> {
  'fantasy-land/of': (value: A) => Applicative<A>
}
interface Applicative<A> extends Apply<A> {
  constructor: ApplicativeTypeRep<A>
}
interface Chain<A> extends Apply<A> {
  'fantasy-land/chain': <B>(f: (A) => Chain<B>) => Chain<B>
}
interface ChainRec<A> extends Chain<A> {
  constructor: {
    'fantasy-land/chainRec': <B, C>(f: ($0: (A) => C, $1: (B) => C, $2: A) => ChainRec<C>, x: A) => ChainRec<B>
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
  'fantasy-land/reduce': <B>(f: (B, A) => B, x: B) => B
}
interface Traversable<A> extends Functor<A>, Foldable<A> {
  'fantasy-land/traverse': <B>(typeRep: TypeRep, f: (A) => Applicative<B>) => Applicative<Traversable<B>>
}
interface Extend<A> extends Functor<A> {
  'fantasy-land/extend': <B>(f: ($0: Extend<A>) => B) => Extend<B>
}
interface Comonad<A> extends Extend<A> {
  'fantasy-land/extract': () => A
}
interface Contravariant<A> {
  'fantasy-land/contramap': <B>(f: (B) => A) => Contravariant<B>
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

export function is(typeRep: TypeRep, x: any): boolean;
export function is(typeRep: TypeRep): (x: any) => boolean;

//  Showable

export function toString(x: any): string;

//  Fantasy Land

export function equals<A>(x: null, y: null): boolean;
export function equals<A>(x: null): (y: null) => boolean;
export function equals<A>(x: undefined, y: undefined): boolean;
export function equals<A>(x: undefined): (y: undefined) => boolean;
export function equals<A>(x: boolean, y: boolean): boolean;
export function equals<A>(x: boolean): (y: boolean) => boolean;
export function equals<A>(x: number, y: number): boolean;
export function equals<A>(x: number): (y: number) => boolean;
export function equals<A>(x: Date, y: Date): boolean;
export function equals<A>(x: Date): (y: Date) => boolean;
export function equals<A>(x: RegExp, y: RegExp): boolean;
export function equals<A>(x: RegExp): (y: RegExp) => boolean;
export function equals<A>(x: string, y: string): boolean;
export function equals<A>(x: string): (y: string) => boolean;
export function equals<A>(x: Array<A>, y: Array<A>): boolean;
export function equals<A>(x: Array<A>): (y: Array<A>) => boolean;
export function equals<A>(x: IArguments, y: IArguments): boolean;
export function equals<A>(x: IArguments): (y: IArguments) => boolean;
export function equals<A>(x: Error, y: Error): boolean;
export function equals<A>(x: Error): (y: Error) => boolean;
//  XXX: This is too general. Can we match "plain" objects only?
//  export function equals<A>(x: Object, y: Object): boolean;
//  export function equals<A>(x: Object): (y: Object) => boolean;
export function equals<A>(x: Function, y: Function): boolean;
export function equals<A>(x: Function): (y: Function) => boolean;
export function equals<A>(x: Setoid<A>, y: Setoid<A>): boolean;
export function equals<A>(x: Setoid<A>): (y: Setoid<A>) => boolean;

export function lt<A>(x: null): (y: null) => boolean;
export function lt<A>(x: undefined): (y: undefined) => boolean;
export function lt<A>(x: boolean): (y: boolean) => boolean;
export function lt<A>(x: number): (y: number) => boolean;
export function lt<A>(x: Date): (y: Date) => boolean;
export function lt<A>(x: string): (y: string) => boolean;
export function lt<A>(x: Array<A>): (y: Array<A>) => boolean;
export function lt<A>(x: IArguments): (y: IArguments) => boolean;
export function lt<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function lt_<A>(x: null, y: null): boolean;
export function lt_<A>(x: null): (y: null) => boolean;
export function lt_<A>(x: undefined, y: undefined): boolean;
export function lt_<A>(x: undefined): (y: undefined) => boolean;
export function lt_<A>(x: boolean, y: boolean): boolean;
export function lt_<A>(x: boolean): (y: boolean) => boolean;
export function lt_<A>(x: number, y: number): boolean;
export function lt_<A>(x: number): (y: number) => boolean;
export function lt_<A>(x: Date, y: Date): boolean;
export function lt_<A>(x: Date): (y: Date) => boolean;
export function lt_<A>(x: string, y: string): boolean;
export function lt_<A>(x: string): (y: string) => boolean;
export function lt_<A>(x: Array<A>, y: Array<A>): boolean;
export function lt_<A>(x: Array<A>): (y: Array<A>) => boolean;
export function lt_<A>(x: IArguments, y: IArguments): boolean;
export function lt_<A>(x: IArguments): (y: IArguments) => boolean;
export function lt_<A>(x: Ord<A>, y: Ord<A>): boolean;
export function lt_<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function lte<A>(x: null): (y: null) => boolean;
export function lte<A>(x: undefined): (y: undefined) => boolean;
export function lte<A>(x: boolean): (y: boolean) => boolean;
export function lte<A>(x: number): (y: number) => boolean;
export function lte<A>(x: Date): (y: Date) => boolean;
export function lte<A>(x: string): (y: string) => boolean;
export function lte<A>(x: Array<A>): (y: Array<A>) => boolean;
export function lte<A>(x: IArguments): (y: IArguments) => boolean;
//  XXX: This is too general. Can we match "plain" objects only?
//  export function lte<A>(x: Object): (y: Object) => boolean;
export function lte<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function lte_<A>(x: null, y: null): boolean;
export function lte_<A>(x: null): (y: null) => boolean;
export function lte_<A>(x: undefined, y: undefined): boolean;
export function lte_<A>(x: undefined): (y: undefined) => boolean;
export function lte_<A>(x: boolean, y: boolean): boolean;
export function lte_<A>(x: boolean): (y: boolean) => boolean;
export function lte_<A>(x: number, y: number): boolean;
export function lte_<A>(x: number): (y: number) => boolean;
export function lte_<A>(x: Date, y: Date): boolean;
export function lte_<A>(x: Date): (y: Date) => boolean;
export function lte_<A>(x: string, y: string): boolean;
export function lte_<A>(x: string): (y: string) => boolean;
export function lte_<A>(x: Array<A>, y: Array<A>): boolean;
export function lte_<A>(x: Array<A>): (y: Array<A>) => boolean;
export function lte_<A>(x: IArguments, y: IArguments): boolean;
export function lte_<A>(x: IArguments): (y: IArguments) => boolean;
export function lte_<A>(x: Ord<A>, y: Ord<A>): boolean;
export function lte_<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function gt<A>(x: null): (y: null) => boolean;
export function gt<A>(x: undefined): (y: undefined) => boolean;
export function gt<A>(x: boolean): (y: boolean) => boolean;
export function gt<A>(x: number): (y: number) => boolean;
export function gt<A>(x: Date): (y: Date) => boolean;
export function gt<A>(x: string): (y: string) => boolean;
export function gt<A>(x: Array<A>): (y: Array<A>) => boolean;
export function gt<A>(x: IArguments): (y: IArguments) => boolean;
export function gt<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function gt_<A>(x: null, y: null): boolean;
export function gt_<A>(x: null): (y: null) => boolean;
export function gt_<A>(x: undefined, y: undefined): boolean;
export function gt_<A>(x: undefined): (y: undefined) => boolean;
export function gt_<A>(x: boolean, y: boolean): boolean;
export function gt_<A>(x: boolean): (y: boolean) => boolean;
export function gt_<A>(x: number, y: number): boolean;
export function gt_<A>(x: number): (y: number) => boolean;
export function gt_<A>(x: Date, y: Date): boolean;
export function gt_<A>(x: Date): (y: Date) => boolean;
export function gt_<A>(x: string, y: string): boolean;
export function gt_<A>(x: string): (y: string) => boolean;
export function gt_<A>(x: Array<A>, y: Array<A>): boolean;
export function gt_<A>(x: Array<A>): (y: Array<A>) => boolean;
export function gt_<A>(x: IArguments, y: IArguments): boolean;
export function gt_<A>(x: IArguments): (y: IArguments) => boolean;
export function gt_<A>(x: Ord<A>, y: Ord<A>): boolean;
export function gt_<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function gte<A>(x: null): (y: null) => boolean;
export function gte<A>(x: undefined): (y: undefined) => boolean;
export function gte<A>(x: boolean): (y: boolean) => boolean;
export function gte<A>(x: number): (y: number) => boolean;
export function gte<A>(x: Date): (y: Date) => boolean;
export function gte<A>(x: string): (y: string) => boolean;
export function gte<A>(x: Array<A>): (y: Array<A>) => boolean;
export function gte<A>(x: IArguments): (y: IArguments) => boolean;
export function gte<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function gte_<A>(x: null, y: null): boolean;
export function gte_<A>(x: null): (y: null) => boolean;
export function gte_<A>(x: undefined, y: undefined): boolean;
export function gte_<A>(x: undefined): (y: undefined) => boolean;
export function gte_<A>(x: boolean, y: boolean): boolean;
export function gte_<A>(x: boolean): (y: boolean) => boolean;
export function gte_<A>(x: number, y: number): boolean;
export function gte_<A>(x: number): (y: number) => boolean;
export function gte_<A>(x: Date, y: Date): boolean;
export function gte_<A>(x: Date): (y: Date) => boolean;
export function gte_<A>(x: string, y: string): boolean;
export function gte_<A>(x: string): (y: string) => boolean;
export function gte_<A>(x: Array<A>, y: Array<A>): boolean;
export function gte_<A>(x: Array<A>): (y: Array<A>) => boolean;
export function gte_<A>(x: IArguments, y: IArguments): boolean;
export function gte_<A>(x: IArguments): (y: IArguments) => boolean;
export function gte_<A>(x: Ord<A>, y: Ord<A>): boolean;
export function gte_<A>(x: Ord<A>): (y: Ord<A>) => boolean;

export function min<A>(x: Date, y: Date): Date;
export function min<A>(x: Date): (y: Date) => Date;
export function min<A>(x: number, y: number): number;
export function min<A>(x: number): (y: number) => number;
export function min<A>(x: string, y: string): string;
export function min<A>(x: string): (y: string) => string;
export function min<A>(x: Ord<A>, y: Ord<A>): Ord<A>;
export function min<A>(x: Ord<A>): (y: Ord<A>) => Ord<A>;

export function max<A>(x: Date, y: Date): Date;
export function max<A>(x: Date): (y: Date) => Date;
export function max<A>(x: number, y: number): number;
export function max<A>(x: number): (y: number) => number;
export function max<A>(x: string, y: string): string;
export function max<A>(x: string): (y: string) => string;
export function max<A>(x: Ord<A>, y: Ord<A>): Ord<A>;
export function max<A>(x: Ord<A>): (y: Ord<A>) => Ord<A>;

export function id<A>(typeRep: TypeRep): (A) => A;
export function id<A>(typeRep: TypeRep): Category<A>;

export function concat<A>(x: string, y: string): string;
export function concat<A>(x: string): (y: string) => string;
export function concat<A>(x: Array<A>, y: Array<A>): Array<A>;
export function concat<A>(x: Array<A>): (y: Array<A>) => Array<A>;
export function concat<A>(x: Semigroup<A>, y: Semigroup<A>): Semigroup<A>;
export function concat<A>(x: Semigroup<A>): (y: Semigroup<A>) => Semigroup<A>;

export function empty<A>(typeRep: TypeRep): Monoid<A>;

export function map<A, B>(f: (A) => B, xs: Array<A>): Array<B>;
export function map<A, B>(f: (A) => B): (xs: Array<A>) => Array<B>;
export function map<A, B>(f: (A) => B, functor: Functor<A>): Functor<B>;
export function map<A, B>(f: (A) => B): (functor: Functor<A>) => Functor<B>;

export function bimap<A, B, C, D>(f: (A) => B, g: (C) => D, bifunctor: Bifunctor<A, C>): Bifunctor<B, D>;
export function bimap<A, B, C, D>(f: (A) => B, g: (C) => D): (bifunctor: Bifunctor<A, C>) => Bifunctor<B, D>;
export function bimap<A, B, C, D>(f: (A) => B): AwaitingTwo<(C) => D, Bifunctor<A, C>, Bifunctor<B, D>>;

export function promap<A, B, C, D>(f: (A) => B, g: (C) => D, profunctor: (B) => C): (A) => D;
export function promap<A, B, C, D>(f: (A) => B, g: (C) => D): (profunctor: (B) => C) => (A) => D;
export function promap<A, B, C, D>(f: (A) => B): AwaitingTwo<(C) => D, (B) => C, (A) => D>;
export function promap<A, B, C, D>(f: (A) => B, g: (C) => D, profunctor: Profunctor<B, C>): Profunctor<A, D>;
export function promap<A, B, C, D>(f: (A) => B, g: (C) => D): (profunctor: Profunctor<B, C>) => Profunctor<A, D>;
export function promap<A, B, C, D>(f: (A) => B): AwaitingTwo<(C) => D, Profunctor<B, C>, Profunctor<A, D>>;

export function alt<A>(x: Alt<A>, y: Alt<A>): Alt<A>;
export function alt<A>(x: Alt<A>): (y: Alt<A>) => Alt<A>;

export function zero<A>(typeRep: TypeRep): Plus<A>;

export function reduce<A, B>(f: (B) => (A) => B, x: B, xs: Array<A>): B;
export function reduce<A, B>(f: (B) => (A) => B, x: B): (xs: Array<A>) => B;
export function reduce<A, B>(f: (B) => (A) => B): AwaitingTwo<B, Array<A>, B>;
export function reduce<A, B>(f: (B) => (A) => B, x: B, foldable: Foldable<A>): B;
export function reduce<A, B>(f: (B) => (A) => B, x: B): (foldable: Foldable<A>) => B;
export function reduce<A, B>(f: (B) => (A) => B): AwaitingTwo<B, Foldable<A>, B>;

export function traverse<A, B>(typeRep: TypeRep, f: (A) => Array<B>, traversable: Traversable<A>): Array<Traversable<B>>;
export function traverse<A, B>(typeRep: TypeRep, f: (A) => Array<B>): (traversable: Traversable<A>) => Array<Traversable<B>>;
export function traverse<A, B>(typeRep: TypeRep): AwaitingTwo<(A) => Array<B>, Traversable<A>, Array<Traversable<B>>>;
export function traverse<A, B>(typeRep: TypeRep, f: (A) => Applicative<B>, traversable: Traversable<A>): Applicative<Traversable<B>>;
export function traverse<A, B>(typeRep: TypeRep, f: (A) => Applicative<B>): (traversable: Traversable<A>) => Applicative<Traversable<B>>;
export function traverse<A, B>(typeRep: TypeRep): AwaitingTwo<(A) => Applicative<B>, Traversable<A>, Applicative<Traversable<B>>>;

export function sequence<A>(typeRep: TypeRep, traversable: Traversable<Applicative<A>>): Applicative<Traversable<A>>;
export function sequence<A>(typeRep: TypeRep): (traversable: Traversable<Applicative<A>>) => Applicative<Traversable<A>>;

export function ap<A, B>(fs: Array<(A) => B>, xs: Array<A>): Array<B>;
export function ap<A, B>(fs: Array<(A) => B>): (xs: Array<A>) => Array<B>;
export function ap<A, B>(f: Apply<(A) => B>, apply: Apply<A>): Apply<B>;
export function ap<A, B>(f: Apply<(A) => B>): (apply: Apply<A>) => Apply<B>;

export function lift2<A, B, C>(f: (A) => (B) => C, x: Apply<A>, y: Apply<B>): Apply<C>;
export function lift2<A, B, C>(f: (A) => (B) => C, x: Apply<A>): (y: Apply<B>) => Apply<C>;
export function lift2<A, B, C>(f: (A) => (B) => C): AwaitingTwo<Apply<A>, Apply<B>, Apply<C>>;

export function lift3<A, B, C, D>(f: (A) => (B) => (C) => D, x: Apply<A>, y: Apply<B>, z: Apply<C>): Apply<D>;
export function lift3<A, B, C, D>(f: (A) => (B) => (C) => D, x: Apply<A>, y: Apply<B>): (z: Apply<C>) => Apply<D>;
export function lift3<A, B, C, D>(f: (A) => (B) => (C) => D, x: Apply<A>): AwaitingTwo<Apply<B>, Apply<C>, Apply<D>>;
export function lift3<A, B, C, D>(f: (A) => (B) => (C) => D): AwaitingThree<Apply<A>, Apply<B>, Apply<C>, Apply<D>>;

export function apFirst<A, B>($0: Array<A>, $1: Array<B>): Array<A>;
export function apFirst<A, B>($0: Array<A>): ($1: Array<B>) => Array<A>;
export function apFirst<A, B>($0: Apply<A>, $1: Apply<B>): Apply<A>;
export function apFirst<A, B>($0: Apply<A>): ($1: Apply<B>) => Apply<A>;

export function apSecond<A, B>($0: Array<A>, $1: Array<B>): Array<B>;
export function apSecond<A, B>($0: Array<A>): ($1: Array<B>) => Array<B>;
export function apSecond<A, B>($0: Apply<A>, $1: Apply<B>): Apply<B>;
export function apSecond<A, B>($0: Apply<A>): ($1: Apply<B>) => Apply<B>;

export function of<A>($0: TypeRep, $1: A): (any) => A;
export function of<A>($0: TypeRep): ($1: A) => (any) => A;
export function of<A>($0: TypeRep, $1: A): Applicative<A>;
export function of<A>($0: TypeRep): ($1: A) => Applicative<A>;

export function chain<A, B, C>($0: (B) => (A) => C, $1: (A) => B): (A) => C;
export function chain<A, B, C>($0: (B) => (A) => C): ($1: (A) => B) => (A) => C;
export function chain<A, B>($0: (A) => Array<B>, $1: Array<A>): Array<B>;
export function chain<A, B>($0: (A) => Array<B>): ($1: Array<A>) => Array<B>;
export function chain<A, B>($0: (A) => Chain<B>, $1: Chain<A>): Chain<B>;
export function chain<A, B>($0: (A) => Chain<B>): ($1: Chain<A>) => Chain<B>;

//  Number

export function negate(n: ValidNumber): ValidNumber;

export function add(x: FiniteNumber, y: FiniteNumber): FiniteNumber;
export function add(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function sum(xs: Array<FiniteNumber>): FiniteNumber;
export function sum(foldable: Foldable<FiniteNumber>): FiniteNumber;

export function sub(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function sub_(x: FiniteNumber, y: FiniteNumber): FiniteNumber;
export function sub_(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function mult(x: FiniteNumber, y: FiniteNumber): FiniteNumber;
export function mult(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function product(xs: Array<FiniteNumber>): FiniteNumber;
export function product(foldable: Foldable<FiniteNumber>): FiniteNumber;

export function div(x: FiniteNumber, y: NonZeroFiniteNumber): FiniteNumber;
export function div(x: FiniteNumber): (y: NonZeroFiniteNumber) => FiniteNumber;

export function mean(xs: Array<FiniteNumber>): Maybe<FiniteNumber>;
export function mean(foldable: Foldable<FiniteNumber>): Maybe<FiniteNumber>;

//  Integer

export function even(n: Integer): boolean;

export function odd(n: Integer): boolean;

//  Parse

export function parseDate(s: string): Maybe<Date>;

export function parseFloat(s: string): Maybe<number>;

export function parseInt(radix: Integer, s: string): Maybe<Integer>;
export function parseInt(radix: Integer): (s: string) => Maybe<Integer>;

export function parseJson<A>(pred: (any) => boolean, s: string): Maybe<A>;
export function parseJson<A>(pred: (any) => boolean): (s: string) => Maybe<A>;

//  RegExp

export function regex(flags: string, source: string): RegExp;
export function regex(flags: string): (source: string) => RegExp;

export function regexEscape(s: string): string;

export function test(pattern: RegExp, s: string): boolean;
export function test(pattern: RegExp): (s: string) => boolean;

interface MatchObj {
  match: string
  groups: Array<Maybe<string>>
}

export function match(pattern: RegExp, s: string): Maybe<MatchObj>;
export function match(pattern: RegExp): (s: string) => Maybe<MatchObj>;

export function matchAll(pattern: RegExp, s: string): Array<MatchObj>;
export function matchAll(pattern: RegExp): (s: string) => Array<MatchObj>;

//  String

export function toUpper(s: string): string;

export function toLower(s: string): string;

export function trim(s: string): string;

export function stripPrefix(prefix: string, s: string): Maybe<string>;
export function stripPrefix(prefix: string): (s: string) => Maybe<string>;

export function stripSuffix(suffix: string, s: string): Maybe<string>;
export function stripSuffix(suffix: string): (s: string) => Maybe<string>;

export function words(s: string): Array<string>;

export function unwords(xs: Array<string>): string;

export function lines(s: string): Array<string>;

export function unlines(xs: Array<string>): string;

export function splitOn(separator: string, s: string): Array<string>;
export function splitOn(separator: string): (s: string) => Array<string>;

export function splitOnRegex(pattern: RegExp, s: string): Array<string>;
export function splitOnRegex(pattern: RegExp): (s: string) => Array<string>;
