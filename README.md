# Sanctuary

[![npm](https://img.shields.io/npm/v/sanctuary.svg)](https://www.npmjs.com/package/sanctuary)
[![CircleCI](https://img.shields.io/circleci/project/github/sanctuary-js/sanctuary/master.svg)](https://circleci.com/gh/sanctuary-js/sanctuary/tree/master)
[![Gitter](https://img.shields.io/gitter/room/badges/shields.svg)](https://gitter.im/sanctuary-js/sanctuary)

Sanctuary is a JavaScript functional programming library inspired by
Haskell and PureScript. It's stricter than [Ramda][], and provides a
similar suite of functions.

Sanctuary promotes programs composed of simple, pure functions. Such
programs are easier to comprehend, test, and maintain &ndash; they are
also a pleasure to write.

Sanctuary provides two data types, [Maybe][] and [Either][], both of
which are compatible with [Fantasy Land][]. Thanks to these data types
even Sanctuary functions which may fail, such as [`head`](#head), are
composable.

Sanctuary makes it possible to write safe code without null checks.
In JavaScript it's trivial to introduce a possible run-time type error:

    words[0].toUpperCase()

If `words` is `[]` we'll get a familiar error at run-time:

    TypeError: Cannot read property 'toUpperCase' of undefined

Sanctuary gives us a fighting chance of avoiding such errors. We might
write:

    S.map(S.toUpper, S.head(words))

Sanctuary is designed to work in Node.js and in ES5-compatible browsers.

## Types

Sanctuary uses Haskell-like type signatures to describe the types of
values, including functions. `'foo'`, for example, is a member of `String`;
`[1, 2, 3]` is a member of `Array Number`. The double colon (`::`) is used
to mean "is a member of", so one could write:

    'foo' :: String
    [1, 2, 3] :: Array Number

An identifier may appear to the left of the double colon:

    Math.PI :: Number

The arrow (`->`) is used to express a function's type:

    Math.abs :: Number -> Number

That states that `Math.abs` is a unary function which takes an argument
of type `Number` and returns a value of type `Number`.

Some functions are parametrically polymorphic: their types are not fixed.
Type variables are used in the representations of such functions:

    S.I :: a -> a

`a` is a type variable. Type variables are not capitalized, so they
are differentiable from type identifiers (which are always capitalized).
By convention type variables have single-character names. The signature
above states that `S.I` takes a value of any type and returns a value of
the same type. Some signatures feature multiple type variables:

    S.K :: a -> b -> a

It must be possible to replace all occurrences of `a` with a concrete type.
The same applies for each other type variable. For the function above, the
types with which `a` and `b` are replaced may be different, but needn't be.

Since all Sanctuary functions are curried (they accept their arguments
one at a time), a binary function is represented as a unary function which
returns a unary function: `* -> * -> *`. This aligns neatly with Haskell,
which uses curried functions exclusively. In JavaScript, though, we may
wish to represent the types of functions with arities less than or greater
than one. The general form is `(<input-types>) -> <output-type>`, where
`<input-types>` comprises zero or more comma–space (<code>, </code>)
-separated type representations:

  - `() -> String`
  - `(a, b) -> a`
  - `(a, b, c) -> d`

`Number -> Number` can thus be seen as shorthand for `(Number) -> Number`.

The question mark (`?`) is used to represent types which include `null`
and `undefined` as members. `String?`, for example, represents the type
comprising `null`, `undefined`, and all strings.

Sanctuary embraces types. JavaScript doesn't support algebraic data types,
but these can be simulated by providing a group of data constructors which
return values with the same set of methods. A value of the Either type, for
example, is created via the Left constructor or the Right constructor.

It's necessary to extend Haskell's notation to describe implicit arguments
to the *methods* provided by Sanctuary's types. In `x.map(y)`, for example,
the `map` method takes an implicit argument `x` in addition to the explicit
argument `y`. The type of the value upon which a method is invoked appears
at the beginning of the signature, separated from the arguments and return
value by a squiggly arrow (`~>`). The type of the `map` method of the Maybe
type is written `Maybe a ~> (a -> b) -> Maybe b`. One could read this as:

_When the `map` method is invoked on a value of type `Maybe a`
(for any type `a`) with an argument of type `a -> b` (for any type `b`),
it returns a value of type `Maybe b`._

The squiggly arrow is also used when representing non-function properties.
`Maybe a ~> Boolean`, for example, represents a Boolean property of a value
of type `Maybe a`.

Sanctuary supports type classes: constraints on type variables. Whereas
`a -> a` implicitly supports every type, `Functor f => (a -> b) -> f a ->
f b` requires that `f` be a type which satisfies the requirements of the
Functor type class. Type-class constraints appear at the beginning of a
type signature, separated from the rest of the signature by a fat arrow
(`=>`).

### Accessible pseudotype

What is the type of values which support property access? In other words,
what is the type of which every value except `null` and `undefined` is a
member? Object is close, but `Object.create(null)` produces a value which
supports property access but which is not a member of the Object type.

Sanctuary uses the Accessible pseudotype to represent the set of values
which support property access.

### Integer pseudotype

The Integer pseudotype represents integers in the range (-2^53 .. 2^53).
It is a pseudotype because each Integer is represented by a Number value.
Sanctuary's run-time type checking asserts that a valid Number value is
provided wherever an Integer value is required.

### Type representatives

What is the type of `Number`? One answer is `a -> Number`, since it's a
function which takes an argument of any type and returns a Number value.
When provided as the first argument to [`is`](#is), though, `Number` is
really the value-level representative of the Number type.

Sanctuary uses the TypeRep pseudotype to describe type representatives.
For example:

    Number :: TypeRep Number

`Number` is the sole inhabitant of the TypeRep Number type.

## Type checking

Sanctuary functions are defined via [sanctuary-def][] to provide run-time
type checking. This is tremendously useful during development: type errors
are reported immediately, avoiding circuitous stack traces (at best) and
silent failures due to type coercion (at worst). For example:

```javascript
S.inc('XXX');
// ! TypeError: Invalid value
//
//   inc :: FiniteNumber -> FiniteNumber
//          ^^^^^^^^^^^^
//               1
//
//   1)  "XXX" :: String
//
//   The value at position 1 is not a member of ‘FiniteNumber’.
```

Compare this to the behaviour of Ramda's unchecked equivalent:

```javascript
R.inc('XXX');
// => NaN
```

There is a performance cost to run-time type checking. One may wish to
disable type checking in certain contexts to avoid paying this cost.
[`create`](#create) facilitates the creation of a Sanctuary module which
does not perform type checking.

In Node, one could use an environment variable to determine whether to
perform type checking:

```javascript
const {create, env} = require('sanctuary');

const checkTypes = process.env.NODE_ENV !== 'production';
const S = create({checkTypes: checkTypes, env: env});
```

## API

<h4 name="create"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L374">create :: { checkTypes :: Boolean, env :: Array Type } -> Module</a></code></h4>

Takes an options record and returns a Sanctuary module. `checkTypes`
specifies whether to enable type checking. The module's polymorphic
functions (such as [`I`](#I)) require each value associated with a
type variable to be a member of at least one type in the environment.

A well-typed application of a Sanctuary function will produce the same
result regardless of whether type checking is enabled. If type checking
is enabled, a badly typed application will produce an exception with a
descriptive error message.

The following snippet demonstrates defining a custom type and using
`create` to produce a Sanctuary module which is aware of that type:

```javascript
const {create, env} = require('sanctuary');
const $ = require('sanctuary-def');
const type = require('sanctuary-type-identifiers');

//    identityTypeIdent :: String
const identityTypeIdent = 'my-package/Identity';

//    Identity :: a -> Identity a
function Identity(x) {
  if (!(this instanceof Identity)) return new Identity(x);
  this.value = x;
}

Identity['@@type'] = identityTypeIdent;

Identity.prototype['fantasy-land/map'] = function(f) {
  return Identity(f(this.value));
};

Identity.prototype['fantasy-land/chain'] = function(f) {
  return f(this.value);
};

//    isIdentity :: a -> Boolean
const isIdentity = x => type(x) === identityTypeIdent;

//    identityToArray :: Identity a -> Array a
const identityToArray = identity => [identity.value];

//    IdentityType :: Type
const IdentityType =
$.UnaryType(identityTypeIdent, isIdentity, identityToArray);

const S = create({
  checkTypes: process.env.NODE_ENV !== 'production',
  env: env.concat([IdentityType]),
});
```

See also [`env`](#env).

<h4 name="env"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L436">env :: Array Type</a></code></h4>

The default environment, which may be used as is or as the basis of a
custom environment in conjunction with [`create`](#create).

### Placeholder

Sanctuary functions are designed with partial application in mind.
In many cases one can define a more specific function in terms of
a more general one simply by applying the more general function to
some (but not all) of its arguments. For example, one could define
`sum :: Foldable f => f Number -> Number` as `S.reduce(S.add, 0)`.

In some cases, though, there are multiple orders in which one may
wish to provide a function's arguments. `S.concat('prefix')` is a
function which prefixes its argument, but how would one define a
function which suffixes its argument? It's possible with the help
of [`__`](#__), the special placeholder value.

The placeholder indicates a hole to be filled at some future time.
The following are all equivalent (`_` represents the placeholder):

  - `f(x, y, z)`
  - `f(_, y, z)(x)`
  - `f(_, _, z)(x, y)`
  - `f(_, _, z)(_, y)(x)`

<h4 name="__"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L466">__ :: Placeholder</a></code></h4>

The special [placeholder](#placeholder) value.

```javascript
> S.map(S.concat('@'), ['foo', 'bar', 'baz'])
['@foo', '@bar', '@baz']

> S.map(S.concat(S.__, '?'), ['foo', 'bar', 'baz'])
['foo?', 'bar?', 'baz?']
```

### Classify

<h4 name="type"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L481">type :: Any -> String</a></code></h4>

Returns the [type identifier][] of the given value.

```javascript
> S.type(S.Just(42))
'sanctuary/Maybe'

> S.type([1, 2, 3])
'Array'
```

<h4 name="is"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L494">is :: TypeRep a -> Any -> Boolean</a></code></h4>

Takes a [type representative](#type-representatives) and a value of
any type and returns `true` if the given value is of the specified
type; `false` otherwise. Subtyping is not respected.

```javascript
> S.is(Number, 42)
true

> S.is(Object, 42)
false

> S.is(String, 42)
false
```

### Showable

<h4 name="toString"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L523">toString :: Any -> String</a></code></h4>

Alias of [`Z.toString`][].

```javascript
> S.toString(-0)
'-0'

> S.toString(['foo', 'bar', 'baz'])
'["foo", "bar", "baz"]'

> S.toString({x: 1, y: 2, z: 3})
'{"x": 1, "y": 2, "z": 3}'

> S.toString(S.Left(S.Right(S.Just(S.Nothing))))
'Left(Right(Just(Nothing)))'
```

### Fantasy Land

Sanctuary is compatible with the [Fantasy Land][] specification.

<h4 name="equals"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L546">equals :: Setoid a => a -> a -> Boolean</a></code></h4>

Curried version of [`Z.equals`][] which requires two arguments of the
same type.

To compare values of different types first use [`create`](#create) to
create a Sanctuary module with type checking disabled, then use that
module's `equals` function.

```javascript
> S.equals(0, -0)
false

> S.equals(NaN, NaN)
true

> S.equals(S.Just([1, 2, 3]), S.Just([1, 2, 3]))
true
```

<h4 name="concat"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L567">concat :: Semigroup a => a -> a -> a</a></code></h4>

Curried version of [`Z.concat`][].

```javascript
> S.concat('abc', 'def')
'abcdef'

> S.concat([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> S.concat({x: 1, y: 2}, {y: 3, z: 4})
{x: 1, y: 3, z: 4}

> S.concat(S.Just([1, 2, 3]), S.Just([4, 5, 6]))
Just([1, 2, 3, 4, 5, 6])
```

<h4 name="empty"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L586">empty :: Monoid a => TypeRep a -> a</a></code></h4>

[Type-safe][sanctuary-def] version of [`Z.empty`][].

```javascript
> S.empty(String)
''

> S.empty(Array)
[]

> S.empty(Object)
{}
```

<h4 name="map"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L602">map :: Functor f => (a -> b) -> f a -> f b</a></code></h4>

Curried version of [`Z.map`][].

```javascript
> S.map(Math.sqrt, [1, 4, 9])
[1, 2, 3]

> S.map(Math.sqrt, {x: 1, y: 4, z: 9})
{x: 1, y: 2, z: 3}

> S.map(Math.sqrt, S.Just(9))
Just(3)

> S.map(Math.sqrt, S.Right(9))
Right(3)
```

Replacing `Functor f => f` with `Function x` produces the B combinator
from combinatory logic (i.e. [`compose`](#compose)):

    Functor f => (a -> b) -> f a -> f b
    (a -> b) -> Function x a -> Function x b
    (a -> c) -> Function x a -> Function x c
    (b -> c) -> Function x b -> Function x c
    (b -> c) -> Function a b -> Function a c
    (b -> c) -> (a -> b) -> (a -> c)

```javascript
> S.map(Math.sqrt, S.inc)(99)
10
```

<h4 name="bimap"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L636">bimap :: Bifunctor f => (a -> b) -> (c -> d) -> f a c -> f b d</a></code></h4>

Curried version of [`Z.bimap`][].

```javascript
> S.bimap(S.toUpper, Math.sqrt, S.Left('foo'))
Left('FOO')

> S.bimap(S.toUpper, Math.sqrt, S.Right(64))
Right(8)
```

<h4 name="promap"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L653">promap :: Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d</a></code></h4>

Curried version of [`Z.promap`][].

```javascript
> S.promap(Math.abs, S.inc, Math.sqrt)(-100)
11
```

<h4 name="alt"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L667">alt :: Alt f => f a -> f a -> f a</a></code></h4>

Curried version of [`Z.alt`][].

```javascript
> S.alt(S.Nothing, S.Just(1))
Just(1)

> S.alt(S.Just(2), S.Just(3))
Just(2)

> S.alt(S.Left('X'), S.Right(1))
Right(1)

> S.alt(S.Right(2), S.Right(3))
Right(2)
```

<h4 name="zero"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L686">zero :: Plus f => TypeRep f -> f a</a></code></h4>

[Type-safe][sanctuary-def] version of [`Z.zero`][].

```javascript
> S.zero(Array)
[]

> S.zero(Object)
{}

> S.zero(S.Maybe)
Nothing
```

<h4 name="reduce"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L703">reduce :: Foldable f => (b -> a -> b) -> b -> f a -> b</a></code></h4>

Takes a curried binary function, an initial value, and a [Foldable][],
and applies the function to the initial value and the Foldable's first
value, then applies the function to the result of the previous
application and the Foldable's second value. Repeats this process
until each of the Foldable's values has been used. Returns the initial
value if the Foldable is empty; the result of the final application
otherwise.

See also [`reduce_`](#reduce_).

```javascript
> S.reduce(S.add, 0, [1, 2, 3, 4, 5])
15

> S.reduce(xs => x => [x].concat(xs), [], [1, 2, 3, 4, 5])
[5, 4, 3, 2, 1]
```

<h4 name="reduce_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L728">reduce_ :: Foldable f => ((b, a) -> b) -> b -> f a -> b</a></code></h4>

Variant of [`reduce`](#reduce) which takes an uncurried binary function.

<h4 name="traverse"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L737">traverse :: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f (t b)</a></code></h4>

Curried version of [`Z.traverse`][].

```javascript
> S.traverse(Array, S.words, S.Just('foo bar baz'))
[Just('foo'), Just('bar'), Just('baz')]

> S.traverse(Array, S.words, S.Nothing)
[Nothing]

> S.traverse(S.Maybe, S.parseInt(16), ['A', 'B', 'C'])
Just([10, 11, 12])

> S.traverse(S.Maybe, S.parseInt(16), ['A', 'B', 'C', 'X'])
Nothing
```

<h4 name="sequence"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L760">sequence :: (Applicative f, Traversable t) => TypeRep f -> t (f a) -> f (t a)</a></code></h4>

Curried version of [`Z.sequence`][].

```javascript
> S.sequence(Array, S.Just([1, 2, 3]))
[Just(1), Just(2), Just(3)]

> S.sequence(S.Maybe, [S.Just(1), S.Just(2), S.Just(3)])
Just([1, 2, 3])

> S.sequence(S.Maybe, [S.Just(1), S.Just(2), S.Nothing])
Nothing
```

<h4 name="ap"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L780">ap :: Apply f => f (a -> b) -> f a -> f b</a></code></h4>

Curried version of [`Z.ap`][].

```javascript
> S.ap([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
[1, 2, 3, 4, 5, 1, 16, 81, 256, 625]

> S.ap(S.Just(Math.sqrt), S.Just(64))
Just(8)
```

Replacing `Apply f => f` with `Function x` produces the S combinator
from combinatory logic:

    Apply f => f (a -> b) -> f a -> f b
    Function x (a -> b) -> Function x a -> Function x b
    Function x (a -> c) -> Function x a -> Function x c
    Function x (b -> c) -> Function x b -> Function x c
    Function a (b -> c) -> Function a b -> Function a c
    (a -> b -> c) -> (a -> b) -> (a -> c)

```javascript
> S.ap(s => n => s.slice(0, n), s => Math.ceil(s.length / 2))('Haskell')
'Hask'
```

<h4 name="lift2"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L812">lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c</a></code></h4>

Promotes a curried binary function to a function which operates on two
[Apply][]s.

```javascript
> S.lift2(S.add, S.Just(2), S.Just(3))
Just(5)

> S.lift2(S.add, S.Just(2), S.Nothing)
Nothing

> S.lift2(S.and, S.Just(true), S.Just(true))
Just(true)

> S.lift2(S.and, S.Just(true), S.Just(false))
Just(false)
```

<h4 name="lift3"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L833">lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d</a></code></h4>

Promotes a curried ternary function to a function which operates on three
[Apply][]s.

```javascript
> S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Just([1, 2, 3]))
Just(6)

> S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Nothing)
Nothing
```

<h4 name="apFirst"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L851">apFirst :: Apply f => f a -> f b -> f a</a></code></h4>

Curried version of [`Z.apFirst`][]. Combines two effectful actions,
keeping only the result of the first. Equivalent to Haskell's `(<*)`
function.

See also [`apSecond`](#apSecond).

```javascript
> S.apFirst([1, 2], [3, 4])
[1, 1, 2, 2]

> S.apFirst(S.Just(1), S.Just(2))
Just(1)
```

<h4 name="apSecond"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L868">apSecond :: Apply f => f a -> f b -> f b</a></code></h4>

Curried version of [`Z.apSecond`][]. Combines two effectful actions,
keeping only the result of the second. Equivalent to Haskell's `(*>)`
function.

See also [`apFirst`](#apFirst).

```javascript
> S.apSecond([1, 2], [3, 4])
[3, 4, 3, 4]

> S.apSecond(S.Just(1), S.Just(2))
Just(2)
```

<h4 name="of"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L885">of :: Applicative f => TypeRep f -> a -> f a</a></code></h4>

Curried version of [`Z.of`][].

```javascript
> S.of(Array, 42)
[42]

> S.of(Function, 42)(null)
42

> S.of(S.Maybe, 42)
Just(42)

> S.of(S.Either, 42)
Right(42)
```

<h4 name="chain"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L908">chain :: Chain m => (a -> m b) -> m a -> m b</a></code></h4>

Curried version of [`Z.chain`][].

```javascript
> S.chain(x => [x, x], [1, 2, 3])
[1, 1, 2, 2, 3, 3]

> S.chain(n => s => s.slice(0, n), s => Math.ceil(s.length / 2))('slice')
'sli'

> S.chain(S.parseInt(10), S.Just('123'))
Just(123)

> S.chain(S.parseInt(10), S.Just('XXX'))
Nothing
```

<h4 name="join"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L927">join :: Chain m => m (m a) -> m a</a></code></h4>

[Type-safe][sanctuary-def] version of [`Z.join`][].
Removes one level of nesting from a nested monadic structure.

```javascript
> S.join([[1], [2], [3]])
[1, 2, 3]

> S.join([[[1, 2, 3]]])
[[1, 2, 3]]

> S.join(S.Just(S.Just(1)))
S.Just(1)
```

Replacing `Chain m => m` with `Function x` produces the W combinator
from combinatory logic:

    Chain m => m (m a) -> m a
    Function x (Function x a) -> Function x a
    (x -> x -> a) -> (x -> a)

```javascript
> S.join(S.concat)('abc')
'abcabc'
```

<h4 name="chainRec"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L956">chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b</a></code></h4>

Performs a [`chain`](#chain)-like computation with constant stack usage.
Similar to [`Z.chainRec`][], but curried and more convenient due to the
use of the Either type to indicate completion (via a Right).

```javascript
> S.chainRec(Array,
.            s => s.length === 2 ? S.map(S.Right, [s + '!', s + '?'])
.                                : S.map(S.Left, [s + 'o', s + 'n']),
.            '')
['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
```

<h4 name="extend"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L981">extend :: Extend w => (w a -> b) -> w a -> w b</a></code></h4>

Curried version of [`Z.extend`][].

```javascript
> S.extend(xs => xs.length, ['foo', 'bar', 'baz', 'quux'])
[4]
```

<h4 name="extract"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L992">extract :: Comonad w => w a -> a</a></code></h4>

[Type-safe][sanctuary-def] version of [`Z.extract`][].

<h4 name="filter"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L998">filter :: (Applicative f, Foldable f, Monoid (f a)) => (a -> Boolean) -> f a -> f a</a></code></h4>

Curried version of [`Z.filter`][].

See also [`filterM`](#filterM).

```javascript
> S.filter(S.odd, [1, 2, 3, 4, 5])
[1, 3, 5]

> S.filter(S.odd, S.Just(9))
Just(9)

> S.filter(S.odd, S.Just(4))
Nothing
```

<h4 name="filterM"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1020">filterM :: (Monad m, Monoid (m a)) => (a -> Boolean) -> m a -> m a</a></code></h4>

Curried version of [`Z.filterM`][].

See also [`filter`](#filter).

```javascript
> S.filterM(S.odd, [1, 2, 3, 4, 5])
[1, 3, 5]

> S.filterM(S.odd, S.Just(9))
Just(9)

> S.filterM(S.odd, S.Just(4))
Nothing
```

### Combinator

<h4 name="I"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1044">I :: a -> a</a></code></h4>

The I combinator. Returns its argument. Equivalent to Haskell's `id`
function.

```javascript
> S.I('foo')
'foo'
```

<h4 name="K"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1058">K :: a -> b -> a</a></code></h4>

The K combinator. Takes two values and returns the first. Equivalent to
Haskell's `const` function.

```javascript
> S.K('foo', 'bar')
'foo'

> S.map(S.K(42), S.range(0, 5))
[42, 42, 42, 42, 42]
```

<h4 name="A"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1075">A :: (a -> b) -> a -> b</a></code></h4>

The A combinator. Takes a function and a value, and returns the result
of applying the function to the value. Equivalent to Haskell's `($)`
function.

```javascript
> S.A(S.inc, 42)
43

> S.map(S.A(S.__, 100), [S.inc, Math.sqrt])
[101, 10]
```

<h4 name="T"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1093">T :: a -> (a -> b) -> b</a></code></h4>

The T ([thrush][]) combinator. Takes a value and a function, and returns
the result of applying the function to the value. Equivalent to Haskell's
`(&)` function.

```javascript
> S.T(42, S.inc)
43

> S.map(S.T(100), [S.inc, Math.sqrt])
[101, 10]
```

### Function

<h4 name="curry2"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1113">curry2 :: ((a, b) -> c) -> a -> b -> c</a></code></h4>

Curries the given binary function.

```javascript
> S.map(S.curry2(Math.pow)(10), [1, 2, 3])
[10, 100, 1000]

> S.map(S.curry2(Math.pow, 10), [1, 2, 3])
[10, 100, 1000]
```

<h4 name="curry3"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1133">curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d</a></code></h4>

Curries the given ternary function.

```javascript
> global.replaceString = S.curry3((what, replacement, string) =>
.   string.replace(what, replacement)
. )
replaceString

> replaceString('banana')('orange')('banana icecream')
'orange icecream'

> replaceString('banana', 'orange', 'banana icecream')
'orange icecream'
```

<h4 name="curry4"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1158">curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e</a></code></h4>

Curries the given quaternary function.

```javascript
> global.createRect = S.curry4((x, y, width, height) =>
.   ({x, y, width, height})
. )
createRect

> createRect(0)(0)(10)(10)
{x: 0, y: 0, width: 10, height: 10}

> createRect(0, 0, 10, 10)
{x: 0, y: 0, width: 10, height: 10}
```

<h4 name="curry5"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1183">curry5 :: ((a, b, c, d, e) -> f) -> a -> b -> c -> d -> e -> f</a></code></h4>

Curries the given quinary function.

```javascript
> global.toUrl = S.curry5((protocol, creds, hostname, port, pathname) =>
.   protocol + '//' +
.   S.maybe('', _ => _.username + ':' + _.password + '@', creds) +
.   hostname +
.   S.maybe('', S.concat(':'), port) +
.   pathname
. )
toUrl

> toUrl('https:')(S.Nothing)('example.com')(S.Just('443'))('/foo/bar')
'https://example.com:443/foo/bar'

> toUrl('https:', S.Nothing, 'example.com', S.Just('443'), '/foo/bar')
'https://example.com:443/foo/bar'
```

<h4 name="flip"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1212">flip :: (a -> b -> c) -> b -> a -> c</a></code></h4>

Takes a curried binary function and two values, and returns the
result of applying the function to the values in reverse order.

This is the C combinator from combinatory logic.

```javascript
> S.flip(S.concat, 'foo', 'bar')
'barfoo'
```

<h4 name="flip_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1228">flip_ :: ((a, b) -> c) -> b -> a -> c</a></code></h4>

Variant of [`flip`](#flip) which takes an uncurried binary function.

### Composition

<h4 name="compose"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1238">compose :: (b -> c) -> (a -> b) -> a -> c</a></code></h4>

Composes two unary functions, from right to left. Equivalent to Haskell's
`(.)` function.

This is the B combinator from combinatory logic.

See also [`pipe`](#pipe).

```javascript
> S.compose(Math.sqrt, S.inc)(99)
10
```

<h4 name="pipe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1256">pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n</a></code></h4>

Takes an array of functions assumed to be unary and a value of any type,
and returns the result of applying the sequence of transformations to
the initial value.

In general terms, `pipe` performs left-to-right composition of an array
of functions. `pipe([f, g, h], x)` is equivalent to `h(g(f(x)))`.

```javascript
> S.pipe([S.inc, Math.sqrt, S.dec])(99)
9
```

<h4 name="on"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1274">on :: (b -> b -> c) -> (a -> b) -> a -> a -> c</a></code></h4>

Takes a binary function `f`, a unary function `g`, and two
values `x` and `y`. Returns `f(g(x))(g(y))`.

See also [`on_`](#on_).

```javascript
> S.on(S.concat, S.reverse, [1, 2, 3], [4, 5, 6])
[3, 2, 1, 6, 5, 4]
```

<h4 name="on_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1290">on_ :: ((b, b) -> c) -> (a -> b) -> a -> a -> c</a></code></h4>

Variant of [`on`](#on) which takes an uncurried binary function.

### Maybe type

The Maybe type represents optional values: a value of type `Maybe a` is
either a Just whose value is of type `a` or Nothing (with no value).

The Maybe type satisfies the [Setoid][], [Monoid][], [Monad][],
[Alternative][], [Traversable][], and [Extend][] specifications.

<h4 name="MaybeType"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1306">MaybeType :: Type -> Type</a></code></h4>

A [`UnaryType`][UnaryType] for use with [sanctuary-def][].

<h4 name="Maybe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1311">Maybe :: TypeRep Maybe</a></code></h4>

The [type representative](#type-representatives) for the Maybe type.

<h4 name="Nothing"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1324">Nothing :: Maybe a</a></code></h4>

Nothing.

```javascript
> S.Nothing
Nothing
```

<h4 name="Just"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1334">Just :: a -> Maybe a</a></code></h4>

Takes a value of any type and returns a Just with the given value.

```javascript
> S.Just(42)
Just(42)
```

<h4 name="Maybe.@@type"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1347">Maybe.@@type :: String</a></code></h4>

Maybe type identifier, `'sanctuary/Maybe'`.

<h4 name="Maybe.fantasy-land/empty"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1352">Maybe.fantasy-land/empty :: () -> Maybe a</a></code></h4>

Returns Nothing.

```javascript
> S.empty(S.Maybe)
Nothing
```

<h4 name="Maybe.fantasy-land/of"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1362">Maybe.fantasy-land/of :: a -> Maybe a</a></code></h4>

Takes a value of any type and returns a Just with the given value.

```javascript
> S.of(S.Maybe, 42)
Just(42)
```

<h4 name="Maybe.fantasy-land/zero"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1372">Maybe.fantasy-land/zero :: () -> Maybe a</a></code></h4>

Returns Nothing.

```javascript
> S.zero(S.Maybe)
Nothing
```

<h4 name="Maybe.prototype.isNothing"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1382">Maybe#isNothing :: Maybe a ~> Boolean</a></code></h4>

`true` if `this` is Nothing; `false` if `this` is a Just.

```javascript
> S.Nothing.isNothing
true

> S.Just(42).isNothing
false
```

<h4 name="Maybe.prototype.isJust"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1394">Maybe#isJust :: Maybe a ~> Boolean</a></code></h4>

`true` if `this` is a Just; `false` if `this` is Nothing.

```javascript
> S.Just(42).isJust
true

> S.Nothing.isJust
false
```

<h4 name="Maybe.prototype.toString"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1406">Maybe#toString :: Maybe a ~> () -> String</a></code></h4>

Returns the string representation of the Maybe.

```javascript
> S.toString(S.Nothing)
'Nothing'

> S.toString(S.Just([1, 2, 3]))
'Just([1, 2, 3])'
```

<h4 name="Maybe.prototype.inspect"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1421">Maybe#inspect :: Maybe a ~> () -> String</a></code></h4>

Returns the string representation of the Maybe. This method is used by
`util.inspect` and the REPL to format a Maybe for display.

See also [`Maybe#toString`][].

```javascript
> S.Nothing.inspect()
'Nothing'

> S.Just([1, 2, 3]).inspect()
'Just([1, 2, 3])'
```

<h4 name="Maybe.prototype.fantasy-land/equals"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1437">Maybe#fantasy-land/equals :: Maybe a ~> Maybe a -> Boolean</a></code></h4>

Takes a value of the same type and returns `true` if:

  - it is Nothing and `this` is Nothing; or

  - it is a Just and `this` is a Just, and their values are equal
    according to [`equals`](#equals).

```javascript
> S.equals(S.Nothing, S.Nothing)
true

> S.equals(S.Just([1, 2, 3]), S.Just([1, 2, 3]))
true

> S.equals(S.Just([1, 2, 3]), S.Just([3, 2, 1]))
false

> S.equals(S.Just([1, 2, 3]), S.Nothing)
false
```

<h4 name="Maybe.prototype.fantasy-land/concat"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1464">Maybe#fantasy-land/concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a</a></code></h4>

Returns the result of concatenating two Maybe values of the same type.
`a` must have a [Semigroup][].

If `this` is Nothing and the argument is Nothing, this method returns
Nothing.

If `this` is a Just and the argument is a Just, this method returns a
Just whose value is the result of concatenating this Just's value and
the given Just's value.

Otherwise, this method returns the Just.

```javascript
> S.concat(S.Nothing, S.Nothing)
Nothing

> S.concat(S.Just([1, 2, 3]), S.Just([4, 5, 6]))
Just([1, 2, 3, 4, 5, 6])

> S.concat(S.Nothing, S.Just([1, 2, 3]))
Just([1, 2, 3])

> S.concat(S.Just([1, 2, 3]), S.Nothing)
Just([1, 2, 3])
```

<h4 name="Maybe.prototype.fantasy-land/map"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1497">Maybe#fantasy-land/map :: Maybe a ~> (a -> b) -> Maybe b</a></code></h4>

Takes a function and returns `this` if `this` is Nothing; otherwise
it returns a Just whose value is the result of applying the function
to this Just's value.

```javascript
> S.map(Math.sqrt, S.Nothing)
Nothing

> S.map(Math.sqrt, S.Just(9))
Just(3)
```

<h4 name="Maybe.prototype.fantasy-land/ap"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1514">Maybe#fantasy-land/ap :: Maybe a ~> Maybe (a -> b) -> Maybe b</a></code></h4>

Takes a Maybe and returns Nothing unless `this` is a Just *and* the
argument is a Just, in which case it returns a Just whose value is
the result of applying the given Just's value to this Just's value.

```javascript
> S.ap(S.Nothing, S.Nothing)
Nothing

> S.ap(S.Nothing, S.Just(9))
Nothing

> S.ap(S.Just(Math.sqrt), S.Nothing)
Nothing

> S.ap(S.Just(Math.sqrt), S.Just(9))
Just(3)
```

<h4 name="Maybe.prototype.fantasy-land/chain"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1537">Maybe#fantasy-land/chain :: Maybe a ~> (a -> Maybe b) -> Maybe b</a></code></h4>

Takes a function and returns `this` if `this` is Nothing; otherwise
it returns the result of applying the function to this Just's value.

```javascript
> S.chain(S.parseFloat, S.Nothing)
Nothing

> S.chain(S.parseFloat, S.Just('xxx'))
Nothing

> S.chain(S.parseFloat, S.Just('12.34'))
Just(12.34)
```

<h4 name="Maybe.prototype.fantasy-land/alt"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1556">Maybe#fantasy-land/alt :: Maybe a ~> Maybe a -> Maybe a</a></code></h4>

Chooses between `this` and the other Maybe provided as an argument.
Returns `this` if `this` is a Just; the other Maybe otherwise.

```javascript
> S.alt(S.Nothing, S.Nothing)
Nothing

> S.alt(S.Nothing, S.Just(1))
Just(1)

> S.alt(S.Just(2), S.Nothing)
Just(2)

> S.alt(S.Just(3), S.Just(4))
Just(3)
```

<h4 name="Maybe.prototype.fantasy-land/reduce"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1578">Maybe#fantasy-land/reduce :: Maybe a ~> ((b, a) -> b, b) -> b</a></code></h4>

Takes a function and an initial value of any type, and returns:

  - the initial value if `this` is Nothing; otherwise

  - the result of applying the function to the initial value and this
    Just's value.

```javascript
> S.reduce_(Math.pow, 10, S.Nothing)
10

> S.reduce_(Math.pow, 10, S.Just(3))
1000
```

<h4 name="Maybe.prototype.fantasy-land/traverse"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1598">Maybe#fantasy-land/traverse :: Applicative f => Maybe a ~> (TypeRep f, a -> f b) -> f (Maybe b)</a></code></h4>

Takes two functions which both return values of the same [Applicative][],
(the second of which must be that type's [`of`][] function) and returns:

  - the result of applying `of` to `this` if `this` is Nothing; otherwise

  - the result of mapping [`Just`](#Just) over the result of applying the
    first function to this Just's value.

```javascript
> S.traverse(Array, S.words, S.Nothing)
[Nothing]

> S.traverse(Array, S.words, S.Just('foo bar baz'))
[Just('foo'), Just('bar'), Just('baz')]
```

<h4 name="Maybe.prototype.fantasy-land/extend"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1619">Maybe#fantasy-land/extend :: Maybe a ~> (Maybe a -> b) -> Maybe b</a></code></h4>

Takes a function and returns `this` if `this` is Nothing; otherwise
it returns a Just whose value is the result of applying the function
to `this`.

```javascript
> S.extend(x => x.value + 1, S.Nothing)
Nothing

> S.extend(x => x.value + 1, S.Just(42))
Just(43)
```

<h4 name="isNothing"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1636">isNothing :: Maybe a -> Boolean</a></code></h4>

Returns `true` if the given Maybe is Nothing; `false` if it is a Just.

```javascript
> S.isNothing(S.Nothing)
true

> S.isNothing(S.Just(42))
false
```

<h4 name="isJust"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1652">isJust :: Maybe a -> Boolean</a></code></h4>

Returns `true` if the given Maybe is a Just; `false` if it is Nothing.

```javascript
> S.isJust(S.Just(42))
true

> S.isJust(S.Nothing)
false
```

<h4 name="fromMaybe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1668">fromMaybe :: a -> Maybe a -> a</a></code></h4>

Takes a default value and a Maybe, and returns the Maybe's value
if the Maybe is a Just; the default value otherwise.

See also [`fromMaybe_`](#fromMaybe_) and
[`maybeToNullable`](#maybeToNullable).

```javascript
> S.fromMaybe(0, S.Just(42))
42

> S.fromMaybe(0, S.Nothing)
0
```

<h4 name="fromMaybe_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1688">fromMaybe_ :: (() -> a) -> Maybe a -> a</a></code></h4>

Variant of [`fromMaybe`](#fromMaybe) which takes a thunk so the default
value is only computed if required.

```javascript
> function fib(n) { return n <= 1 ? n : fib(n - 2) + fib(n - 1); }

> S.fromMaybe_(() => fib(30), S.Just(1000000))
1000000

> S.fromMaybe_(() => fib(30), S.Nothing)
832040
```

<h4 name="maybeToNullable"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1707">maybeToNullable :: Maybe a -> Nullable a</a></code></h4>

Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
[Nullable][] is defined in [sanctuary-def][].

See also [`fromMaybe`](#fromMaybe).

```javascript
> S.maybeToNullable(S.Just(42))
42

> S.maybeToNullable(S.Nothing)
null
```

<h4 name="toMaybe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1727">toMaybe :: a? -> Maybe a</a></code></h4>

Takes a value and returns Nothing if the value is `null` or `undefined`;
Just the value otherwise.

```javascript
> S.toMaybe(null)
Nothing

> S.toMaybe(42)
Just(42)
```

<h4 name="maybe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1744">maybe :: b -> (a -> b) -> Maybe a -> b</a></code></h4>

Takes a value of any type, a function, and a Maybe. If the Maybe is
a Just, the return value is the result of applying the function to
the Just's value. Otherwise, the first argument is returned.

See also [`maybe_`](#maybe_).

```javascript
> S.maybe(0, S.prop('length'), S.Just('refuge'))
6

> S.maybe(0, S.prop('length'), S.Nothing)
0
```

<h4 name="maybe_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1764">maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b</a></code></h4>

Variant of [`maybe`](#maybe) which takes a thunk so the default value
is only computed if required.

```javascript
> function fib(n) { return n <= 1 ? n : fib(n - 2) + fib(n - 1); }

> S.maybe_(() => fib(30), Math.sqrt, S.Just(1000000))
1000

> S.maybe_(() => fib(30), Math.sqrt, S.Nothing)
832040
```

<h4 name="justs"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1783">justs :: Array (Maybe a) -> Array a</a></code></h4>

Takes an array of Maybes and returns an array containing each Just's
value. Equivalent to Haskell's `catMaybes` function.

See also [`lefts`](#lefts) and [`rights`](#rights).

```javascript
> S.justs([S.Just('foo'), S.Nothing, S.Just('baz')])
['foo', 'baz']
```

<h4 name="mapMaybe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1802">mapMaybe :: (a -> Maybe b) -> Array a -> Array b</a></code></h4>

Takes a function and an array, applies the function to each element of
the array, and returns an array of "successful" results. If the result of
applying the function to an element of the array is Nothing, the result
is discarded; if the result is a Just, the Just's value is included in
the output array.

In general terms, `mapMaybe` filters an array while mapping over it.

```javascript
> S.mapMaybe(S.head, [[], [1, 2, 3], [], [4, 5, 6], []])
[1, 4]
```

<h4 name="encase"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1822">encase :: (a -> b) -> a -> Maybe b</a></code></h4>

Takes a unary function `f` which may throw and a value `x` of any type,
and applies `f` to `x` inside a `try` block. If an exception is caught,
the return value is Nothing; otherwise the return value is Just the
result of applying `f` to `x`.

See also [`encaseEither`](#encaseEither).

```javascript
> S.encase(eval, '1 + 1')
Just(2)

> S.encase(eval, '1 +')
Nothing
```

<h4 name="encase2"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1847">encase2 :: (a -> b -> c) -> a -> b -> Maybe c</a></code></h4>

Binary version of [`encase`](#encase).

See also [`encase2_`](#encase2_).

<h4 name="encase2_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1857">encase2_ :: ((a, b) -> c) -> a -> b -> Maybe c</a></code></h4>

Variant of [`encase2`](#encase2) which takes an uncurried binary
function.

<h4 name="encase3"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1871">encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d</a></code></h4>

Ternary version of [`encase`](#encase).

See also [`encase3_`](#encase3_).

<h4 name="encase3_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1882">encase3_ :: ((a, b, c) -> d) -> a -> b -> c -> Maybe d</a></code></h4>

Variant of [`encase3`](#encase3) which takes an uncurried ternary
function.

<h4 name="maybeToEither"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1899">maybeToEither :: a -> Maybe b -> Either a b</a></code></h4>

Converts a Maybe to an Either. Nothing becomes a Left (containing the
first argument); a Just becomes a Right.

See also [`eitherToMaybe`](#eitherToMaybe).

```javascript
> S.maybeToEither('Expecting an integer', S.parseInt(10, 'xyz'))
Left('Expecting an integer')

> S.maybeToEither('Expecting an integer', S.parseInt(10, '42'))
Right(42)
```

### Either type

The Either type represents values with two possibilities: a value of type
`Either a b` is either a Left whose value is of type `a` or a Right whose
value is of type `b`.

The Either type satisfies the [Setoid][], [Semigroup][], [Monad][],
[Alt][], [Traversable][], [Extend][], and [Bifunctor][] specifications.

<h4 name="EitherType"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1928">EitherType :: Type -> Type -> Type</a></code></h4>

A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

<h4 name="Either"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1933">Either :: TypeRep Either</a></code></h4>

The [type representative](#type-representatives) for the Either type.

<h4 name="Left"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1946">Left :: a -> Either a b</a></code></h4>

Takes a value of any type and returns a Left with the given value.

```javascript
> S.Left('Cannot divide by zero')
Left('Cannot divide by zero')
```

<h4 name="Right"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1959">Right :: b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.

```javascript
> S.Right(42)
Right(42)
```

<h4 name="Either.@@type"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1972">Either.@@type :: String</a></code></h4>

Either type identifier, `'sanctuary/Either'`.

<h4 name="Either.fantasy-land/of"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1977">Either.fantasy-land/of :: b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.

```javascript
> S.of(S.Either, 42)
Right(42)
```

<h4 name="Either.prototype.isLeft"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1987">Either#isLeft :: Either a b ~> Boolean</a></code></h4>

`true` if `this` is a Left; `false` if `this` is a Right.

```javascript
> S.Left('Cannot divide by zero').isLeft
true

> S.Right(42).isLeft
false
```

<h4 name="Either.prototype.isRight"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L1999">Either#isRight :: Either a b ~> Boolean</a></code></h4>

`true` if `this` is a Right; `false` if `this` is a Left.

```javascript
> S.Right(42).isRight
true

> S.Left('Cannot divide by zero').isRight
false
```

<h4 name="Either.prototype.toString"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2011">Either#toString :: Either a b ~> () -> String</a></code></h4>

Returns the string representation of the Either.

```javascript
> S.toString(S.Left('Cannot divide by zero'))
'Left("Cannot divide by zero")'

> S.toString(S.Right([1, 2, 3]))
'Right([1, 2, 3])'
```

<h4 name="Either.prototype.inspect"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2027">Either#inspect :: Either a b ~> () -> String</a></code></h4>

Returns the string representation of the Either. This method is used by
`util.inspect` and the REPL to format a Either for display.

See also [`Either#toString`][].

```javascript
> S.Left('Cannot divide by zero').inspect()
'Left("Cannot divide by zero")'

> S.Right([1, 2, 3]).inspect()
'Right([1, 2, 3])'
```

<h4 name="Either.prototype.fantasy-land/equals"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2043">Either#fantasy-land/equals :: Either a b ~> Either a b -> Boolean</a></code></h4>

Takes a value of the same type and returns `true` if:

  - it is a Left and `this` is a Left, and their values are equal
    according to [`equals`](#equals); or

  - it is a Right and `this` is a Right, and their values are equal
    according to [`equals`](#equals).

```javascript
> S.equals(S.Right([1, 2, 3]), S.Right([1, 2, 3]))
true

> S.equals(S.Right([1, 2, 3]), S.Left([1, 2, 3]))
false
```

<h4 name="Either.prototype.fantasy-land/concat"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2064">Either#fantasy-land/concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b</a></code></h4>

Returns the result of concatenating two Either values of the same type.
`a` must have a [Semigroup][], as must `b`.

If `this` is a Left and the argument is a Left, this method returns a
Left whose value is the result of concatenating this Left's value and
the given Left's value.

If `this` is a Right and the argument is a Right, this method returns a
Right whose value is the result of concatenating this Right's value and
the given Right's value.

Otherwise, this method returns the Right.

```javascript
> S.concat(S.Left('abc'), S.Left('def'))
Left('abcdef')

> S.concat(S.Right([1, 2, 3]), S.Right([4, 5, 6]))
Right([1, 2, 3, 4, 5, 6])

> S.concat(S.Left('abc'), S.Right([1, 2, 3]))
Right([1, 2, 3])

> S.concat(S.Right([1, 2, 3]), S.Left('abc'))
Right([1, 2, 3])
```

<h4 name="Either.prototype.fantasy-land/map"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2098">Either#fantasy-land/map :: Either a b ~> (b -> c) -> Either a c</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise it
returns a Right whose value is the result of applying the function to
this Right's value.

See also [`Either#fantasy-land/bimap`][].

```javascript
> S.map(Math.sqrt, S.Left('Cannot divide by zero'))
Left('Cannot divide by zero')

> S.map(Math.sqrt, S.Right(9))
Right(3)
```

<h4 name="Either.prototype.fantasy-land/bimap"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2117">Either#fantasy-land/bimap :: Either a b ~> (a -> c, b -> d) -> Either c d</a></code></h4>

Takes two functions and returns:

  - a Left whose value is the result of applying the first function
    to this Left's value if `this` is a Left; otherwise

  - a Right whose value is the result of applying the second function
    to this Right's value.

Similar to [`Either#fantasy-land/map`][], but supports mapping over the
left side as well as the right side.

```javascript
> S.bimap(S.toUpper, S.inc, S.Left('abc'))
Left('ABC')

> S.bimap(S.toUpper, S.inc, S.Right(42))
Right(43)
```

<h4 name="Either.prototype.fantasy-land/ap"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2141">Either#fantasy-land/ap :: Either a b ~> Either a (b -> c) -> Either a c</a></code></h4>

Takes an Either and returns a Left unless `this` is a Right *and* the
argument is a Right, in which case it returns a Right whose value is
the result of applying the given Right's value to this Right's value.

```javascript
> S.ap(S.Left('No such function'), S.Left('Cannot divide by zero'))
Left('No such function')

> S.ap(S.Left('No such function'), S.Right(9))
Left('No such function')

> S.ap(S.Right(Math.sqrt), S.Left('Cannot divide by zero'))
Left('Cannot divide by zero')

> S.ap(S.Right(Math.sqrt), S.Right(9))
Right(3)
```

<h4 name="Either.prototype.fantasy-land/chain"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2164">Either#fantasy-land/chain :: Either a b ~> (b -> Either a c) -> Either a c</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise
it returns the result of applying the function to this Right's value.

```javascript
> global.sqrt = n =>
.   n < 0 ? S.Left('Cannot represent square root of negative number')
.         : S.Right(Math.sqrt(n))
sqrt

> S.chain(sqrt, S.Left('Cannot divide by zero'))
Left('Cannot divide by zero')

> S.chain(sqrt, S.Right(-1))
Left('Cannot represent square root of negative number')

> S.chain(sqrt, S.Right(25))
Right(5)
```

<h4 name="Either.prototype.fantasy-land/alt"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2188">Either#fantasy-land/alt :: Either a b ~> Either a b -> Either a b</a></code></h4>

Chooses between `this` and the other Either provided as an argument.
Returns `this` if `this` is a Right; the other Either otherwise.

```javascript
> S.alt(S.Left('A'), S.Left('B'))
Left('B')

> S.alt(S.Left('C'), S.Right(1))
Right(1)

> S.alt(S.Right(2), S.Left('D'))
Right(2)

> S.alt(S.Right(3), S.Right(4))
Right(3)
```

<h4 name="Either.prototype.fantasy-land/reduce"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2210">Either#fantasy-land/reduce :: Either a b ~> ((c, b) -> c, c) -> c</a></code></h4>

Takes a function and an initial value of any type, and returns:

  - the initial value if `this` is a Left; otherwise

  - the result of applying the function to the initial value and this
    Right's value.

```javascript
> S.reduce_(Math.pow, 10, S.Left('Cannot divide by zero'))
10

> S.reduce_(Math.pow, 10, S.Right(3))
1000
```

<h4 name="Either.prototype.fantasy-land/traverse"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2230">Either#fantasy-land/traverse :: Applicative f => Either a b ~> (TypeRep f, b -> f c) -> f (Either a c)</a></code></h4>

Takes two functions which both return values of the same [Applicative][],
(the second of which must be that type's [`of`][] function) and returns:

  - the result of applying `of` to `this` if `this` is a Left; otherwise

  - the result of mapping [`Right`](#Right) over the result of applying
    the first function to this Right's value.

```javascript
> S.traverse(Array, S.words, S.Left('Request failed'))
[Left('Request failed')]

> S.traverse(Array, S.words, S.Right('foo bar baz'))
[Right('foo'), Right('bar'), Right('baz')]
```

<h4 name="Either.prototype.fantasy-land/extend"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2251">Either#fantasy-land/extend :: Either a b ~> (Either a b -> c) -> Either a c</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise it
returns a Right whose value is the result of applying the function to
`this`.

```javascript
> S.extend(x => x.value + 1, S.Left('Cannot divide by zero'))
Left('Cannot divide by zero')

> S.extend(x => x.value + 1, S.Right(42))
Right(43)
```

<h4 name="isLeft"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2268">isLeft :: Either a b -> Boolean</a></code></h4>

Returns `true` if the given Either is a Left; `false` if it is a Right.

```javascript
> S.isLeft(S.Left('Cannot divide by zero'))
true

> S.isLeft(S.Right(42))
false
```

<h4 name="isRight"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2284">isRight :: Either a b -> Boolean</a></code></h4>

Returns `true` if the given Either is a Right; `false` if it is a Left.

```javascript
> S.isRight(S.Right(42))
true

> S.isRight(S.Left('Cannot divide by zero'))
false
```

<h4 name="fromEither"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2300">fromEither :: b -> Either a b -> b</a></code></h4>

Takes a default value and an Either, and returns the Right value
if the Either is a Right; the default value otherwise.

```javascript
> S.fromEither(0, S.Right(42))
42

> S.fromEither(0, S.Left(42))
0
```

<h4 name="toEither"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2317">toEither :: a -> b? -> Either a b</a></code></h4>

Converts an arbitrary value to an Either: a Left if the value is `null`
or `undefined`; a Right otherwise. The first argument specifies the
value of the Left in the "failure" case.

```javascript
> S.toEither('XYZ', null)
Left('XYZ')

> S.toEither('XYZ', 'ABC')
Right('ABC')

> S.map(S.prop('0'), S.toEither('Invalid protocol', 'ftp://example.com/'.match(/^https?:/)))
Left('Invalid protocol')

> S.map(S.prop('0'), S.toEither('Invalid protocol', 'https://example.com/'.match(/^https?:/)))
Right('https:')
```

<h4 name="either"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2341">either :: (a -> c) -> (b -> c) -> Either a b -> c</a></code></h4>

Takes two functions and an Either, and returns the result of
applying the first function to the Left's value, if the Either
is a Left, or the result of applying the second function to the
Right's value, if the Either is a Right.

```javascript
> S.either(S.toUpper, S.toString, S.Left('Cannot divide by zero'))
'CANNOT DIVIDE BY ZERO'

> S.either(S.toUpper, S.toString, S.Right(42))
'42'
```

<h4 name="lefts"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2360">lefts :: Array (Either a b) -> Array a</a></code></h4>

Takes an array of Eithers and returns an array containing each Left's
value.

See also [`rights`](#rights).

```javascript
> S.lefts([S.Right(20), S.Left('foo'), S.Right(10), S.Left('bar')])
['foo', 'bar']
```

<h4 name="rights"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2379">rights :: Array (Either a b) -> Array b</a></code></h4>

Takes an array of Eithers and returns an array containing each Right's
value.

See also [`lefts`](#lefts).

```javascript
> S.rights([S.Right(20), S.Left('foo'), S.Right(10), S.Left('bar')])
[20, 10]
```

<h4 name="encaseEither"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2398">encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r</a></code></h4>

Takes two unary functions, `f` and `g`, the second of which may throw,
and a value `x` of any type. Applies `g` to `x` inside a `try` block.
If an exception is caught, the return value is a Left containing the
result of applying `f` to the caught Error object; otherwise the return
value is a Right containing the result of applying `g` to `x`.

See also [`encase`](#encase).

```javascript
> S.encaseEither(S.I, JSON.parse, '["foo","bar","baz"]')
Right(['foo', 'bar', 'baz'])

> S.encaseEither(S.I, JSON.parse, '[')
Left(new SyntaxError('Unexpected end of JSON input'))

> S.encaseEither(S.prop('message'), JSON.parse, '[')
Left('Unexpected end of JSON input')
```

<h4 name="encaseEither2"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2431">encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r</a></code></h4>

Binary version of [`encaseEither`](#encaseEither).

See also [`encaseEither2_`](#encaseEither2_).

<h4 name="encaseEither2_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2445">encaseEither2_ :: (Error -> l) -> ((a, b) -> r) -> a -> b -> Either l r</a></code></h4>

Variant of [`encaseEither2`](#encaseEither2) which takes an uncurried
binary function.

<h4 name="encaseEither3"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2462">encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r</a></code></h4>

Ternary version of [`encaseEither`](#encaseEither).

See also [`encaseEither3_`](#encaseEither3_).

<h4 name="encaseEither3_"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2476">encaseEither3_ :: (Error -> l) -> ((a, b, c) -> r) -> a -> b -> c -> Either l r</a></code></h4>

Variant of [`encaseEither3`](#encaseEither3) which takes an uncurried
ternary function.

<h4 name="eitherToMaybe"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2493">eitherToMaybe :: Either a b -> Maybe b</a></code></h4>

Converts an Either to a Maybe. A Left becomes Nothing; a Right becomes
a Just.

See also [`maybeToEither`](#maybeToEither).

```javascript
> S.eitherToMaybe(S.Left('Cannot divide by zero'))
Nothing

> S.eitherToMaybe(S.Right(42))
Just(42)
```

### Logic

<h4 name="and"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2515">and :: Boolean -> Boolean -> Boolean</a></code></h4>

Boolean "and".

```javascript
> S.and(false, false)
false

> S.and(false, true)
false

> S.and(true, false)
false

> S.and(true, true)
true
```

<h4 name="or"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2537">or :: Boolean -> Boolean -> Boolean</a></code></h4>

Boolean "or".

```javascript
> S.or(false, false)
false

> S.or(false, true)
true

> S.or(true, false)
true

> S.or(true, true)
true
```

<h4 name="not"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2559">not :: Boolean -> Boolean</a></code></h4>

Boolean "not".

```javascript
> S.not(false)
true

> S.not(true)
false
```

<h4 name="ifElse"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2575">ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b</a></code></h4>

Takes a unary predicate, a unary "if" function, a unary "else"
function, and a value of any type, and returns the result of
applying the "if" function to the value if the value satisfies
the predicate; the result of applying the "else" function to the
value otherwise.

```javascript
> S.ifElse(x => x < 0, Math.abs, Math.sqrt, -1)
1

> S.ifElse(x => x < 0, Math.abs, Math.sqrt, 16)
4
```

<h4 name="allPass"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2595">allPass :: Array (a -> Boolean) -> a -> Boolean</a></code></h4>

Takes an array of unary predicates and a value of any type
and returns `true` if all the predicates pass; `false` otherwise.
None of the subsequent predicates will be evaluated after the
first failed predicate.

```javascript
> S.allPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'quiessence')
true

> S.allPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'fissiparous')
false
```

<h4 name="anyPass"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2614">anyPass :: Array (a -> Boolean) -> a -> Boolean</a></code></h4>

Takes an array of unary predicates and a value of any type
and returns `true` if any of the predicates pass; `false` otherwise.
None of the subsequent predicates will be evaluated after the
first passed predicate.

```javascript
> S.anyPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'incandescent')
true

> S.anyPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'empathy')
false
```

### List

The List type constructor enables type signatures to describe ad hoc
polymorphic functions which operate on either [`Array`][$.Array] or
[`String`][$.String] values.

Mental gymnastics are required to treat arrays and strings similarly.
`[1, 2, 3]` is a list containing `1`, `2`, and `3`. `'abc'` is a list
containing `'a'`, `'b'`, and `'c'`. But what is the type of `'a'`?
`String`, since JavaScript has no Char type! Thus:

    'abc' :: String, List String, List (List String), ...

Every member of `String` is also a member of `List String`! This
affects the interpretation of type signatures. Consider the type of
[`indexOf`](#indexOf):

    a -> List a -> Maybe Integer

Assume the second argument is `'hello' :: List String`. `a` must then be
replaced with `String`:

    String -> List String -> Maybe Integer

Since `List String` and `String` are interchangeable, the former can be
replaced with the latter:

    String -> String -> Maybe Integer

It's then apparent that the first argument needn't be a single-character
string; the correspondence between arrays and strings does not hold.

<h4 name="concat"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2665">concat :: Semigroup a => a -> a -> a</a></code></h4>

Concatenates two (homogeneous) arrays, two strings, or two values of any
other type which satisfies the [Semigroup][] specification.

```javascript
> S.concat([1, 2, 3], [4, 5, 6])
[1, 2, 3, 4, 5, 6]

> S.concat('foo', 'bar')
'foobar'

> S.concat(S.Just('foo'), S.Just('bar'))
Just('foobar')
```

<h4 name="slice"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2682">slice :: Integer -> Integer -> List a -> Maybe (List a)</a></code></h4>

Returns Just a list containing the elements from the supplied list
from a beginning index (inclusive) to an end index (exclusive).
Returns Nothing unless the start interval is less than or equal to
the end interval, and the list contains both (half-open) intervals.
Accepts negative indices, which indicate an offset from the end of
the list.

```javascript
> S.slice(1, 3, ['a', 'b', 'c', 'd', 'e'])
Just(['b', 'c'])

> S.slice(-2, -0, ['a', 'b', 'c', 'd', 'e'])
Just(['d', 'e'])

> S.slice(2, -0, ['a', 'b', 'c', 'd', 'e'])
Just(['c', 'd', 'e'])

> S.slice(1, 6, ['a', 'b', 'c', 'd', 'e'])
Nothing

> S.slice(2, 6, 'banana')
Just('nana')
```

<h4 name="at"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2719">at :: Integer -> List a -> Maybe a</a></code></h4>

Takes an index and a list and returns Just the element of the list at
the index if the index is within the list's bounds; Nothing otherwise.
A negative index represents an offset from the length of the list.

```javascript
> S.at(2, ['a', 'b', 'c', 'd', 'e'])
Just('c')

> S.at(5, ['a', 'b', 'c', 'd', 'e'])
Nothing

> S.at(-2, ['a', 'b', 'c', 'd', 'e'])
Just('d')
```

<h4 name="head"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2740">head :: List a -> Maybe a</a></code></h4>

Takes a list and returns Just the first element of the list if the
list contains at least one element; Nothing if the list is empty.

```javascript
> S.head([1, 2, 3])
Just(1)

> S.head([])
Nothing
```

<h4 name="last"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2757">last :: List a -> Maybe a</a></code></h4>

Takes a list and returns Just the last element of the list if the
list contains at least one element; Nothing if the list is empty.

```javascript
> S.last([1, 2, 3])
Just(3)

> S.last([])
Nothing
```

<h4 name="tail"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2774">tail :: List a -> Maybe (List a)</a></code></h4>

Takes a list and returns Just a list containing all but the first
of the list's elements if the list contains at least one element;
Nothing if the list is empty.

```javascript
> S.tail([1, 2, 3])
Just([2, 3])

> S.tail([])
Nothing
```

<h4 name="init"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2792">init :: List a -> Maybe (List a)</a></code></h4>

Takes a list and returns Just a list containing all but the last
of the list's elements if the list contains at least one element;
Nothing if the list is empty.

```javascript
> S.init([1, 2, 3])
Just([1, 2])

> S.init([])
Nothing
```

<h4 name="take"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2810">take :: Integer -> List a -> Maybe (List a)</a></code></h4>

Returns Just the first N elements of the given collection if N is
greater than or equal to zero and less than or equal to the length
of the collection; Nothing otherwise.

```javascript
> S.take(2, ['a', 'b', 'c', 'd', 'e'])
Just(['a', 'b'])

> S.take(4, 'abcdefg')
Just('abcd')

> S.take(4, ['a', 'b', 'c'])
Nothing
```

<h4 name="takeLast"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2831">takeLast :: Integer -> List a -> Maybe (List a)</a></code></h4>

Returns Just the last N elements of the given collection if N is
greater than or equal to zero and less than or equal to the length
of the collection; Nothing otherwise.

```javascript
> S.takeLast(2, ['a', 'b', 'c', 'd', 'e'])
Just(['d', 'e'])

> S.takeLast(4, 'abcdefg')
Just('defg')

> S.takeLast(4, ['a', 'b', 'c'])
Nothing
```

<h4 name="drop"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2853">drop :: Integer -> List a -> Maybe (List a)</a></code></h4>

Returns Just all but the first N elements of the given collection
if N is greater than or equal to zero and less than or equal to the
length of the collection; Nothing otherwise.

```javascript
> S.drop(2, ['a', 'b', 'c', 'd', 'e'])
Just(['c', 'd', 'e'])

> S.drop(4, 'abcdefg')
Just('efg')

> S.drop(4, 'abc')
Nothing
```

<h4 name="dropLast"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2874">dropLast :: Integer -> List a -> Maybe (List a)</a></code></h4>

Returns Just all but the last N elements of the given collection
if N is greater than or equal to zero and less than or equal to the
length of the collection; Nothing otherwise.

```javascript
> S.dropLast(2, ['a', 'b', 'c', 'd', 'e'])
Just(['a', 'b', 'c'])

> S.dropLast(4, 'abcdefg')
Just('abc')

> S.dropLast(4, 'abc')
Nothing
```

<h4 name="reverse"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2896">reverse :: List a -> List a</a></code></h4>

Returns the elements of the given list in reverse order.

```javascript
> S.reverse([1, 2, 3])
[3, 2, 1]

> S.reverse('abc')
'cba'
```

<h4 name="indexOf"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2913">indexOf :: a -> List a -> Maybe Integer</a></code></h4>

Takes a value of any type and a list, and returns Just the index
of the first occurrence of the value in the list, if applicable;
Nothing otherwise.

```javascript
> S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
Just(1)

> S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
Nothing

> S.indexOf('an', 'banana')
Just(1)

> S.indexOf('ax', 'banana')
Nothing
```

<h4 name="lastIndexOf"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2938">lastIndexOf :: a -> List a -> Maybe Integer</a></code></h4>

Takes a value of any type and a list, and returns Just the index
of the last occurrence of the value in the list, if applicable;
Nothing otherwise.

```javascript
> S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
Just(5)

> S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
Nothing

> S.lastIndexOf('an', 'banana')
Just(3)

> S.lastIndexOf('ax', 'banana')
Nothing
```

### Array

<h4 name="append"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2966">append :: a -> Array a -> Array a</a></code></h4>

Takes a value of any type and an array of values of that type, and
returns the result of appending the value to the array.

See also [`prepend`](#prepend).

```javascript
> S.append(3, [1, 2])
[1, 2, 3]
```

<h4 name="prepend"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2982">prepend :: a -> Array a -> Array a</a></code></h4>

Takes a value of any type and an array of values of that type, and
returns the result of prepending the value to the array.

See also [`append`](#append).

```javascript
> S.prepend(1, [2, 3])
[1, 2, 3]
```

<h4 name="joinWith"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L2998">joinWith :: String -> Array String -> String</a></code></h4>

Joins the strings of the second argument separated by the first argument.

Properties:

  - `forall s :: String, t :: String. S.joinWith(s, S.splitOn(s, t)) = t`

See also [`splitOn`](#splitOn).

```javascript
> S.joinWith(':', ['foo', 'bar', 'baz'])
'foo:bar:baz'
```

<h4 name="find"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3018">find :: (a -> Boolean) -> Array a -> Maybe a</a></code></h4>

Takes a predicate and an array and returns Just the leftmost element of
the array which satisfies the predicate; Nothing if none of the array's
elements satisfies the predicate.

```javascript
> S.find(n => n < 0, [1, -2, 3, -4, 5])
Just(-2)

> S.find(n => n < 0, [1, 2, 3, 4, 5])
Nothing
```

<h4 name="pluck"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3042">pluck :: Accessible a => String -> Array a -> Array b</a></code></h4>

Combines [`map`](#map) and [`prop`](#prop). `pluck(k, xs)` is equivalent
to `map(prop(k), xs)`.

```javascript
> S.pluck('x', [{x: 1}, {x: 2}, {x: 3}])
[1, 2, 3]
```

<h4 name="unfoldr"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3065">unfoldr :: (b -> Maybe (Pair a b)) -> b -> Array a</a></code></h4>

Takes a function and a seed value, and returns an array generated by
applying the function repeatedly. The array is initially empty. The
function is initially applied to the seed value. Each application
of the function should result in either:

  - Nothing, in which case the array is returned; or

  - Just a pair, in which case the first element is appended to
    the array and the function is applied to the second element.

```javascript
> S.unfoldr(n => n < 5 ? S.Just([n, n + 1]) : S.Nothing, 1)
[1, 2, 3, 4]
```

<h4 name="range"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3089">range :: Integer -> Integer -> Array Integer</a></code></h4>

Returns an array of consecutive integers starting with the first argument
and ending with the second argument minus one. Returns `[]` if the second
argument is less than or equal to the first argument.

```javascript
> S.range(0, 10)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

> S.range(-5, 0)
[-5, -4, -3, -2, -1]

> S.range(0, -5)
[]
```

### Object

<h4 name="prop"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3115">prop :: Accessible a => String -> a -> b</a></code></h4>

Takes a property name and an object with known properties and returns
the value of the specified property. If for some reason the object
lacks the specified property, a type error is thrown.

For accessing properties of uncertain objects, use [`get`](#get) instead.

See also [`pluck`](#pluck).

```javascript
> S.prop('a', {a: 1, b: 2})
1
```

<h4 name="props"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3136">props :: Accessible a => Array String -> a -> b</a></code></h4>

Takes a property path (an array of property names) and an object with
known structure and returns the value at the given path. If for some
reason the path does not exist, a type error is thrown.

For accessing property paths of uncertain objects, use [`gets`](#gets)
instead.

```javascript
> S.props(['a', 'b', 'c'], {a: {b: {c: 1}}})
1
```

<h4 name="get"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3159">get :: Accessible a => (b -> Boolean) -> String -> a -> Maybe c</a></code></h4>

Takes a predicate, a property name, and an object and returns Just the
value of the specified object property if it exists and the value
satisfies the given predicate; Nothing otherwise.

See also [`gets`](#gets) and [`prop`](#prop).

```javascript
> S.get(S.is(Number), 'x', {x: 1, y: 2})
Just(1)

> S.get(S.is(Number), 'x', {x: '1', y: '2'})
Nothing

> S.get(S.is(Number), 'x', {})
Nothing
```

<h4 name="gets"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3184">gets :: Accessible a => (b -> Boolean) -> Array String -> a -> Maybe c</a></code></h4>

Takes a predicate, a property path (an array of property names), and
an object and returns Just the value at the given path if such a path
exists and the value satisfies the given predicate; Nothing otherwise.

See also [`get`](#get).

```javascript
> S.gets(S.is(Number), ['a', 'b', 'c'], {a: {b: {c: 42}}})
Just(42)

> S.gets(S.is(Number), ['a', 'b', 'c'], {a: {b: {c: '42'}}})
Nothing

> S.gets(S.is(Number), ['a', 'b', 'c'], {})
Nothing
```

<h4 name="keys"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3215">keys :: StrMap a -> Array String</a></code></h4>

Returns the keys of the given string map, in arbitrary order.

```javascript
> S.keys({b: 2, c: 3, a: 1}).sort()
['a', 'b', 'c']
```

<h4 name="values"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3225">values :: StrMap a -> Array a</a></code></h4>

Returns the values of the given string map, in arbitrary order.

```javascript
> S.values({a: 1, c: 3, b: 2}).sort()
[1, 2, 3]
```

<h4 name="pairs"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3238">pairs :: StrMap a -> Array (Pair String a)</a></code></h4>

Returns the key–value pairs of the given string map, in arbitrary order.

```javascript
> S.pairs({b: 2, a: 1, c: 3}).sort()
[['a', 1], ['b', 2], ['c', 3]]
```

### Number

<h4 name="negate"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3254">negate :: ValidNumber -> ValidNumber</a></code></h4>

Negates its argument.

```javascript
> S.negate(12.5)
-12.5

> S.negate(-42)
42
```

<h4 name="add"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3270">add :: FiniteNumber -> FiniteNumber -> FiniteNumber</a></code></h4>

Returns the sum of two (finite) numbers.

```javascript
> S.add(1, 1)
2
```

<h4 name="sum"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3284">sum :: Foldable f => f FiniteNumber -> FiniteNumber</a></code></h4>

Returns the sum of the given array of (finite) numbers.

```javascript
> S.sum([1, 2, 3, 4, 5])
15

> S.sum([])
0

> S.sum(S.Just(42))
42

> S.sum(S.Nothing)
0
```

<h4 name="sub"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3307">sub :: FiniteNumber -> FiniteNumber -> FiniteNumber</a></code></h4>

Returns the difference between two (finite) numbers.

```javascript
> S.sub(4, 2)
2
```

<h4 name="inc"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3321">inc :: FiniteNumber -> FiniteNumber</a></code></h4>

Increments a (finite) number by one.

```javascript
> S.inc(1)
2
```

<h4 name="dec"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3334">dec :: FiniteNumber -> FiniteNumber</a></code></h4>

Decrements a (finite) number by one.

```javascript
> S.dec(2)
1
```

<h4 name="mult"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3347">mult :: FiniteNumber -> FiniteNumber -> FiniteNumber</a></code></h4>

Returns the product of two (finite) numbers.

```javascript
> S.mult(4, 2)
8
```

<h4 name="product"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3361">product :: Foldable f => f FiniteNumber -> FiniteNumber</a></code></h4>

Returns the product of the given array of (finite) numbers.

```javascript
> S.product([1, 2, 3, 4, 5])
120

> S.product([])
1

> S.product(S.Just(42))
42

> S.product(S.Nothing)
1
```

<h4 name="div"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3387">div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber</a></code></h4>

Returns the result of dividing its first argument (a finite number) by
its second argument (a non-zero finite number).

```javascript
> S.div(7, 2)
3.5
```

<h4 name="mean"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3402">mean :: Foldable f => f FiniteNumber -> Maybe FiniteNumber</a></code></h4>

Returns the mean of the given array of (finite) numbers.

```javascript
> S.mean([1, 2, 3, 4, 5])
Just(3)

> S.mean([])
Nothing

> S.mean(S.Just(42))
Just(42)

> S.mean(S.Nothing)
Nothing
```

<h4 name="min"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3437">min :: Ord a => a -> a -> a</a></code></h4>

Returns the smaller of its two arguments.

Strings are compared lexicographically. Specifically, the Unicode
code point value of each character in the first string is compared
to the value of the corresponding character in the second string.

See also [`max`](#max).

```javascript
> S.min(10, 2)
2

> S.min(new Date('1999-12-31'), new Date('2000-01-01'))
new Date('1999-12-31')

> S.min('10', '2')
'10'
```

<h4 name="max"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3462">max :: Ord a => a -> a -> a</a></code></h4>

Returns the larger of its two arguments.

Strings are compared lexicographically. Specifically, the Unicode
code point value of each character in the first string is compared
to the value of the corresponding character in the second string.

See also [`min`](#min).

```javascript
> S.max(10, 2)
10

> S.max(new Date('1999-12-31'), new Date('2000-01-01'))
new Date('2000-01-01')

> S.max('10', '2')
'2'
```

### Integer

<h4 name="even"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3489">even :: Integer -> Boolean</a></code></h4>

Returns `true` if the given integer is even; `false` if it is odd.

```javascript
> S.even(42)
true

> S.even(99)
false
```

<h4 name="odd"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3505">odd :: Integer -> Boolean</a></code></h4>

Returns `true` if the given integer is odd; `false` if it is even.

```javascript
> S.odd(99)
true

> S.odd(42)
false
```

### Parse

<h4 name="parseDate"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3523">parseDate :: String -> Maybe Date</a></code></h4>

Takes a string and returns Just the date represented by the string
if it does in fact represent a date; Nothing otherwise.

```javascript
> S.parseDate('2011-01-19T17:40:00Z')
Just(new Date('2011-01-19T17:40:00.000Z'))

> S.parseDate('today')
Nothing
```

<h4 name="parseFloat"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3575">parseFloat :: String -> Maybe Number</a></code></h4>

Takes a string and returns Just the number represented by the string
if it does in fact represent a number; Nothing otherwise.

```javascript
> S.parseFloat('-123.45')
Just(-123.45)

> S.parseFloat('foo.bar')
Nothing
```

<h4 name="parseInt"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3593">parseInt :: Integer -> String -> Maybe Integer</a></code></h4>

Takes a radix (an integer between 2 and 36 inclusive) and a string,
and returns Just the number represented by the string if it does in
fact represent a number in the base specified by the radix; Nothing
otherwise.

This function is stricter than [`parseInt`][parseInt]: a string
is considered to represent an integer only if all its non-prefix
characters are members of the character set specified by the radix.

```javascript
> S.parseInt(10, '-42')
Just(-42)

> S.parseInt(16, '0xFF')
Just(255)

> S.parseInt(16, '0xGG')
Nothing
```

<h4 name="parseJson"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3632">parseJson :: (a -> Boolean) -> String -> Maybe b</a></code></h4>

Takes a predicate and a string which may or may not be valid JSON, and
returns Just the result of applying `JSON.parse` to the string *if* the
result satisfies the predicate; Nothing otherwise.

```javascript
> S.parseJson(S.is(Array), '["foo","bar","baz"]')
Just(['foo', 'bar', 'baz'])

> S.parseJson(S.is(Array), '[')
Nothing

> S.parseJson(S.is(Object), '["foo","bar","baz"]')
Nothing
```

### RegExp

<h4 name="regex"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3675">regex :: RegexFlags -> String -> RegExp</a></code></h4>

Takes a [RegexFlags][] and a pattern, and returns a RegExp.

```javascript
> S.regex('g', ':\\d+:')
/:\d+:/g
```

<h4 name="regexEscape"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3688">regexEscape :: String -> String</a></code></h4>

Takes a string which may contain regular expression metacharacters,
and returns a string with those metacharacters escaped.

Properties:

  - `forall s :: String. S.test(S.regex('', S.regexEscape(s)), s) = true`

```javascript
> S.regexEscape('-=*{XYZ}*=-')
'\\-=\\*\\{XYZ\\}\\*=\\-'
```

<h4 name="test"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3706">test :: RegExp -> String -> Boolean</a></code></h4>

Takes a pattern and a string, and returns `true` if the pattern
matches the string; `false` otherwise.

```javascript
> S.test(/^a/, 'abacus')
true

> S.test(/^a/, 'banana')
false
```

<h4 name="match"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3723">match :: NonGlobalRegExp -> String -> Maybe { match :: String, groups :: Array (Maybe String) }</a></code></h4>

Takes a pattern and a string, and returns Just a match record if the
pattern matches the string; Nothing otherwise.

`groups :: Array (Maybe String)` acknowledges the existence of optional
capturing groups.

Properties:

  - `forall p :: Pattern, s :: String.
     S.head(S.matchAll(S.regex("g", p), s)) = S.match(S.regex("", p), s)`

See also [`matchAll`](#matchAll).

```javascript
> S.match(/(good)?bye/, 'goodbye')
Just({match: 'goodbye', groups: [Just('good')]})

> S.match(/(good)?bye/, 'bye')
Just({match: 'bye', groups: [Nothing]})
```

<h4 name="matchAll"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3751">matchAll :: GlobalRegExp -> String -> Array { match :: String, groups :: Array (Maybe String) }</a></code></h4>

Takes a pattern and a string, and returns an array of match records.

`groups :: Array (Maybe String)` acknowledges the existence of optional
capturing groups.

See also [`match`](#match).

```javascript
> S.matchAll(/@([a-z]+)/g, 'Hello, world!')
[]

> S.matchAll(/@([a-z]+)/g, 'Hello, @foo! Hello, @bar! Hello, @baz!')
[ {match: '@foo', groups: [Just('foo')]},
. {match: '@bar', groups: [Just('bar')]},
. {match: '@baz', groups: [Just('baz')]} ]
```

### String

<h4 name="toUpper"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3783">toUpper :: String -> String</a></code></h4>

Returns the upper-case equivalent of its argument.

See also [`toLower`](#toLower).

```javascript
> S.toUpper('ABC def 123')
'ABC DEF 123'
```

<h4 name="toLower"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3798">toLower :: String -> String</a></code></h4>

Returns the lower-case equivalent of its argument.

See also [`toUpper`](#toUpper).

```javascript
> S.toLower('ABC def 123')
'abc def 123'
```

<h4 name="trim"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3813">trim :: String -> String</a></code></h4>

Strips leading and trailing whitespace characters.

```javascript
> S.trim('\t\t foo bar \n')
'foo bar'
```

<h4 name="words"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3826">words :: String -> Array String</a></code></h4>

Takes a string and returns the array of words the string contains
(words are delimited by whitespace characters).

See also [`unwords`](#unwords).

```javascript
> S.words(' foo bar baz ')
['foo', 'bar', 'baz']
```

<h4 name="unwords"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3844">unwords :: Array String -> String</a></code></h4>

Takes an array of words and returns the result of joining the words
with separating spaces.

See also [`words`](#words).

```javascript
> S.unwords(['foo', 'bar', 'baz'])
'foo bar baz'
```

<h4 name="lines"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3860">lines :: String -> Array String</a></code></h4>

Takes a string and returns the array of lines the string contains
(lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
The resulting strings do not contain newlines.

See also [`unlines`](#unlines).

```javascript
> S.lines('foo\nbar\nbaz\n')
['foo', 'bar', 'baz']
```

<h4 name="unlines"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3878">unlines :: Array String -> String</a></code></h4>

Takes an array of lines and returns the result of joining the lines
after appending a terminating line feed (`'\n'`) to each.

See also [`lines`](#lines).

```javascript
> S.unlines(['foo', 'bar', 'baz'])
'foo\nbar\nbaz\n'
```

<h4 name="splitOn"><code><a href="https://github.com/sanctuary-js/sanctuary/blob/v0.12.1/index.js#L3894">splitOn :: String -> String -> Array String</a></code></h4>

Returns the substrings of its second argument separated by occurrences
of its first argument.

See also [`joinWith`](#joinWith).

```javascript
> S.splitOn('::', 'foo::bar::baz')
['foo', 'bar', 'baz']
```

[$.Array]:          https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0#Array
[$.String]:         https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0#String
[Alt]:              https://github.com/fantasyland/fantasy-land/tree/v3.0.0#alt
[Alternative]:      https://github.com/fantasyland/fantasy-land/tree/v3.0.0#alternative
[Applicative]:      https://github.com/fantasyland/fantasy-land/tree/v3.0.0#applicative
[Apply]:            https://github.com/fantasyland/fantasy-land/tree/v3.0.0#apply
[Bifunctor]:        https://github.com/fantasyland/fantasy-land/tree/v3.0.0#bifunctor
[BinaryType]:       https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0#BinaryType
[Either]:           #either-type
[Extend]:           https://github.com/fantasyland/fantasy-land/tree/v3.0.0#extend
[Fantasy Land]:     https://github.com/fantasyland/fantasy-land/tree/v3.0.0
[Foldable]:         https://github.com/fantasyland/fantasy-land/tree/v3.0.0#foldable
[Functor]:          https://github.com/fantasyland/fantasy-land/tree/v3.0.0#functor
[Maybe]:            #maybe-type
[Monad]:            https://github.com/fantasyland/fantasy-land/tree/v3.0.0#monad
[Monoid]:           https://github.com/fantasyland/fantasy-land/tree/v3.0.0#monoid
[Nullable]:         https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0#Nullable
[Object#toString]:  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
[Ramda]:            http://ramdajs.com/
[RegexFlags]:       https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0#RegexFlags
[Semigroup]:        https://github.com/fantasyland/fantasy-land/tree/v3.0.0#semigroup
[Setoid]:           https://github.com/fantasyland/fantasy-land/tree/v3.0.0#setoid
[Traversable]:      https://github.com/fantasyland/fantasy-land/tree/v3.0.0#traversable
[UnaryType]:        https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0#UnaryType
[`Z.alt`]:          https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#alt
[`Z.ap`]:           https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#ap
[`Z.apFirst`]:      https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#apFirst
[`Z.apSecond`]:     https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#apSecond
[`Z.bimap`]:        https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#bimap
[`Z.chain`]:        https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#chain
[`Z.chainRec`]:     https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#chainRec
[`Z.concat`]:       https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#concat
[`Z.empty`]:        https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#empty
[`Z.equals`]:       https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#equals
[`Z.extend`]:       https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#extend
[`Z.extract`]:      https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#extract
[`Z.filter`]:       https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#filter
[`Z.filterM`]:      https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#filterM
[`Z.join`]:         https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#join
[`Z.map`]:          https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#map
[`Z.of`]:           https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#of
[`Z.promap`]:       https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#promap
[`Z.sequence`]:     https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#sequence
[`Z.toString`]:     https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#toString
[`Z.traverse`]:     https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#traverse
[`Z.zero`]:         https://github.com/sanctuary-js/sanctuary-type-classes/tree/v3.0.1#zero
[`of`]:             https://github.com/fantasyland/fantasy-land/tree/v3.0.0#of-method
[parseInt]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
[sanctuary-def]:    https://github.com/sanctuary-js/sanctuary-def/tree/v0.9.0
[thrush]:           https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
[type identifier]:  https://github.com/sanctuary-js/sanctuary-type-identifiers/tree/v1.0.0

[`Either#fantasy-land/bimap`]:      #Either.prototype.fantasy-land/bimap
[`Either#fantasy-land/map`]:        #Either.prototype.fantasy-land/map
[`Either#toString`]:                #Either.prototype.toString
[`Maybe#toString`]:                 #Maybe.prototype.toString
