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
  'fantasy-land/equals': (p: Maybe<A>) => boolean
  'fantasy-land/map': <B>(p: (q: A) => B) => Maybe<B>
  'fantasy-land/ap': <B>(p: Maybe<(q: A) => B>) => Maybe<B>
  'fantasy-land/chain': <B>(p: (q: A) => Maybe<B>) => Maybe<B>
  'fantasy-land/alt': (p: Maybe<A>) => Maybe<A>
  'fantasy-land/reduce': <B>(p: (q: B, r: A) => B, s: B) => B
  'fantasy-land/traverse': <B>(p: TypeRep, q: (r: A) => Applicative<B>) => Applicative<Maybe<B>>
}

export interface Either<A, B> {
  'fantasy-land/equals': (p: Either<A, B>) => boolean
  'fantasy-land/map': <C>(p: (q: B) => C) => Either<A, C>
  'fantasy-land/bimap': <C, D>(p: (q: A) => C, r: (s: B) => D) => Either<C, D>
  'fantasy-land/ap': <C>(p: Either<A, (q: B) => C>) => Either<A, C>
  'fantasy-land/chain': <C>(p: (q: B) => Either<A, C>) => Either<A, C>
  'fantasy-land/alt': (p: Either<A, B>) => Either<A, B>
  'fantasy-land/reduce': <C>(p: (q: C, r: B) => C, s: C) => C
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
  'fantasy-land/bimap': <B, D>(p: (q: A) => B, r: (s: C) => D) => Bifunctor<B, D>
}
interface Profunctor<B, C> extends Functor<C> {
  'fantasy-land/promap': <A, D>(p: (q: A) => B, r: (s: C) => D) => Profunctor<A, D>
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
  'fantasy-land/reduce': <B>(p: (q: B, r: A) => B, s: B) => B
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

export function is(p: TypeRep,   q: any):   boolean;
export function is(p: TypeRep): (q: any) => boolean;

//  Showable

export function toString(p: any): string;

//  Fantasy Land

export function equals<A>(p: null,   q: null):   boolean;
export function equals<A>(p: null): (q: null) => boolean;
export function equals<A>(p: undefined,   q: undefined):   boolean;
export function equals<A>(p: undefined): (q: undefined) => boolean;
export function equals<A>(p: boolean,   q: boolean):   boolean;
export function equals<A>(p: boolean): (q: boolean) => boolean;
export function equals<A>(p: number,   q: number):   boolean;
export function equals<A>(p: number): (q: number) => boolean;
export function equals<A>(p: Date,   q: Date):   boolean;
export function equals<A>(p: Date): (q: Date) => boolean;
export function equals<A>(p: RegExp,   q: RegExp):   boolean;
export function equals<A>(p: RegExp): (q: RegExp) => boolean;
export function equals<A>(p: string,   q: string):   boolean;
export function equals<A>(p: string): (q: string) => boolean;
export function equals<A>(p: Array<A>,   q: Array<A>):   boolean;
export function equals<A>(p: Array<A>): (q: Array<A>) => boolean;
export function equals<A>(p: IArguments,   q: IArguments):   boolean;
export function equals<A>(p: IArguments): (q: IArguments) => boolean;
export function equals<A>(p: Error,   q: Error):   boolean;
export function equals<A>(p: Error): (q: Error) => boolean;
//  XXX: This is too general. Can we match "plain" objects only?
//  export function equals<A>(p: Object,   q: Object):   boolean;
//  export function equals<A>(p: Object): (q: Object) => boolean;
export function equals<A>(p: Function,   q: Function):   boolean;
export function equals<A>(p: Function): (q: Function) => boolean;
export function equals<A>(p: Setoid<A>,   q: Setoid<A>):   boolean;
export function equals<A>(p: Setoid<A>): (q: Setoid<A>) => boolean;

export function lt<A>(p: null): (q: null) => boolean;
export function lt<A>(p: undefined): (q: undefined) => boolean;
export function lt<A>(p: boolean): (q: boolean) => boolean;
export function lt<A>(p: number): (q: number) => boolean;
export function lt<A>(p: Date): (q: Date) => boolean;
export function lt<A>(p: string): (q: string) => boolean;
export function lt<A>(p: Array<A>): (q: Array<A>) => boolean;
export function lt<A>(p: IArguments): (q: IArguments) => boolean;
export function lt<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function lt_<A>(p: null,   q: null):   boolean;
export function lt_<A>(p: null): (q: null) => boolean;
export function lt_<A>(p: undefined,   q: undefined):   boolean;
export function lt_<A>(p: undefined): (q: undefined) => boolean;
export function lt_<A>(p: boolean,   q: boolean):   boolean;
export function lt_<A>(p: boolean): (q: boolean) => boolean;
export function lt_<A>(p: number,   q: number):   boolean;
export function lt_<A>(p: number): (q: number) => boolean;
export function lt_<A>(p: Date,   q: Date):   boolean;
export function lt_<A>(p: Date): (q: Date) => boolean;
export function lt_<A>(p: string,   q: string):   boolean;
export function lt_<A>(p: string): (q: string) => boolean;
export function lt_<A>(p: Array<A>,   q: Array<A>):   boolean;
export function lt_<A>(p: Array<A>): (q: Array<A>) => boolean;
export function lt_<A>(p: IArguments,   q: IArguments):   boolean;
export function lt_<A>(p: IArguments): (q: IArguments) => boolean;
export function lt_<A>(p: Ord<A>,   q: Ord<A>):   boolean;
export function lt_<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function lte<A>(p: null): (q: null) => boolean;
export function lte<A>(p: undefined): (q: undefined) => boolean;
export function lte<A>(p: boolean): (q: boolean) => boolean;
export function lte<A>(p: number): (q: number) => boolean;
export function lte<A>(p: Date): (q: Date) => boolean;
export function lte<A>(p: string): (q: string) => boolean;
export function lte<A>(p: Array<A>): (q: Array<A>) => boolean;
export function lte<A>(p: IArguments): (q: IArguments) => boolean;
//  XXX: This is too general. Can we match "plain" objects only?
//  export function lte<A>(p: Object): (q: Object) => boolean;
export function lte<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function lte_<A>(p: null,   q: null):   boolean;
export function lte_<A>(p: null): (q: null) => boolean;
export function lte_<A>(p: undefined,   q: undefined):   boolean;
export function lte_<A>(p: undefined): (q: undefined) => boolean;
export function lte_<A>(p: boolean,   q: boolean):   boolean;
export function lte_<A>(p: boolean): (q: boolean) => boolean;
export function lte_<A>(p: number,   q: number):   boolean;
export function lte_<A>(p: number): (q: number) => boolean;
export function lte_<A>(p: Date,   q: Date):   boolean;
export function lte_<A>(p: Date): (q: Date) => boolean;
export function lte_<A>(p: string,   q: string):   boolean;
export function lte_<A>(p: string): (q: string) => boolean;
export function lte_<A>(p: Array<A>,   q: Array<A>):   boolean;
export function lte_<A>(p: Array<A>): (q: Array<A>) => boolean;
export function lte_<A>(p: IArguments,   q: IArguments):   boolean;
export function lte_<A>(p: IArguments): (q: IArguments) => boolean;
export function lte_<A>(p: Ord<A>,   q: Ord<A>):   boolean;
export function lte_<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function gt<A>(p: null): (q: null) => boolean;
export function gt<A>(p: undefined): (q: undefined) => boolean;
export function gt<A>(p: boolean): (q: boolean) => boolean;
export function gt<A>(p: number): (q: number) => boolean;
export function gt<A>(p: Date): (q: Date) => boolean;
export function gt<A>(p: string): (q: string) => boolean;
export function gt<A>(p: Array<A>): (q: Array<A>) => boolean;
export function gt<A>(p: IArguments): (q: IArguments) => boolean;
export function gt<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function gt_<A>(p: null,   q: null):   boolean;
export function gt_<A>(p: null): (q: null) => boolean;
export function gt_<A>(p: undefined,   q: undefined):   boolean;
export function gt_<A>(p: undefined): (q: undefined) => boolean;
export function gt_<A>(p: boolean,   q: boolean):   boolean;
export function gt_<A>(p: boolean): (q: boolean) => boolean;
export function gt_<A>(p: number,   q: number):   boolean;
export function gt_<A>(p: number): (q: number) => boolean;
export function gt_<A>(p: Date,   q: Date):   boolean;
export function gt_<A>(p: Date): (q: Date) => boolean;
export function gt_<A>(p: string,   q: string):   boolean;
export function gt_<A>(p: string): (q: string) => boolean;
export function gt_<A>(p: Array<A>,   q: Array<A>):   boolean;
export function gt_<A>(p: Array<A>): (q: Array<A>) => boolean;
export function gt_<A>(p: IArguments,   q: IArguments):   boolean;
export function gt_<A>(p: IArguments): (q: IArguments) => boolean;
export function gt_<A>(p: Ord<A>,   q: Ord<A>):   boolean;
export function gt_<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function gte<A>(p: null): (q: null) => boolean;
export function gte<A>(p: undefined): (q: undefined) => boolean;
export function gte<A>(p: boolean): (q: boolean) => boolean;
export function gte<A>(p: number): (q: number) => boolean;
export function gte<A>(p: Date): (q: Date) => boolean;
export function gte<A>(p: string): (q: string) => boolean;
export function gte<A>(p: Array<A>): (q: Array<A>) => boolean;
export function gte<A>(p: IArguments): (q: IArguments) => boolean;
export function gte<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function gte_<A>(p: null,   q: null):   boolean;
export function gte_<A>(p: null): (q: null) => boolean;
export function gte_<A>(p: undefined,   q: undefined):   boolean;
export function gte_<A>(p: undefined): (q: undefined) => boolean;
export function gte_<A>(p: boolean,   q: boolean):   boolean;
export function gte_<A>(p: boolean): (q: boolean) => boolean;
export function gte_<A>(p: number,   q: number):   boolean;
export function gte_<A>(p: number): (q: number) => boolean;
export function gte_<A>(p: Date,   q: Date):   boolean;
export function gte_<A>(p: Date): (q: Date) => boolean;
export function gte_<A>(p: string,   q: string):   boolean;
export function gte_<A>(p: string): (q: string) => boolean;
export function gte_<A>(p: Array<A>,   q: Array<A>):   boolean;
export function gte_<A>(p: Array<A>): (q: Array<A>) => boolean;
export function gte_<A>(p: IArguments,   q: IArguments):   boolean;
export function gte_<A>(p: IArguments): (q: IArguments) => boolean;
export function gte_<A>(p: Ord<A>,   q: Ord<A>):   boolean;
export function gte_<A>(p: Ord<A>): (q: Ord<A>) => boolean;

export function min<A>(p: Date,   q: Date):   Date;
export function min<A>(p: Date): (q: Date) => Date;
export function min<A>(p: number,   q: number):   number;
export function min<A>(p: number): (q: number) => number;
export function min<A>(p: string,   q: string):   string;
export function min<A>(p: string): (q: string) => string;
export function min<A>(p: Ord<A>,   q: Ord<A>):   Ord<A>;
export function min<A>(p: Ord<A>): (q: Ord<A>) => Ord<A>;

export function max<A>(p: Date,   q: Date):   Date;
export function max<A>(p: Date): (q: Date) => Date;
export function max<A>(p: number,   q: number):   number;
export function max<A>(p: number): (q: number) => number;
export function max<A>(p: string,   q: string):   string;
export function max<A>(p: string): (q: string) => string;
export function max<A>(p: Ord<A>,   q: Ord<A>):   Ord<A>;
export function max<A>(p: Ord<A>): (q: Ord<A>) => Ord<A>;

export function id<A>(p: TypeRep): (q: A) => A;
export function id<A>(p: TypeRep): Category<A>;

export function concat<A>(p: string,   q: string):   string;
export function concat<A>(p: string): (q: string) => string;
export function concat<A>(p: Array<A>,   q: Array<A>):   Array<A>;
export function concat<A>(p: Array<A>): (q: Array<A>) => Array<A>;
export function concat<A>(p: Semigroup<A>,   q: Semigroup<A>):   Semigroup<A>;
export function concat<A>(p: Semigroup<A>): (q: Semigroup<A>) => Semigroup<A>;

export function empty<A>(p: TypeRep): Monoid<A>;

export function map<A, B>(p: (q: A) => B,   r: Array<A>):   Array<B>;
export function map<A, B>(p: (q: A) => B): (r: Array<A>) => Array<B>;
export function map<A, B>(p: (q: A) => B,   r: Functor<A>):   Functor<B>;
export function map<A, B>(p: (q: A) => B): (r: Functor<A>) => Functor<B>;

export function bimap<A, B, C, D>(p: (q: A) => B, r: (s: C) => D,   t: Bifunctor<A, C>):   Bifunctor<B, D>;
export function bimap<A, B, C, D>(p: (q: A) => B, r: (s: C) => D): (t: Bifunctor<A, C>) => Bifunctor<B, D>;
export function bimap<A, B, C, D>(p: (q: A) => B): AwaitingTwo<(s: C) => D, Bifunctor<A, C>, Bifunctor<B, D>>;

export function promap<A, B, C, D>(p: (q: A) => B, r: (s: C) => D,   t: (u: B) => C):   (v: A) => D;
export function promap<A, B, C, D>(p: (q: A) => B, r: (s: C) => D): (t: (u: B) => C) => (v: A) => D;
export function promap<A, B, C, D>(p: (q: A) => B): AwaitingTwo<(s: C) => D, (u: B) => C, (v: A) => D>;
export function promap<A, B, C, D>(p: (q: A) => B, r: (s: C) => D,   t: Profunctor<B, C>):   Profunctor<A, D>;
export function promap<A, B, C, D>(p: (q: A) => B, r: (s: C) => D): (t: Profunctor<B, C>) => Profunctor<A, D>;
export function promap<A, B, C, D>(p: (q: A) => B): AwaitingTwo<(s: C) => D, Profunctor<B, C>, Profunctor<A, D>>;

export function alt<A>(p: Alt<A>,   q: Alt<A>):   Alt<A>;
export function alt<A>(p: Alt<A>): (q: Alt<A>) => Alt<A>;

export function zero<A>(p: TypeRep): Plus<A>;

export function reduce<A, B>(p: (q: B) => (r: A) => B, s: B,   t: Array<A>):   B;
export function reduce<A, B>(p: (q: B) => (r: A) => B, s: B): (t: Array<A>) => B;
export function reduce<A, B>(p: (q: B) => (r: A) => B): AwaitingTwo<B, Array<A>, B>;
export function reduce<A, B>(p: (q: B) => (r: A) => B, s: B,   t: Foldable<A>):   B;
export function reduce<A, B>(p: (q: B) => (r: A) => B, s: B): (t: Foldable<A>) => B;
export function reduce<A, B>(p: (q: B) => (r: A) => B): AwaitingTwo<B, Foldable<A>, B>;

export function traverse<A, B>(p: TypeRep, q: (r: A) => Array<B>,   s: Traversable<A>):   Array<Traversable<B>>;
export function traverse<A, B>(p: TypeRep, q: (r: A) => Array<B>): (s: Traversable<A>) => Array<Traversable<B>>;
export function traverse<A, B>(p: TypeRep): AwaitingTwo<(r: A) => Array<B>, Traversable<A>, Array<Traversable<B>>>;
export function traverse<A, B>(p: TypeRep, q: (r: A) => Applicative<B>,   s: Traversable<A>):   Applicative<Traversable<B>>;
export function traverse<A, B>(p: TypeRep, q: (r: A) => Applicative<B>): (s: Traversable<A>) => Applicative<Traversable<B>>;
export function traverse<A, B>(p: TypeRep): AwaitingTwo<(r: A) => Applicative<B>, Traversable<A>, Applicative<Traversable<B>>>;

export function sequence<A>(p: TypeRep,   q: Traversable<Array<A>>):   Array<Traversable<A>>;
export function sequence<A>(p: TypeRep): (q: Traversable<Array<A>>) => Array<Traversable<A>>;
export function sequence<A>(p: TypeRep,   q: Traversable<Applicative<A>>):   Applicative<Traversable<A>>;
export function sequence<A>(p: TypeRep): (q: Traversable<Applicative<A>>) => Applicative<Traversable<A>>;

export function ap<A, B>(p: Array<(q: A) => B>,   r: Array<A>):   Array<B>;
export function ap<A, B>(p: Array<(q: A) => B>): (r: Array<A>) => Array<B>;
export function ap<A, B>(p: Apply<(q: A) => B>,   r: Apply<A>):   Apply<B>;
export function ap<A, B>(p: Apply<(q: A) => B>): (r: Apply<A>) => Apply<B>;

export function lift2<A, B, C>(p: (q: A) => (r: B) => C, s: Apply<A>,   t: Apply<B>):   Apply<C>;
export function lift2<A, B, C>(p: (q: A) => (r: B) => C, s: Apply<A>): (t: Apply<B>) => Apply<C>;
export function lift2<A, B, C>(p: (q: A) => (r: B) => C): AwaitingTwo<Apply<A>, Apply<B>, Apply<C>>;

export function lift3<A, B, C, D>(p: (q: A) => (r: B) => (s: C) => D, t: Apply<any>, u: Apply<any>,   v: Apply<any>):   Apply<D>;
export function lift3<A, B, C, D>(p: (q: A) => (r: B) => (s: C) => D, t: Apply<any>, u: Apply<any>): (v: Apply<any>) => Apply<D>;
export function lift3<A, B, C, D>(p: (q: A) => (r: B) => (s: C) => D, t: Apply<any>): AwaitingTwo<Apply<any>, Apply<any>, Apply<D>>;
export function lift3<A, B, C, D>(p: (q: A) => (r: B) => (s: C) => D): AwaitingThree<Apply<any>, Apply<any>, Apply<any>, Apply<D>>;

export function apFirst<A, B>(p: Array<A>,   q: Array<B>):   Array<A>;
export function apFirst<A>(p: Array<A>): <B>(q: Array<B>) => Array<A>;
export function apFirst<A, B>(p: Apply<A>,   q: Apply<B>):   Apply<A>;
export function apFirst<A>(p: Apply<A>): <B>(q: Apply<B>) => Apply<A>;

export function apSecond<A, B>(p: Array<A>,   q: Array<B>):   Array<B>;
export function apSecond<A>(p: Array<A>): <B>(q: Array<B>) => Array<B>;
export function apSecond<A, B>(p: Apply<A>,   q: Apply<B>):   Apply<B>;
export function apSecond<A>(p: Apply<A>): <B>(q: Apply<B>) => Apply<B>;

export function of<A>(p: TypeRep,   q: A):   (any) => A;
export function of<A>(p: TypeRep): (q: A) => (any) => A;
export function of<A>(p: TypeRep,   q: A):   Applicative<A>;
export function of<A>(p: TypeRep): (q: A) => Applicative<A>;

export function chain<A, B, C>(p: (q: B) => (r: A) => C,   s: (t: A) => B):   (u: A) => C;
export function chain<A, B, C>(p: (q: B) => (r: A) => C): (s: (t: A) => B) => (u: A) => C;
export function chain<A, B>(p: (q: A) => Array<B>,   r: Array<A>):   Array<B>;
export function chain<A, B>(p: (q: A) => Array<B>): (r: Array<A>) => Array<B>;
export function chain<A, B>(p: (q: A) => Chain<B>,   r: Chain<A>):   Chain<B>;
export function chain<A, B>(p: (q: A) => Chain<B>): (r: Chain<A>) => Chain<B>;

//  Number

export function negate(n: ValidNumber): ValidNumber;

export function add(x: FiniteNumber,   y: FiniteNumber):   FiniteNumber;
export function add(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function sum(p: Array<FiniteNumber>):    FiniteNumber;
export function sum(p: Foldable<FiniteNumber>): FiniteNumber;

export function sub(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function sub_(x: FiniteNumber,   y: FiniteNumber):   FiniteNumber;
export function sub_(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function mult(x: FiniteNumber,   y: FiniteNumber):   FiniteNumber;
export function mult(x: FiniteNumber): (y: FiniteNumber) => FiniteNumber;

export function product(p: Array<FiniteNumber>):    FiniteNumber;
export function product(p: Foldable<FiniteNumber>): FiniteNumber;

export function div(x: FiniteNumber,   y: NonZeroFiniteNumber):   FiniteNumber;
export function div(x: FiniteNumber): (y: NonZeroFiniteNumber) => FiniteNumber;

export function mean(p: Array<FiniteNumber>):    Maybe<FiniteNumber>;
export function mean(p: Foldable<FiniteNumber>): Maybe<FiniteNumber>;

//  Integer

export function even(n: Integer): boolean;

export function odd(n: Integer): boolean;

//  Parse

export function parseDate(s: string): Maybe<Date>;

export function parseFloat(s: string): Maybe<number>;

export function parseInt(radix: Integer,   s: string):   Maybe<Integer>;
export function parseInt(radix: Integer): (s: string) => Maybe<Integer>;

export function parseJson<A>(pred: (any) => boolean,   s: string):   Maybe<A>;
export function parseJson<A>(pred: (any) => boolean): (s: string) => Maybe<A>;

//  RegExp

export function regex(flags: string,   source: string):   RegExp;
export function regex(flags: string): (source: string) => RegExp;

export function regexEscape(s: string): string;

export function test(pattern: RegExp,   s: string):   boolean;
export function test(pattern: RegExp): (s: string) => boolean;

interface MatchObj {
  match: string
  groups: Array<Maybe<string>>
}

export function match(pattern: RegExp,   s: string):   Maybe<MatchObj>;
export function match(pattern: RegExp): (s: string) => Maybe<MatchObj>;

export function matchAll(pattern: RegExp,   s: string):   Array<MatchObj>;
export function matchAll(pattern: RegExp): (s: string) => Array<MatchObj>;

//  String

export function toUpper(s: string): string;

export function toLower(s: string): string;

export function trim(s: string): string;

export function stripPrefix(prefix: string,   s: string):   Maybe<string>;
export function stripPrefix(prefix: string): (s: string) => Maybe<string>;

export function stripSuffix(suffix: string,   s: string):   Maybe<string>;
export function stripSuffix(suffix: string): (s: string) => Maybe<string>;

export function words(s: string): Array<string>;

export function unwords(xs: Array<string>): string;

export function lines(s: string): Array<string>;

export function unlines(xs: Array<string>): string;

export function splitOn(separator: string,   s: string):   Array<string>;
export function splitOn(separator: string): (s: string) => Array<string>;

export function splitOnRegex(pattern: RegExp,   s: string):   Array<string>;
export function splitOnRegex(pattern: RegExp): (s: string) => Array<string>;
