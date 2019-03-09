# Sanctuary

[![npm](https://img.shields.io/npm/v/sanctuary.svg)](https://www.npmjs.com/package/sanctuary)
[![CircleCI](https://img.shields.io/circleci/project/github/sanctuary-js/sanctuary/master.svg)](https://circleci.com/gh/sanctuary-js/sanctuary/tree/master)
[![Gitter](https://img.shields.io/gitter/room/badges/shields.svg)](https://gitter.im/sanctuary-js/sanctuary)

Sanctuary is a JavaScript functional programming library inspired by
[Haskell][] and [PureScript][]. It's stricter than [Ramda][], and
provides a similar suite of functions.

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

    S.map (S.toUpper) (S.head (words))

Sanctuary is designed to work in Node.js and in ES5-compatible browsers.

## Folktale

[Folktale][], like Sanctuary, is a standard library for functional
programming in JavaScript. It is well designed and well documented.
Whereas Sanctuary treats JavaScript as a member of the ML language
family, Folktale embraces JavaScript's object-oriented programming
model. Programming with Folktale resembles programming with Scala.

## Ramda

[Ramda][] provides several functions which return problematic values
such as `undefined`, `Infinity`, or `NaN` when applied to unsuitable
inputs. These are known as [partial functions][]. Partial functions
necessitate the use of guards or null checks. In order to safely use
`R.head`, for example, one must ensure that the array is non-empty:

    if (R.isEmpty (xs)) {
      // ...
    } else {
      return f (R.head (xs));
    }

Using the Maybe type renders such guards (and null checks) unnecessary.
Changing functions such as `R.head` to return Maybe values was proposed
in [ramda/ramda#683][], but was considered too much of a stretch for
JavaScript programmers. Sanctuary was released the following month,
in January 2015, as a companion library to Ramda.

In addition to broadening in scope in the years since its release,
Sanctuary's philosophy has diverged from Ramda's in several respects.

### Totality

Every Sanctuary function is defined for every value which is a member of
the function's input type. Such functions are known as [total functions][].
Ramda, on the other hand, contains a number of [partial functions][].

### Information preservation

Certain Sanctuary functions preserve more information than their Ramda
counterparts. Examples:

    |> R.tail ([])                      |> S.tail ([])
    []                                  Nothing

    |> R.tail (['foo'])                 |> S.tail (['foo'])
    []                                  Just ([])

    |> R.replace (/^x/) ('') ('abc')    |> S.stripPrefix ('x') ('abc')
    'abc'                               Nothing

    |> R.replace (/^x/) ('') ('xabc')   |> S.stripPrefix ('x') ('xabc')
    'abc'                               Just ('abc')

### Invariants

Sanctuary performs rigorous [type checking][] of inputs and outputs, and
throws a descriptive error if a type error is encountered. This allows bugs
to be caught and fixed early in the development cycle.

Ramda operates on the [garbage in, garbage out][GIGO] principle. Functions
are documented to take arguments of particular types, but these invariants
are not enforced. The problem with this approach in a language as
permissive as JavaScript is that there's no guarantee that garbage input
will produce garbage output ([ramda/ramda#1413][]). Ramda performs ad hoc
type checking in some such cases ([ramda/ramda#1419][]).

Sanctuary can be configured to operate in garbage in, garbage out mode.
Ramda cannot be configured to enforce its invariants.

### Currying

Sanctuary functions are curried. There is, for example, exactly one way to
apply `S.reduce` to `S.add`, `0`, and `xs`:

  - `S.reduce (S.add) (0) (xs)`

Ramda functions are also curried, but in a complex manner. There are four
ways to apply `R.reduce` to `R.add`, `0`, and `xs`:

  - `R.reduce (R.add) (0) (xs)`
  - `R.reduce (R.add) (0, xs)`
  - `R.reduce (R.add, 0) (xs)`
  - `R.reduce (R.add, 0, xs)`

Ramda supports all these forms because curried functions enable partial
application, one of the library's tenets, but `f(x)(y)(z)` is considered
too unfamiliar and too unattractive to appeal to JavaScript programmers.

Sanctuary's developers prefer a simple, unfamiliar construct to a complex,
familiar one. Familiarity can be acquired; complexity is intrinsic.

The lack of breathing room in `f(x)(y)(z)` impairs readability. The simple
solution to this problem, proposed in [#438][], is to include a space when
applying a function: `f (x) (y) (z)`.

Ramda also provides a special placeholder value, [`R.__`][], which removes
the restriction that a function must be applied to its arguments in order.
The following expressions are equivalent:

  - `R.reduce (R.__, 0, xs) (R.add)`
  - `R.reduce (R.add, R.__, xs) (0)`
  - `R.reduce (R.__, 0) (R.add) (xs)`
  - `R.reduce (R.__, 0) (R.add, xs)`
  - `R.reduce (R.__, R.__, xs) (R.add) (0)`
  - `R.reduce (R.__, R.__, xs) (R.add, 0)`

### Variadic functions

Ramda provides several functions which take any number of arguments. These
are known as [variadic functions][]. Additionally, Ramda provides several
functions which take variadic functions as arguments. Although natural in
a dynamically typed language, variadic functions are at odds with the type
notation Ramda and Sanctuary both use, leading to some indecipherable type
signatures such as this one:

    R.lift :: (*... -> *...) -> ([*]... -> [*])

Sanctuary has no variadic functions, nor any functions which take variadic
functions as arguments. Sanctuary provides two "lift" functions, each with
a helpful type signature:

    S.lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
    S.lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d

### Implicit context

Ramda provides [`R.bind`][] and [`R.invoker`][] for working with methods.
Additionally, many Ramda functions use `Function#call` or `Function#apply`
to preserve context. Sanctuary makes no allowances for `this`.

### Transducers

Several Ramda functions act as transducers. Sanctuary provides no support
for transducers.

### Modularity

Whereas Ramda has no dependencies, Sanctuary has a modular design:
[sanctuary-def][] provides type checking, [sanctuary-type-classes][]
provides Fantasy Land functions and type classes, [sanctuary-show][]
provides string representations, and algebraic data types are provided
by [sanctuary-either][], [sanctuary-maybe][], and [sanctuary-pair][].
Not only does this approach reduce the complexity of Sanctuary itself,
but it allows these components to be reused in other contexts.

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
value by a squiggly arrow (`~>`). The type of the `fantasy-land/map` method
of the Maybe type is written `Maybe a ~> (a -> b) -> Maybe b`. One could
read this as:

_When the `fantasy-land/map` method is invoked on a value of type `Maybe a`
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

## Type checking

Sanctuary functions are defined via [sanctuary-def][] to provide run-time
type checking. This is tremendously useful during development: type errors
are reported immediately, avoiding circuitous stack traces (at best) and
silent failures due to type coercion (at worst). For example:

```javascript
S.add (2) (true);
// ! TypeError: Invalid value
//
//   add :: FiniteNumber -> FiniteNumber -> FiniteNumber
//                          ^^^^^^^^^^^^
//                               1
//
//   1)  true :: Boolean
//
//   The value at position 1 is not a member of ‘FiniteNumber’.
//
//   See https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#FiniteNumber for information about the sanctuary-def/FiniteNumber type.
```

Compare this to the behaviour of Ramda's unchecked equivalent:

```javascript
R.add (2) (true);
// => 3
```

There is a performance cost to run-time type checking. Type checking is
disabled by default if `process.env.NODE_ENV` is `'production'`. If this
rule is unsuitable for a given program, one may use [`create`](#create)
to create a Sanctuary module based on a different rule. For example:

```javascript
const S = sanctuary.create ({
  checkTypes: localStorage.getItem ('SANCTUARY_CHECK_TYPES') === 'true',
  env: sanctuary.env,
});
```

Occasionally one may wish to perform an operation which is not type safe,
such as mapping over an object with heterogeneous values. This is possible
via selective use of [`unchecked`](#unchecked) functions.

## Installation

`npm install sanctuary` will install Sanctuary for use in Node.js.

Running Sanctuary in the browser is more involved. One must include a
`<script>` for each dependency in addition to one for Sanctuary itself:

```html
<script src="vendor/sanctuary-show.js"></script>
<script src="vendor/sanctuary-type-identifiers.js"></script>
<script src="vendor/sanctuary-type-classes.js"></script>
<script src="vendor/sanctuary-either.js"></script>
<script src="vendor/sanctuary-maybe.js"></script>
<script src="vendor/sanctuary-pair.js"></script>
<script src="vendor/sanctuary-def.js"></script>
<script src="vendor/sanctuary.js"></script>
```

To ensure compatibility one should use the dependency versions specified
in __package.json__.

For convenience one could define aliases for various modules:

```javascript
const S = window.sanctuary;
const $ = window.sanctuaryDef;
// ...
```

## API

### Configure

#### <a name="create" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L555">`create :: { checkTypes :: Boolean, env :: Array Type } -⁠> Module`</a>

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
const {create, env} = require ('sanctuary');
const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');

//    Identity :: a -> Identity a
const Identity = x => {
  const identity = Object.create (Identity$prototype);
  identity.value = x;
  return identity;
};

Identity['@@type'] = 'my-package/Identity@1';

const Identity$prototype = {
  'constructor': Identity,
  '@@show': function() { return `Identity (${S.show (this.value)})`; },
  'fantasy-land/map': function(f) { return Identity (f (this.value)); },
};

//    IdentityType :: Type -> Type
const IdentityType = $.UnaryType
  (Identity['@@type'])
  ('http://example.com/my-package#Identity')
  (x => type (x) === Identity['@@type'])
  (identity => [identity.value]);

const S = create ({
  checkTypes: process.env.NODE_ENV !== 'production',
  env: env.concat ([IdentityType ($.Unknown)]),
});

S.map (S.sub (1)) (Identity (43));
// => Identity (42)
```

See also [`env`](#env).

#### <a name="env" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L632">`env :: Array Type`</a>

The Sanctuary module's environment (`(S.create ({checkTypes, env})).env`
is a reference to `env`). Useful in conjunction with [`create`](#create).

```javascript
> S.env
[ $.AnyFunction,
. $.Arguments,
. $.Array ($.Unknown),
. $.Boolean,
. $.Date,
. $.Error,
. $.HtmlElement,
. $.Null,
. $.Number,
. $.Object,
. $.RegExp,
. $.StrMap ($.Unknown),
. $.String,
. $.Symbol,
. $.Undefined,
. $.FiniteNumber,
. $.NonZeroFiniteNumber,
. S.EitherType ($.Unknown) ($.Unknown),
. $.Function ([$.Unknown, $.Unknown]),
. $.GlobalRegExp,
. $.NonGlobalRegExp,
. $.Integer,
. $.NonNegativeInteger,
. S.MaybeType ($.Unknown),
. $.Array2 ($.Unknown) ($.Unknown),
. S.PairType ($.Unknown) ($.Unknown),
. $.RegexFlags,
. $.Type,
. $.TypeClass,
. $.ValidDate,
. $.ValidNumber ]
```

#### <a name="unchecked" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L672">`unchecked :: Module`</a>

A complete Sanctuary module which performs no type checking. This is
useful as it permits operations which Sanctuary's type checking would
disallow, such as mapping over an object with heterogeneous values.

See also [`create`](#create).

```javascript
> S.unchecked.map (S.show) ({x: 'foo', y: true, z: 42})
{x: '"foo"', y: 'true', z: '42'}
```

Opting out of type checking may cause type errors to go unnoticed.

```javascript
> S.unchecked.add (2) ('2')
'22'
```

### Classify

#### <a name="type" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L694">`type :: Any -⁠> { namespace :: Maybe String, name :: String, version :: NonNegativeInteger }`</a>

Returns the result of parsing the [type identifier][] of the given value.

```javascript
> S.type (S.Just (42))
{namespace: Just ('sanctuary-maybe'), name: 'Maybe', version: 1}

> S.type ([1, 2, 3])
{namespace: Nothing, name: 'Array', version: 0}
```

#### <a name="is" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L719">`is :: Type -⁠> Any -⁠> Boolean`</a>

Returns `true` [iff][] the given value is a member of the specified type.
See [`$.test`][] for details.

```javascript
> S.is ($.Array ($.Integer)) ([1, 2, 3])
true

> S.is ($.Array ($.Integer)) ([1, 2, 3.14])
false
```

### Showable

#### <a name="show" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L734">`show :: Any -⁠> String`</a>

Alias of [`show`][].

```javascript
> S.show (-0)
'-0'

> S.show (['foo', 'bar', 'baz'])
'["foo", "bar", "baz"]'

> S.show ({x: 1, y: 2, z: 3})
'{"x": 1, "y": 2, "z": 3}'

> S.show (S.Left (S.Right (S.Just (S.Nothing))))
'Left (Right (Just (Nothing)))'
```

### Fantasy Land

Sanctuary is compatible with the [Fantasy Land][] specification.

#### <a name="equals" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L761">`equals :: Setoid a => a -⁠> a -⁠> Boolean`</a>

Curried version of [`Z.equals`][] which requires two arguments of the
same type.

To compare values of different types first use [`create`](#create) to
create a Sanctuary module with type checking disabled, then use that
module's `equals` function.

```javascript
> S.equals (0) (-0)
true

> S.equals (NaN) (NaN)
true

> S.equals (S.Just ([1, 2, 3])) (S.Just ([1, 2, 3]))
true

> S.equals (S.Just ([1, 2, 3])) (S.Just ([1, 2, 4]))
false
```

#### <a name="lt" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L789">`lt :: Ord a => a -⁠> a -⁠> Boolean`</a>

Returns `true` [iff][] the *second* argument is less than the first
according to [`Z.lt`][].

```javascript
> S.filter (S.lt (3)) ([1, 2, 3, 4, 5])
[1, 2]
```

#### <a name="lte" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L809">`lte :: Ord a => a -⁠> a -⁠> Boolean`</a>

Returns `true` [iff][] the *second* argument is less than or equal to
the first according to [`Z.lte`][].

```javascript
> S.filter (S.lte (3)) ([1, 2, 3, 4, 5])
[1, 2, 3]
```

#### <a name="gt" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L829">`gt :: Ord a => a -⁠> a -⁠> Boolean`</a>

Returns `true` [iff][] the *second* argument is greater than the first
according to [`Z.gt`][].

```javascript
> S.filter (S.gt (3)) ([1, 2, 3, 4, 5])
[4, 5]
```

#### <a name="gte" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L849">`gte :: Ord a => a -⁠> a -⁠> Boolean`</a>

Returns `true` [iff][] the *second* argument is greater than or equal
to the first according to [`Z.gte`][].

```javascript
> S.filter (S.gte (3)) ([1, 2, 3, 4, 5])
[3, 4, 5]
```

#### <a name="min" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L869">`min :: Ord a => a -⁠> a -⁠> a`</a>

Returns the smaller of its two arguments (according to [`Z.lte`][]).

See also [`max`](#max).

```javascript
> S.min (10) (2)
2

> S.min (new Date ('1999-12-31')) (new Date ('2000-01-01'))
new Date ('1999-12-31')

> S.min ('10') ('2')
'10'
```

#### <a name="max" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L891">`max :: Ord a => a -⁠> a -⁠> a`</a>

Returns the larger of its two arguments (according to [`Z.lte`][]).

See also [`min`](#min).

```javascript
> S.max (10) (2)
10

> S.max (new Date ('1999-12-31')) (new Date ('2000-01-01'))
new Date ('2000-01-01')

> S.max ('10') ('2')
'2'
```

#### <a name="clamp" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L913">`clamp :: Ord a => a -⁠> a -⁠> a -⁠> a`</a>

Takes a lower bound, an upper bound, and a value of the same type.
Returns the value if it is within the bounds; the nearer bound otherwise.

See also [`min`](#min) and [`max`](#max).

```javascript
> S.clamp (0) (100) (42)
42

> S.clamp (0) (100) (-1)
0

> S.clamp ('A') ('Z') ('~')
'Z'
```

#### <a name="id" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L936">`id :: Category c => TypeRep c -⁠> c`</a>

[Type-safe][sanctuary-def] version of [`Z.id`][].

```javascript
> S.id (Function) (42)
42
```

#### <a name="concat" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L950">`concat :: Semigroup a => a -⁠> a -⁠> a`</a>

Curried version of [`Z.concat`][].

```javascript
> S.concat ('abc') ('def')
'abcdef'

> S.concat ([1, 2, 3]) ([4, 5, 6])
[1, 2, 3, 4, 5, 6]

> S.concat ({x: 1, y: 2}) ({y: 3, z: 4})
{x: 1, y: 3, z: 4}

> S.concat (S.Just ([1, 2, 3])) (S.Just ([4, 5, 6]))
Just ([1, 2, 3, 4, 5, 6])

> S.concat (Sum (18)) (Sum (24))
Sum (42)
```

#### <a name="empty" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L976">`empty :: Monoid a => TypeRep a -⁠> a`</a>

[Type-safe][sanctuary-def] version of [`Z.empty`][].

```javascript
> S.empty (String)
''

> S.empty (Array)
[]

> S.empty (Object)
{}

> S.empty (Sum)
Sum (0)
```

#### <a name="invert" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L999">`invert :: Group g => g -⁠> g`</a>

[Type-safe][sanctuary-def] version of [`Z.invert`][].

```javascript
> S.invert (Sum (5))
Sum (-5)
```

#### <a name="filter" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1013">`filter :: Filterable f => (a -⁠> Boolean) -⁠> f a -⁠> f a`</a>

Curried version of [`Z.filter`][]. Discards every element which does not
satisfy the predicate.

See also [`reject`](#reject).

```javascript
> S.filter (S.odd) ([1, 2, 3])
[1, 3]

> S.filter (S.odd) ({x: 1, y: 2, z: 3})
{x: 1, z: 3}

> S.filter (S.odd) (S.Nothing)
Nothing

> S.filter (S.odd) (S.Just (0))
Nothing

> S.filter (S.odd) (S.Just (1))
Just (1)
```

#### <a name="reject" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1047">`reject :: Filterable f => (a -⁠> Boolean) -⁠> f a -⁠> f a`</a>

Curried version of [`Z.reject`][]. Discards every element which satisfies
the predicate.

See also [`filter`](#filter).

```javascript
> S.reject (S.odd) ([1, 2, 3])
[2]

> S.reject (S.odd) ({x: 1, y: 2, z: 3})
{y: 2}

> S.reject (S.odd) (S.Nothing)
Nothing

> S.reject (S.odd) (S.Just (0))
Just (0)

> S.reject (S.odd) (S.Just (1))
Nothing
```

#### <a name="takeWhile" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1076">`takeWhile :: Filterable f => (a -⁠> Boolean) -⁠> f a -⁠> f a`</a>

Curried version of [`Z.takeWhile`][]. Discards the first element which
does not satisfy the predicate, and all subsequent elements.

See also [`dropWhile`](#dropWhile).

```javascript
> S.takeWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])
[3, 3, 3, 7]

> S.takeWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])
[]
```

#### <a name="dropWhile" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1096">`dropWhile :: Filterable f => (a -⁠> Boolean) -⁠> f a -⁠> f a`</a>

Curried version of [`Z.dropWhile`][]. Retains the first element which
does not satisfy the predicate, and all subsequent elements.

See also [`takeWhile`](#takeWhile).

```javascript
> S.dropWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])
[6, 3, 5, 4]

> S.dropWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])
[3, 3, 3, 7, 6, 3, 5, 4]
```

#### <a name="map" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1116">`map :: Functor f => (a -⁠> b) -⁠> f a -⁠> f b`</a>

Curried version of [`Z.map`][].

```javascript
> S.map (Math.sqrt) ([1, 4, 9])
[1, 2, 3]

> S.map (Math.sqrt) ({x: 1, y: 4, z: 9})
{x: 1, y: 2, z: 3}

> S.map (Math.sqrt) (S.Just (9))
Just (3)

> S.map (Math.sqrt) (S.Right (9))
Right (3)

> S.map (Math.sqrt) (S.Pair (99980001) (99980001))
Pair (99980001) (9999)
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
> S.map (Math.sqrt) (S.add (1)) (99)
10
```

#### <a name="flip" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1162">`flip :: Functor f => f (a -⁠> b) -⁠> a -⁠> f b`</a>

Curried version of [`Z.flip`][]. Maps over the given functions, applying
each to the given value.

Replacing `Functor f => f` with `Function x` produces the C combinator
from combinatory logic:

    Functor f => f (a -> b) -> a -> f b
    Function x (a -> b) -> a -> Function x b
    Function x (a -> c) -> a -> Function x c
    Function x (b -> c) -> b -> Function x c
    Function a (b -> c) -> b -> Function a c
    (a -> b -> c) -> b -> a -> c

```javascript
> S.flip (S.concat) ('!') ('foo')
'foo!'

> S.flip ([Math.floor, Math.ceil]) (1.5)
[1, 2]

> S.flip ({floor: Math.floor, ceil: Math.ceil}) (1.5)
{floor: 1, ceil: 2}

> S.flip (Cons (Math.floor) (Cons (Math.ceil) (Nil))) (1.5)
Cons (1) (Cons (2) (Nil))
```

#### <a name="bimap" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1196">`bimap :: Bifunctor f => (a -⁠> b) -⁠> (c -⁠> d) -⁠> f a c -⁠> f b d`</a>

Curried version of [`Z.bimap`][].

```javascript
> S.bimap (S.toUpper) (Math.sqrt) (S.Pair ('foo') (64))
Pair ('FOO') (8)

> S.bimap (S.toUpper) (Math.sqrt) (S.Left ('foo'))
Left ('FOO')

> S.bimap (S.toUpper) (Math.sqrt) (S.Right (64))
Right (8)
```

#### <a name="mapLeft" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1216">`mapLeft :: Bifunctor f => (a -⁠> b) -⁠> f a c -⁠> f b c`</a>

Curried version of [`Z.mapLeft`][]. Maps the given function over the left
side of a Bifunctor.

```javascript
> S.mapLeft (S.toUpper) (S.Pair ('foo') (64))
Pair ('FOO') (64)

> S.mapLeft (S.toUpper) (S.Left ('foo'))
Left ('FOO')

> S.mapLeft (S.toUpper) (S.Right (64))
Right (64)
```

#### <a name="promap" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1237">`promap :: Profunctor p => (a -⁠> b) -⁠> (c -⁠> d) -⁠> p b c -⁠> p a d`</a>

Curried version of [`Z.promap`][].

```javascript
> S.promap (Math.abs) (S.add (1)) (Math.sqrt) (-100)
11
```

#### <a name="alt" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1251">`alt :: Alt f => f a -⁠> f a -⁠> f a`</a>

Curried version of [`Z.alt`][].

```javascript
> S.alt (S.Nothing) (S.Just (1))
Just (1)

> S.alt (S.Just (2)) (S.Just (3))
Just (2)

> S.alt (S.Left ('X')) (S.Right (1))
Right (1)

> S.alt (S.Right (2)) (S.Right (3))
Right (2)
```

#### <a name="zero" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1274">`zero :: Plus f => TypeRep f -⁠> f a`</a>

[Type-safe][sanctuary-def] version of [`Z.zero`][].

```javascript
> S.zero (Array)
[]

> S.zero (Object)
{}

> S.zero (S.Maybe)
Nothing
```

#### <a name="reduce" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1294">`reduce :: Foldable f => (b -⁠> a -⁠> b) -⁠> b -⁠> f a -⁠> b`</a>

Takes a curried binary function, an initial value, and a [Foldable][],
and applies the function to the initial value and the Foldable's first
value, then applies the function to the result of the previous
application and the Foldable's second value. Repeats this process
until each of the Foldable's values has been used. Returns the initial
value if the Foldable is empty; the result of the final application
otherwise.

```javascript
> S.reduce (S.add) (0) ([1, 2, 3, 4, 5])
15

> S.reduce (xs => x => S.prepend (x) (xs)) ([]) ([1, 2, 3, 4, 5])
[5, 4, 3, 2, 1]
```

#### <a name="traverse" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1326">`traverse :: (Applicative f, Traversable t) => TypeRep f -⁠> (a -⁠> f b) -⁠> t a -⁠> f (t b)`</a>

Curried version of [`Z.traverse`][].

```javascript
> S.traverse (Array) (S.words) (S.Just ('foo bar baz'))
[Just ('foo'), Just ('bar'), Just ('baz')]

> S.traverse (Array) (S.words) (S.Nothing)
[Nothing]

> S.traverse (S.Maybe) (S.parseInt (16)) (['A', 'B', 'C'])
Just ([10, 11, 12])

> S.traverse (S.Maybe) (S.parseInt (16)) (['A', 'B', 'C', 'X'])
Nothing

> S.traverse (S.Maybe) (S.parseInt (16)) ({a: 'A', b: 'B', c: 'C'})
Just ({a: 10, b: 11, c: 12})

> S.traverse (S.Maybe) (S.parseInt (16)) ({a: 'A', b: 'B', c: 'C', x: 'X'})
Nothing
```

#### <a name="sequence" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1355">`sequence :: (Applicative f, Traversable t) => TypeRep f -⁠> t (f a) -⁠> f (t a)`</a>

Curried version of [`Z.sequence`][]. Inverts the given `t (f a)`
to produce an `f (t a)`.

```javascript
> S.sequence (Array) (S.Just ([1, 2, 3]))
[Just (1), Just (2), Just (3)]

> S.sequence (S.Maybe) ([S.Just (1), S.Just (2), S.Just (3)])
Just ([1, 2, 3])

> S.sequence (S.Maybe) ([S.Just (1), S.Just (2), S.Nothing])
Nothing

> S.sequence (S.Maybe) ({a: S.Just (1), b: S.Just (2), c: S.Just (3)})
Just ({a: 1, b: 2, c: 3})

> S.sequence (S.Maybe) ({a: S.Just (1), b: S.Just (2), c: S.Nothing})
Nothing
```

#### <a name="ap" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1382">`ap :: Apply f => f (a -⁠> b) -⁠> f a -⁠> f b`</a>

Curried version of [`Z.ap`][].

```javascript
> S.ap ([Math.sqrt, x => x * x]) ([1, 4, 9, 16, 25])
[1, 2, 3, 4, 5, 1, 16, 81, 256, 625]

> S.ap ({x: Math.sqrt, y: S.add (1), z: S.sub (1)}) ({w: 4, x: 4, y: 4})
{x: 2, y: 5}

> S.ap (S.Just (Math.sqrt)) (S.Just (64))
Just (8)
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
> S.ap (s => n => s.slice (0, n)) (s => Math.ceil (s.length / 2)) ('Haskell')
'Hask'
```

#### <a name="lift2" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1417">`lift2 :: Apply f => (a -⁠> b -⁠> c) -⁠> f a -⁠> f b -⁠> f c`</a>

Promotes a curried binary function to a function which operates on two
[Apply][]s.

```javascript
> S.lift2 (S.add) (S.Just (2)) (S.Just (3))
Just (5)

> S.lift2 (S.add) (S.Just (2)) (S.Nothing)
Nothing

> S.lift2 (S.and) (S.Just (true)) (S.Just (true))
Just (true)

> S.lift2 (S.and) (S.Just (true)) (S.Just (false))
Just (false)
```

#### <a name="lift3" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1441">`lift3 :: Apply f => (a -⁠> b -⁠> c -⁠> d) -⁠> f a -⁠> f b -⁠> f c -⁠> f d`</a>

Promotes a curried ternary function to a function which operates on three
[Apply][]s.

```javascript
> S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Just ([1, 2, 3]))
Just (6)

> S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Nothing)
Nothing
```

#### <a name="apFirst" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1459">`apFirst :: Apply f => f a -⁠> f b -⁠> f a`</a>

Curried version of [`Z.apFirst`][]. Combines two effectful actions,
keeping only the result of the first. Equivalent to Haskell's `(<*)`
function.

See also [`apSecond`](#apSecond).

```javascript
> S.apFirst ([1, 2]) ([3, 4])
[1, 1, 2, 2]

> S.apFirst (S.Just (1)) (S.Just (2))
Just (1)
```

#### <a name="apSecond" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1480">`apSecond :: Apply f => f a -⁠> f b -⁠> f b`</a>

Curried version of [`Z.apSecond`][]. Combines two effectful actions,
keeping only the result of the second. Equivalent to Haskell's `(*>)`
function.

See also [`apFirst`](#apFirst).

```javascript
> S.apSecond ([1, 2]) ([3, 4])
[3, 4, 3, 4]

> S.apSecond (S.Just (1)) (S.Just (2))
Just (2)
```

#### <a name="of" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1501">`of :: Applicative f => TypeRep f -⁠> a -⁠> f a`</a>

Curried version of [`Z.of`][].

```javascript
> S.of (Array) (42)
[42]

> S.of (Function) (42) (null)
42

> S.of (S.Maybe) (42)
Just (42)

> S.of (S.Either) (42)
Right (42)
```

#### <a name="chain" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1529">`chain :: Chain m => (a -⁠> m b) -⁠> m a -⁠> m b`</a>

Curried version of [`Z.chain`][].

```javascript
> S.chain (x => [x, x]) ([1, 2, 3])
[1, 1, 2, 2, 3, 3]

> S.chain (n => s => s.slice (0, n)) (s => Math.ceil (s.length / 2)) ('slice')
'sli'

> S.chain (S.parseInt (10)) (S.Just ('123'))
Just (123)

> S.chain (S.parseInt (10)) (S.Just ('XXX'))
Nothing
```

#### <a name="join" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1552">`join :: Chain m => m (m a) -⁠> m a`</a>

[Type-safe][sanctuary-def] version of [`Z.join`][].
Removes one level of nesting from a nested monadic structure.

```javascript
> S.join ([[1], [2], [3]])
[1, 2, 3]

> S.join ([[[1, 2, 3]]])
[[1, 2, 3]]

> S.join (S.Just (S.Just (1)))
Just (1)

> S.join (S.Pair ('foo') (S.Pair ('bar') ('baz')))
Pair ('foobar') ('baz')
```

Replacing `Chain m => m` with `Function x` produces the W combinator
from combinatory logic:

    Chain m => m (m a) -> m a
    Function x (Function x a) -> Function x a
    (x -> x -> a) -> (x -> a)

```javascript
> S.join (S.concat) ('abc')
'abcabc'
```

#### <a name="chainRec" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1588">`chainRec :: ChainRec m => TypeRep m -⁠> (a -⁠> m (Either a b)) -⁠> a -⁠> m b`</a>

Performs a [`chain`](#chain)-like computation with constant stack usage.
Similar to [`Z.chainRec`][], but curried and more convenient due to the
use of the Either type to indicate completion (via a Right).

```javascript
> S.chainRec (Array)
.            (s => s.length === 2 ? S.map (S.Right) ([s + '!', s + '?'])
.                                 : S.map (S.Left) ([s + 'o', s + 'n']))
.            ('')
['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
```

#### <a name="extend" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1620">`extend :: Extend w => (w a -⁠> b) -⁠> w a -⁠> w b`</a>

Curried version of [`Z.extend`][].

```javascript
> S.extend (S.joinWith ('')) (['x', 'y', 'z'])
['xyz', 'yz', 'z']

> S.extend (f => f ([3, 4])) (S.reverse) ([1, 2])
[4, 3, 2, 1]
```

#### <a name="duplicate" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1637">`duplicate :: Extend w => w a -⁠> w (w a)`</a>

[Type-safe][sanctuary-def] version of [`Z.duplicate`][].
Adds one level of nesting to a comonadic structure.

```javascript
> S.duplicate (S.Just (1))
Just (Just (1))

> S.duplicate ([1])
[[1]]

> S.duplicate ([1, 2, 3])
[[1, 2, 3], [2, 3], [3]]

> S.duplicate (S.reverse) ([1, 2]) ([3, 4])
[4, 3, 2, 1]
```

#### <a name="extract" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1661">`extract :: Comonad w => w a -⁠> a`</a>

[Type-safe][sanctuary-def] version of [`Z.extract`][].

```javascript
> S.extract (S.Pair ('foo') ('bar'))
'bar'
```

#### <a name="contramap" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1675">`contramap :: Contravariant f => (b -⁠> a) -⁠> f a -⁠> f b`</a>

[Type-safe][sanctuary-def] version of [`Z.contramap`][].

```javascript
> S.contramap (s => s.length) (Math.sqrt) ('Sanctuary')
3
```

### Combinator

#### <a name="I" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1691">`I :: a -⁠> a`</a>

The I combinator. Returns its argument. Equivalent to Haskell's `id`
function.

```javascript
> S.I ('foo')
'foo'
```

#### <a name="K" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1709">`K :: a -⁠> b -⁠> a`</a>

The K combinator. Takes two values and returns the first. Equivalent to
Haskell's `const` function.

```javascript
> S.K ('foo') ('bar')
'foo'

> S.map (S.K (42)) (S.range (0) (5))
[42, 42, 42, 42, 42]
```

#### <a name="T" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1732">`T :: a -⁠> (a -⁠> b) -⁠> b`</a>

The T ([thrush][]) combinator. Takes a value and a function, and returns
the result of applying the function to the value. Equivalent to Haskell's
`(&)` function.

```javascript
> S.T (42) (S.add (1))
43

> S.map (S.T (100)) ([S.add (1), Math.sqrt])
[101, 10]
```

### Function

#### <a name="curry2" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1758">`curry2 :: ((a, b) -⁠> c) -⁠> a -⁠> b -⁠> c`</a>

Curries the given binary function.

```javascript
> S.map (S.curry2 (Math.pow) (10)) ([1, 2, 3])
[10, 100, 1000]
```

#### <a name="curry3" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1779">`curry3 :: ((a, b, c) -⁠> d) -⁠> a -⁠> b -⁠> c -⁠> d`</a>

Curries the given ternary function.

```javascript
> const replaceString = S.curry3 ((what, replacement, string) =>
.   string.replace (what, replacement)
. )

> replaceString ('banana') ('orange') ('banana icecream')
'orange icecream'
```

#### <a name="curry4" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1806">`curry4 :: ((a, b, c, d) -⁠> e) -⁠> a -⁠> b -⁠> c -⁠> d -⁠> e`</a>

Curries the given quaternary function.

```javascript
> const createRect = S.curry4 ((x, y, width, height) =>
.   ({x, y, width, height})
. )

> createRect (0) (0) (10) (10)
{x: 0, y: 0, width: 10, height: 10}
```

#### <a name="curry5" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1835">`curry5 :: ((a, b, c, d, e) -⁠> f) -⁠> a -⁠> b -⁠> c -⁠> d -⁠> e -⁠> f`</a>

Curries the given quinary function.

```javascript
> const toUrl = S.curry5 ((protocol, creds, hostname, port, pathname) =>
.   protocol + '//' +
.   S.maybe ('') (S.flip (S.concat) ('@')) (creds) +
.   hostname +
.   S.maybe ('') (S.concat (':')) (port) +
.   pathname
. )

> toUrl ('https:') (S.Nothing) ('example.com') (S.Just ('443')) ('/foo/bar')
'https://example.com:443/foo/bar'
```

### Composition

#### <a name="compose" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1872">`compose :: Semigroupoid s => s b c -⁠> s a b -⁠> s a c`</a>

Curried version of [`Z.compose`][].

When specialized to Function, `compose` composes two unary functions,
from right to left (this is the B combinator from combinatory logic).

The generalized type signature indicates that `compose` is compatible
with any [Semigroupoid][].

See also [`pipe`](#pipe).

```javascript
> S.compose (Math.sqrt) (S.add (1)) (99)
10
```

#### <a name="pipe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1894">`pipe :: Foldable f => f (Any -⁠> Any) -⁠> a -⁠> b`</a>

Takes a sequence of functions assumed to be unary and a value of any
type, and returns the result of applying the sequence of transformations
to the initial value.

In general terms, `pipe` performs left-to-right composition of a sequence
of functions. `pipe ([f, g, h]) (x)` is equivalent to `h (g (f (x)))`.

```javascript
> S.pipe ([S.add (1), Math.sqrt, S.sub (1)]) (99)
9
```

#### <a name="pipeK" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1918">`pipeK :: (Foldable f, Chain m) => f (Any -⁠> m Any) -⁠> m a -⁠> m b`</a>

Takes a sequence of functions assumed to be unary which return values
with a [Chain][], and a value of that Chain, and returns the result
of applying the sequence of transformations to the initial value.

In general terms, `pipeK` performs left-to-right [Kleisli][] composition
of an sequence of functions. `pipeK ([f, g, h]) (x)` is equivalent to
`chain (h) (chain (g) (chain (f) (x)))`.

```javascript
> S.pipeK ([S.tail, S.tail, S.head]) (S.Just ([1, 2, 3, 4]))
Just (3)
```

#### <a name="on" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1943">`on :: (b -⁠> b -⁠> c) -⁠> (a -⁠> b) -⁠> a -⁠> a -⁠> c`</a>

Takes a binary function `f`, a unary function `g`, and two
values `x` and `y`. Returns `f (g (x)) (g (y))`.

This is the P combinator from combinatory logic.

```javascript
> S.on (S.concat) (S.reverse) ([1, 2, 3]) ([4, 5, 6])
[3, 2, 1, 6, 5, 4]
```

### Pair type

Pair is the canonical product type: a value of type `Pair a b` always
contains exactly two values: one of type `a`; one of type `b`.

The implementation is provided by [sanctuary-pair][].

#### <a name="PairType" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1976">`PairType :: Type -⁠> Type -⁠> Type`</a>

A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

#### <a name="Pair" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1980">`Pair :: a -⁠> b -⁠> Pair a b`</a>

Pair's sole data constructor. Additionally, it serves as the
Pair [type representative][].

```javascript
> S.Pair ('foo') (42)
Pair ('foo') (42)
```

#### <a name="fst" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L1995">`fst :: Pair a b -⁠> a`</a>

`fst (Pair (x) (y))` is equivalent to `x`.

```javascript
> S.fst (S.Pair ('foo') (42))
'foo'
```

#### <a name="snd" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2009">`snd :: Pair a b -⁠> b`</a>

`snd (Pair (x) (y))` is equivalent to `y`.

```javascript
> S.snd (S.Pair ('foo') (42))
42
```

#### <a name="swap" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2023">`swap :: Pair a b -⁠> Pair b a`</a>

`swap (Pair (x) (y))` is equivalent to `Pair (y) (x)`.

```javascript
> S.swap (S.Pair ('foo') (42))
Pair (42) ('foo')
```

### Maybe type

The Maybe type represents optional values: a value of type `Maybe a` is
either Nothing (the empty value) or a Just whose value is of type `a`.

The implementation is provided by [sanctuary-maybe][].

#### <a name="MaybeType" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2044">`MaybeType :: Type -⁠> Type`</a>

A [`UnaryType`][UnaryType] for use with [sanctuary-def][].

#### <a name="Maybe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2048">`Maybe :: TypeRep Maybe`</a>

Maybe [type representative][].

#### <a name="Nothing" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2052">`Nothing :: Maybe a`</a>

The empty value of type `Maybe a`.

```javascript
> S.Nothing
Nothing
```

#### <a name="Just" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2061">`Just :: a -⁠> Maybe a`</a>

Constructs a value of type `Maybe a` from a value of type `a`.

```javascript
> S.Just (42)
Just (42)
```

#### <a name="isNothing" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2075">`isNothing :: Maybe a -⁠> Boolean`</a>

Returns `true` if the given Maybe is Nothing; `false` if it is a Just.

```javascript
> S.isNothing (S.Nothing)
true

> S.isNothing (S.Just (42))
false
```

#### <a name="isJust" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2095">`isJust :: Maybe a -⁠> Boolean`</a>

Returns `true` if the given Maybe is a Just; `false` if it is Nothing.

```javascript
> S.isJust (S.Just (42))
true

> S.isJust (S.Nothing)
false
```

#### <a name="fromMaybe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2115">`fromMaybe :: a -⁠> Maybe a -⁠> a`</a>

Takes a default value and a Maybe, and returns the Maybe's value
if the Maybe is a Just; the default value otherwise.

See also [`fromMaybe_`](#fromMaybe_) and
[`maybeToNullable`](#maybeToNullable).

```javascript
> S.fromMaybe (0) (S.Just (42))
42

> S.fromMaybe (0) (S.Nothing)
0
```

#### <a name="fromMaybe_" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2136">`fromMaybe_ :: (() -⁠> a) -⁠> Maybe a -⁠> a`</a>

Variant of [`fromMaybe`](#fromMaybe) which takes a thunk so the default
value is only computed if required.

```javascript
> function fib(n) { return n <= 1 ? n : fib (n - 2) + fib (n - 1); }

> S.fromMaybe_ (() => fib (30)) (S.Just (1000000))
1000000

> S.fromMaybe_ (() => fib (30)) (S.Nothing)
832040
```

#### <a name="maybeToNullable" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2156">`maybeToNullable :: Maybe a -⁠> Nullable a`</a>

Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
[Nullable][] is defined in [sanctuary-def][].

See also [`fromMaybe`](#fromMaybe).

```javascript
> S.maybeToNullable (S.Just (42))
42

> S.maybeToNullable (S.Nothing)
null
```

#### <a name="toMaybe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2179">`toMaybe :: a? -⁠> Maybe a`</a>

Takes a value and returns Nothing if the value is `null` or `undefined`;
Just the value otherwise.

```javascript
> S.toMaybe (null)
Nothing

> S.toMaybe (42)
Just (42)
```

#### <a name="maybe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2200">`maybe :: b -⁠> (a -⁠> b) -⁠> Maybe a -⁠> b`</a>

Takes a value of any type, a function, and a Maybe. If the Maybe is
a Just, the return value is the result of applying the function to
the Just's value. Otherwise, the first argument is returned.

See also [`maybe_`](#maybe_).

```javascript
> S.maybe (0) (S.prop ('length')) (S.Just ('refuge'))
6

> S.maybe (0) (S.prop ('length')) (S.Nothing)
0
```

#### <a name="maybe_" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2228">`maybe_ :: (() -⁠> b) -⁠> (a -⁠> b) -⁠> Maybe a -⁠> b`</a>

Variant of [`maybe`](#maybe) which takes a thunk so the default value
is only computed if required.

```javascript
> function fib(n) { return n <= 1 ? n : fib (n - 2) + fib (n - 1); }

> S.maybe_ (() => fib (30)) (Math.sqrt) (S.Just (1000000))
1000

> S.maybe_ (() => fib (30)) (Math.sqrt) (S.Nothing)
832040
```

#### <a name="justs" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2255">`justs :: (Filterable f, Functor f) => f (Maybe a) -⁠> f a`</a>

Discards each element which is Nothing, and unwraps each element which is
a Just. Related to Haskell's `catMaybes` function.

See also [`lefts`](#lefts) and [`rights`](#rights).

```javascript
> S.justs ([S.Just ('foo'), S.Nothing, S.Just ('baz')])
['foo', 'baz']
```

#### <a name="mapMaybe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2275">`mapMaybe :: (Filterable f, Functor f) => (a -⁠> Maybe b) -⁠> f a -⁠> f b`</a>

Takes a function and a structure, applies the function to each element
of the structure, and returns the "successful" results. If the result of
applying the function to an element is Nothing, the result is discarded;
if the result is a Just, the Just's value is included.

```javascript
> S.mapMaybe (S.head) ([[], [1, 2, 3], [], [4, 5, 6], []])
[1, 4]

> S.mapMaybe (S.head) ({x: [1, 2, 3], y: [], z: [4, 5, 6]})
{x: 1, z: 4}
```

#### <a name="encase" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2295">`encase :: (a -⁠> b) -⁠> a -⁠> Maybe b`</a>

Takes a unary function `f` which may throw and a value `x` of any type,
and applies `f` to `x` inside a `try` block. If an exception is caught,
the return value is Nothing; otherwise the return value is Just the
result of applying `f` to `x`.

See also [`encaseEither`](#encaseEither).

```javascript
> S.encase (eval) ('1 + 1')
Just (2)

> S.encase (eval) ('1 +')
Nothing
```

#### <a name="encase2" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2320">`encase2 :: (a -⁠> b -⁠> c) -⁠> a -⁠> b -⁠> Maybe c`</a>

Binary version of [`encase`](#encase).

#### <a name="encase3" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2329">`encase3 :: (a -⁠> b -⁠> c -⁠> d) -⁠> a -⁠> b -⁠> c -⁠> Maybe d`</a>

Ternary version of [`encase`](#encase).

#### <a name="maybeToEither" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2338">`maybeToEither :: a -⁠> Maybe b -⁠> Either a b`</a>

Converts a Maybe to an Either. Nothing becomes a Left (containing the
first argument); a Just becomes a Right.

See also [`eitherToMaybe`](#eitherToMaybe).

```javascript
> S.maybeToEither ('Expecting an integer') (S.parseInt (10) ('xyz'))
Left ('Expecting an integer')

> S.maybeToEither ('Expecting an integer') (S.parseInt (10) ('42'))
Right (42)
```

### Either type

The Either type represents values with two possibilities: a value of type
`Either a b` is either a Left whose value is of type `a` or a Right whose
value is of type `b`.

The implementation is provided by [sanctuary-either][].

#### <a name="EitherType" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2369">`EitherType :: Type -⁠> Type -⁠> Type`</a>

A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

#### <a name="Either" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2373">`Either :: TypeRep Either`</a>

Either [type representative][].

#### <a name="Left" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2377">`Left :: a -⁠> Either a b`</a>

Constructs a value of type `Either a b` from a value of type `a`.

```javascript
> S.Left ('Cannot divide by zero')
Left ('Cannot divide by zero')
```

#### <a name="Right" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2391">`Right :: b -⁠> Either a b`</a>

Constructs a value of type `Either a b` from a value of type `b`.

```javascript
> S.Right (42)
Right (42)
```

#### <a name="isLeft" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2405">`isLeft :: Either a b -⁠> Boolean`</a>

Returns `true` if the given Either is a Left; `false` if it is a Right.

```javascript
> S.isLeft (S.Left ('Cannot divide by zero'))
true

> S.isLeft (S.Right (42))
false
```

#### <a name="isRight" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2425">`isRight :: Either a b -⁠> Boolean`</a>

Returns `true` if the given Either is a Right; `false` if it is a Left.

```javascript
> S.isRight (S.Right (42))
true

> S.isRight (S.Left ('Cannot divide by zero'))
false
```

#### <a name="fromEither" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2445">`fromEither :: b -⁠> Either a b -⁠> b`</a>

Takes a default value and an Either, and returns the Right value
if the Either is a Right; the default value otherwise.

```javascript
> S.fromEither (0) (S.Right (42))
42

> S.fromEither (0) (S.Left (42))
0
```

#### <a name="toEither" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2466">`toEither :: a -⁠> b? -⁠> Either a b`</a>

Converts an arbitrary value to an Either: a Left if the value is `null`
or `undefined`; a Right otherwise. The first argument specifies the
value of the Left in the "failure" case.

```javascript
> S.toEither ('XYZ') (null)
Left ('XYZ')

> S.toEither ('XYZ') ('ABC')
Right ('ABC')

> S.map (S.prop ('0'))
.       (S.toEither ('Invalid protocol')
.                   ('ftp://example.com/'.match (/^https?:/)))
Left ('Invalid protocol')

> S.map (S.prop ('0'))
.       (S.toEither ('Invalid protocol')
.                   ('https://example.com/'.match (/^https?:/)))
Right ('https:')
```

#### <a name="either" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2500">`either :: (a -⁠> c) -⁠> (b -⁠> c) -⁠> Either a b -⁠> c`</a>

Takes two functions and an Either, and returns the result of
applying the first function to the Left's value, if the Either
is a Left, or the result of applying the second function to the
Right's value, if the Either is a Right.

```javascript
> S.either (S.toUpper) (S.show) (S.Left ('Cannot divide by zero'))
'CANNOT DIVIDE BY ZERO'

> S.either (S.toUpper) (S.show) (S.Right (42))
'42'
```

#### <a name="lefts" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2527">`lefts :: (Filterable f, Functor f) => f (Either a b) -⁠> f a`</a>

Discards each element which is a Right, and unwraps each element which is
a Left.

See also [`rights`](#rights).

```javascript
> S.lefts ([S.Right (20), S.Left ('foo'), S.Right (10), S.Left ('bar')])
['foo', 'bar']
```

#### <a name="rights" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2544">`rights :: (Filterable f, Functor f) => f (Either a b) -⁠> f b`</a>

Discards each element which is a Left, and unwraps each element which is
a Right.

See also [`lefts`](#lefts).

```javascript
> S.rights ([S.Right (20), S.Left ('foo'), S.Right (10), S.Left ('bar')])
[20, 10]
```

#### <a name="tagBy" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2561">`tagBy :: (a -⁠> Boolean) -⁠> a -⁠> Either a a`</a>

Takes a predicate and a value, and returns a Right of the value if it
satisfies the predicate; a Left of the value otherwise.

```javascript
> S.tagBy (S.odd) (0)
Left (0)

> S.tagBy (S.odd) (1)
Right (1)
```

#### <a name="encaseEither" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2582">`encaseEither :: (Error -⁠> l) -⁠> (a -⁠> r) -⁠> a -⁠> Either l r`</a>

Takes two unary functions, `f` and `g`, the second of which may throw,
and a value `x` of any type. Applies `g` to `x` inside a `try` block.
If an exception is caught, the return value is a Left containing the
result of applying `f` to the caught Error object; otherwise the return
value is a Right containing the result of applying `g` to `x`.

See also [`encase`](#encase).

```javascript
> S.encaseEither (S.I) (JSON.parse) ('["foo","bar","baz"]')
Right (['foo', 'bar', 'baz'])

> S.encaseEither (S.I) (JSON.parse) ('[')
Left (new SyntaxError ('Unexpected end of JSON input'))

> S.encaseEither (S.prop ('message')) (JSON.parse) ('[')
Left ('Unexpected end of JSON input')
```

#### <a name="encaseEither2" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2619">`encaseEither2 :: (Error -⁠> l) -⁠> (a -⁠> b -⁠> r) -⁠> a -⁠> b -⁠> Either l r`</a>

Binary version of [`encaseEither`](#encaseEither).

#### <a name="encaseEither3" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2641">`encaseEither3 :: (Error -⁠> l) -⁠> (a -⁠> b -⁠> c -⁠> r) -⁠> a -⁠> b -⁠> c -⁠> Either l r`</a>

Ternary version of [`encaseEither`](#encaseEither).

#### <a name="eitherToMaybe" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2670">`eitherToMaybe :: Either a b -⁠> Maybe b`</a>

Converts an Either to a Maybe. A Left becomes Nothing; a Right becomes
a Just.

See also [`maybeToEither`](#maybeToEither).

```javascript
> S.eitherToMaybe (S.Left ('Cannot divide by zero'))
Nothing

> S.eitherToMaybe (S.Right (42))
Just (42)
```

### Logic

#### <a name="and" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2695">`and :: Boolean -⁠> Boolean -⁠> Boolean`</a>

Boolean "and".

```javascript
> S.and (false) (false)
false

> S.and (false) (true)
false

> S.and (true) (false)
false

> S.and (true) (true)
true
```

#### <a name="or" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2723">`or :: Boolean -⁠> Boolean -⁠> Boolean`</a>

Boolean "or".

```javascript
> S.or (false) (false)
false

> S.or (false) (true)
true

> S.or (true) (false)
true

> S.or (true) (true)
true
```

#### <a name="not" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2751">`not :: Boolean -⁠> Boolean`</a>

Boolean "not".

See also [`complement`](#complement).

```javascript
> S.not (false)
true

> S.not (true)
false
```

#### <a name="complement" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2773">`complement :: (a -⁠> Boolean) -⁠> a -⁠> Boolean`</a>

Takes a unary predicate and a value of any type, and returns the logical
negation of applying the predicate to the value.

See also [`not`](#not).

```javascript
> Number.isInteger (42)
true

> S.complement (Number.isInteger) (42)
false
```

#### <a name="boolean" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2793">`boolean :: a -⁠> a -⁠> Boolean -⁠> a`</a>

Case analysis for the `Boolean` type. `boolean (x) (y) (b)` evaluates
to `x` if `b` is `false`; to `y` if `b` is `true`.

```javascript
> S.boolean ('no') ('yes') (false)
'no'

> S.boolean ('no') ('yes') (true)
'yes'
```

#### <a name="ifElse" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2818">`ifElse :: (a -⁠> Boolean) -⁠> (a -⁠> b) -⁠> (a -⁠> b) -⁠> a -⁠> b`</a>

Takes a unary predicate, a unary "if" function, a unary "else"
function, and a value of any type, and returns the result of
applying the "if" function to the value if the value satisfies
the predicate; the result of applying the "else" function to the
value otherwise.

See also [`when`](#when) and [`unless`](#unless).

```javascript
> S.ifElse (x => x < 0) (Math.abs) (Math.sqrt) (-1)
1

> S.ifElse (x => x < 0) (Math.abs) (Math.sqrt) (16)
4
```

#### <a name="when" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2850">`when :: (a -⁠> Boolean) -⁠> (a -⁠> a) -⁠> a -⁠> a`</a>

Takes a unary predicate, a unary function, and a value of any type, and
returns the result of applying the function to the value if the value
satisfies the predicate; the value otherwise.

See also [`unless`](#unless) and [`ifElse`](#ifElse).

```javascript
> S.when (x => x >= 0) (Math.sqrt) (16)
4

> S.when (x => x >= 0) (Math.sqrt) (-1)
-1
```

#### <a name="unless" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2874">`unless :: (a -⁠> Boolean) -⁠> (a -⁠> a) -⁠> a -⁠> a`</a>

Takes a unary predicate, a unary function, and a value of any type, and
returns the result of applying the function to the value if the value
does not satisfy the predicate; the value otherwise.

See also [`when`](#when) and [`ifElse`](#ifElse).

```javascript
> S.unless (x => x < 0) (Math.sqrt) (16)
4

> S.unless (x => x < 0) (Math.sqrt) (-1)
-1
```

#### <a name="allPass" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2898">`allPass :: Foldable f => f (a -⁠> Boolean) -⁠> a -⁠> Boolean`</a>

Takes a structure containing zero or more predicates, and a value
of any type. Returns `true` [iff][] the value satisfies all of the
predicates. None of the subsequent predicates will be applied after
the first predicate not satisfied.

```javascript
> S.allPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('quiessence')
true

> S.allPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('fissiparous')
false
```

#### <a name="anyPass" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2923">`anyPass :: Foldable f => f (a -⁠> Boolean) -⁠> a -⁠> Boolean`</a>

Takes a structure containing zero or more predicates, and a value
of any type. Returns `true` [iff][] the value satisfies any of the
predicates. None of the subsequent predicates will be applied after
the first predicate satisfied.

```javascript
> S.anyPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('incandescent')
true

> S.anyPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('empathy')
false
```

### Array

#### <a name="array" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2950">`array :: b -⁠> (a -⁠> Array a -⁠> b) -⁠> Array a -⁠> b`</a>

Case analysis for the `Array a` type.

```javascript
> S.array (S.Nothing) (head => tail => S.Just (head)) ([])
Nothing

> S.array (S.Nothing) (head => tail => S.Just (head)) ([1, 2, 3])
Just (1)

> S.array (S.Nothing) (head => tail => S.Just (tail)) ([])
Nothing

> S.array (S.Nothing) (head => tail => S.Just (tail)) ([1, 2, 3])
Just ([2, 3])
```

#### <a name="slice" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L2980">`slice :: Integer -⁠> Integer -⁠> Array a -⁠> Maybe (Array a)`</a>

Takes a start index `i`, an end index `j`, and an array, and returns
Just the `[i,j)` slice of the array if possible; Nothing otherwise.
A negative index represents an offset from the length of the array.

See also [`take`](#take), [`drop`](#drop), [`takeLast`](#takeLast),
and [`dropLast`](#dropLast).

```javascript
> S.slice (1) (3) (['a', 'b', 'c', 'd', 'e'])
Just (['b', 'c'])

> S.slice (-3) (-1) (['a', 'b', 'c', 'd', 'e'])
Just (['c', 'd'])

> S.slice (1) (6) (['a', 'b', 'c', 'd', 'e'])
Nothing
```

#### <a name="at" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3019">`at :: Integer -⁠> Array a -⁠> Maybe a`</a>

Returns Just the element of the given array at the specified index if
the index is within the array's bounds; Nothing otherwise. A negative
index represents an offset from the length of the array.

```javascript
> S.at (2) (['a', 'b', 'c', 'd', 'e'])
Just ('c')

> S.at (5) (['a', 'b', 'c', 'd', 'e'])
Nothing

> S.at (-2) (['a', 'b', 'c', 'd', 'e'])
Just ('d')
```

#### <a name="head" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3047">`head :: Array a -⁠> Maybe a`</a>

Returns Just the first element of the given array if the array contains
at least one element; Nothing otherwise.

```javascript
> S.head ([1, 2, 3])
Just (1)

> S.head ([])
Nothing
```

#### <a name="last" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3065">`last :: Array a -⁠> Maybe a`</a>

Returns Just the last element of the given array if the array contains
at least one element; Nothing otherwise.

```javascript
> S.last ([1, 2, 3])
Just (3)

> S.last ([])
Nothing
```

#### <a name="tail" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3086">`tail :: Array a -⁠> Maybe (Array a)`</a>

Returns Just all but the first of the given array's elements if the
array contains at least one element; Nothing otherwise.

```javascript
> S.tail ([1, 2, 3])
Just ([2, 3])

> S.tail ([])
Nothing
```

#### <a name="init" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3104">`init :: Array a -⁠> Maybe (Array a)`</a>

Returns Just all but the last of the given array's elements if the
array contains at least one element; Nothing otherwise.

```javascript
> S.init ([1, 2, 3])
Just ([1, 2])

> S.init ([])
Nothing
```

#### <a name="take" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3125">`take :: Integer -⁠> Array a -⁠> Maybe (Array a)`</a>

Returns Just the first N elements of the given array if N is greater
than or equal to zero and less than or equal to the length of the array;
Nothing otherwise.

```javascript
> S.take (2) (['a', 'b', 'c', 'd', 'e'])
Just (['a', 'b'])

> S.take (5) (['a', 'b', 'c', 'd', 'e'])
Just (['a', 'b', 'c', 'd', 'e'])

> S.take (6) (['a', 'b', 'c', 'd', 'e'])
Nothing
```

#### <a name="takeLast" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3152">`takeLast :: Integer -⁠> Array a -⁠> Maybe (Array a)`</a>

Returns Just the last N elements of the given array if N is greater
than or equal to zero and less than or equal to the length of the array;
Nothing otherwise.

```javascript
> S.takeLast (2) (['a', 'b', 'c', 'd', 'e'])
Just (['d', 'e'])

> S.takeLast (5) (['a', 'b', 'c', 'd', 'e'])
Just (['a', 'b', 'c', 'd', 'e'])

> S.takeLast (6) (['a', 'b', 'c', 'd', 'e'])
Nothing
```

#### <a name="drop" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3180">`drop :: Integer -⁠> Array a -⁠> Maybe (Array a)`</a>

Returns Just all but the first N elements of the given array if N is
greater than or equal to zero and less than or equal to the length of
the array; Nothing otherwise.

```javascript
> S.drop (2) (['a', 'b', 'c', 'd', 'e'])
Just (['c', 'd', 'e'])

> S.drop (5) (['a', 'b', 'c', 'd', 'e'])
Just ([])

> S.drop (6) (['a', 'b', 'c', 'd', 'e'])
Nothing
```

#### <a name="dropLast" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3207">`dropLast :: Integer -⁠> Array a -⁠> Maybe (Array a)`</a>

Returns Just all but the last N elements of the given array if N is
greater than or equal to zero and less than or equal to the length of
the array; Nothing otherwise.

```javascript
> S.dropLast (2) (['a', 'b', 'c', 'd', 'e'])
Just (['a', 'b', 'c'])

> S.dropLast (5) (['a', 'b', 'c', 'd', 'e'])
Just ([])

> S.dropLast (6) (['a', 'b', 'c', 'd', 'e'])
Nothing
```

#### <a name="size" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3235">`size :: Foldable f => f a -⁠> Integer`</a>

Returns the number of elements of the given structure.

```javascript
> S.size ([])
0

> S.size (['foo', 'bar', 'baz'])
3

> S.size (Nil)
0

> S.size (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))
3

> S.size (S.Nothing)
0

> S.size (S.Just ('quux'))
1

> S.size (S.Pair ('ignored!') ('counted!'))
1
```

#### <a name="all" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3267">`all :: Foldable f => (a -⁠> Boolean) -⁠> f a -⁠> Boolean`</a>

Returns `true` [iff][] all the elements of the structure satisfy the
predicate.

See also [`any`](#any) and [`none`](#none).

```javascript
> S.all (S.odd) ([])
true

> S.all (S.odd) ([1, 3, 5])
true

> S.all (S.odd) ([1, 2, 3])
false
```

#### <a name="any" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3290">`any :: Foldable f => (a -⁠> Boolean) -⁠> f a -⁠> Boolean`</a>

Returns `true` [iff][] any element of the structure satisfies the
predicate.

See also [`all`](#all) and [`none`](#none).

```javascript
> S.any (S.odd) ([])
false

> S.any (S.odd) ([2, 4, 6])
false

> S.any (S.odd) ([1, 2, 3])
true
```

#### <a name="none" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3313">`none :: Foldable f => (a -⁠> Boolean) -⁠> f a -⁠> Boolean`</a>

Returns `true` [iff][] none of the elements of the structure satisfies
the predicate.

Properties:

  - `forall p :: a -> Boolean, xs :: Foldable f => f a.
     S.none (p) (xs) = S.not (S.any (p) (xs))`

  - `forall p :: a -> Boolean, xs :: Foldable f => f a.
     S.none (p) (xs) = S.all (S.complement (p)) (xs)`

See also [`all`](#all) and [`any`](#any).

```javascript
> S.none (S.odd) ([])
true

> S.none (S.odd) ([2, 4, 6])
true

> S.none (S.odd) ([1, 2, 3])
false
```

#### <a name="append" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3344">`append :: (Applicative f, Semigroup (f a)) => a -⁠> f a -⁠> f a`</a>

Returns the result of appending the first argument to the second.

See also [`prepend`](#prepend).

```javascript
> S.append (3) ([1, 2])
[1, 2, 3]

> S.append (3) (Cons (1) (Cons (2) (Nil)))
Cons (1) (Cons (2) (Cons (3) (Nil)))

> S.append ([1]) (S.Nothing)
Just ([1])

> S.append ([3]) (S.Just ([1, 2]))
Just ([1, 2, 3])
```

#### <a name="prepend" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3369">`prepend :: (Applicative f, Semigroup (f a)) => a -⁠> f a -⁠> f a`</a>

Returns the result of prepending the first argument to the second.

See also [`append`](#append).

```javascript
> S.prepend (1) ([2, 3])
[1, 2, 3]

> S.prepend (1) (Cons (2) (Cons (3) (Nil)))
Cons (1) (Cons (2) (Cons (3) (Nil)))

> S.prepend ([1]) (S.Nothing)
Just ([1])

> S.prepend ([1]) (S.Just ([2, 3]))
Just ([1, 2, 3])
```

#### <a name="joinWith" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3394">`joinWith :: String -⁠> Array String -⁠> String`</a>

Joins the strings of the second argument separated by the first argument.

Properties:

  - `forall s :: String, t :: String.
     S.joinWith (s) (S.splitOn (s) (t)) = t`

See also [`splitOn`](#splitOn).

```javascript
> S.joinWith (':') (['foo', 'bar', 'baz'])
'foo:bar:baz'
```

#### <a name="elem" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3415">`elem :: (Setoid a, Foldable f) => a -⁠> f a -⁠> Boolean`</a>

Takes a value and a structure and returns `true` [iff][] the value is an
element of the structure.

See also [`find`](#find).

```javascript
> S.elem ('c') (['a', 'b', 'c'])
true

> S.elem ('x') (['a', 'b', 'c'])
false

> S.elem (3) ({x: 1, y: 2, z: 3})
true

> S.elem (8) ({x: 1, y: 2, z: 3})
false

> S.elem (0) (S.Just (0))
true

> S.elem (0) (S.Just (1))
false

> S.elem (0) (S.Nothing)
false
```

#### <a name="find" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3450">`find :: Foldable f => (a -⁠> Boolean) -⁠> f a -⁠> Maybe a`</a>

Takes a predicate and a structure and returns Just the leftmost element
of the structure which satisfies the predicate; Nothing if there is no
such element.

See also [`elem`](#elem).

```javascript
> S.find (S.lt (0)) ([1, -2, 3, -4, 5])
Just (-2)

> S.find (S.lt (0)) ([1, 2, 3, 4, 5])
Nothing
```

#### <a name="foldMap" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3482">`foldMap :: (Monoid m, Foldable f) => TypeRep m -⁠> (a -⁠> m) -⁠> f a -⁠> m`</a>

Curried version of [`Z.foldMap`][]. Deconstructs a foldable by mapping
every element to a monoid and concatenating the results.

```javascript
> S.foldMap (String) (f => f.name) ([Math.sin, Math.cos, Math.tan])
'sincostan'

> S.foldMap (Array) (x => [x + 1, x + 2]) ([10, 20, 30])
[11, 12, 21, 22, 31, 32]
```

#### <a name="unfoldr" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3500">`unfoldr :: (b -⁠> Maybe (Pair a b)) -⁠> b -⁠> Array a`</a>

Takes a function and a seed value, and returns an array generated by
applying the function repeatedly. The array is initially empty. The
function is initially applied to the seed value. Each application
of the function should result in either:

  - Nothing, in which case the array is returned; or

  - Just a pair, in which case the first element is appended to
    the array and the function is applied to the second element.

```javascript
> S.unfoldr (n => n < 1000 ? S.Just (S.Pair (n) (2 * n)) : S.Nothing) (1)
[1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
```

#### <a name="range" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3531">`range :: Integer -⁠> Integer -⁠> Array Integer`</a>

Returns an array of consecutive integers starting with the first argument
and ending with the second argument minus one. Returns `[]` if the second
argument is less than or equal to the first argument.

```javascript
> S.range (0) (10)
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

> S.range (-5) (0)
[-5, -4, -3, -2, -1]

> S.range (0) (-5)
[]
```

#### <a name="groupBy" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3560">`groupBy :: (a -⁠> a -⁠> Boolean) -⁠> Array a -⁠> Array (Array a)`</a>

Splits its array argument into an array of arrays of equal,
adjacent elements. Equality is determined by the function
provided as the first argument. Its behaviour can be surprising
for functions that aren't reflexive, transitive, and symmetric
(see [equivalence][] relation).

Properties:

  - `forall f :: a -> a -> Boolean, xs :: Array a.
     S.join (S.groupBy (f) (xs)) = xs`

```javascript
> S.groupBy (S.equals) ([1, 1, 2, 1, 1])
[[1, 1], [2], [1, 1]]

> S.groupBy (x => y => x + y === 0) ([2, -3, 3, 3, 3, 4, -4, 4])
[[2], [-3, 3, 3, 3], [4, -4], [4]]
```

#### <a name="reverse" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3599">`reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -⁠> f a`</a>

Reverses the elements of the given structure.

```javascript
> S.reverse ([1, 2, 3])
[3, 2, 1]

> S.reverse (Cons (1) (Cons (2) (Cons (3) (Nil))))
Cons (3) (Cons (2) (Cons (1) (Nil)))

> S.pipe ([S.splitOn (''), S.reverse, S.joinWith ('')]) ('abc')
'cba'
```

#### <a name="sort" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3619">`sort :: (Ord a, Applicative m, Foldable m, Monoid (m a)) => m a -⁠> m a`</a>

Performs a [stable sort][] of the elements of the given structure, using
[`Z.lte`][] for comparisons.

Properties:

  - `S.sort (S.sort (m)) = S.sort (m)` (idempotence)

See also [`sortBy`](#sortBy).

```javascript
> S.sort (['foo', 'bar', 'baz'])
['bar', 'baz', 'foo']

> S.sort ([S.Left (4), S.Right (3), S.Left (2), S.Right (1)])
[Left (2), Left (4), Right (1), Right (3)]
```

#### <a name="sortBy" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3643">`sortBy :: (Ord b, Applicative m, Foldable m, Monoid (m a)) => (a -⁠> b) -⁠> m a -⁠> m a`</a>

Performs a [stable sort][] of the elements of the given structure, using
[`Z.lte`][] to compare the values produced by applying the given function
to each element of the structure.

Properties:

  - `S.sortBy (f) (S.sortBy (f) (m)) = S.sortBy (f) (m)` (idempotence)

See also [`sort`](#sort).

```javascript
> S.sortBy (S.prop ('rank')) ([
.   {rank: 7, suit: 'spades'},
.   {rank: 5, suit: 'hearts'},
.   {rank: 2, suit: 'hearts'},
.   {rank: 5, suit: 'spades'},
. ])
[ {rank: 2, suit: 'hearts'},
. {rank: 5, suit: 'hearts'},
. {rank: 5, suit: 'spades'},
. {rank: 7, suit: 'spades'} ]

> S.sortBy (S.prop ('suit')) ([
.   {rank: 7, suit: 'spades'},
.   {rank: 5, suit: 'hearts'},
.   {rank: 2, suit: 'hearts'},
.   {rank: 5, suit: 'spades'},
. ])
[ {rank: 5, suit: 'hearts'},
. {rank: 2, suit: 'hearts'},
. {rank: 7, suit: 'spades'},
. {rank: 5, suit: 'spades'} ]
```

If descending order is desired, one may use [`Descending`][]:

```javascript
> S.sortBy (Descending) ([83, 97, 110, 99, 116, 117, 97, 114, 121])
[121, 117, 116, 114, 110, 99, 97, 97, 83]
```

#### <a name="zip" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3691">`zip :: Array a -⁠> Array b -⁠> Array (Pair a b)`</a>

Returns an array of pairs of corresponding elements from the given
arrays. The length of the resulting array is equal to the length of
the shorter input array.

See also [`zipWith`](#zipWith).

```javascript
> S.zip (['a', 'b']) (['x', 'y', 'z'])
[Pair ('a') ('x'), Pair ('b') ('y')]

> S.zip ([1, 3, 5]) ([2, 4])
[Pair (1) (2), Pair (3) (4)]
```

#### <a name="zipWith" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3712">`zipWith :: (a -⁠> b -⁠> c) -⁠> Array a -⁠> Array b -⁠> Array c`</a>

Returns the result of combining, pairwise, the given arrays using the
given binary function. The length of the resulting array is equal to the
length of the shorter input array.

See also [`zip`](#zip).

```javascript
> S.zipWith (a => b => a + b) (['a', 'b']) (['x', 'y', 'z'])
['ax', 'by']

> S.zipWith (a => b => [a, b]) ([1, 3, 5]) ([2, 4])
[[1, 2], [3, 4]]
```

### Object

#### <a name="prop" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3747">`prop :: String -⁠> a -⁠> b`</a>

Takes a property name and an object with known properties and returns
the value of the specified property. If for some reason the object
lacks the specified property, a type error is thrown.

For accessing properties of uncertain objects, use [`get`](#get) instead.

```javascript
> S.prop ('a') ({a: 1, b: 2})
1
```

#### <a name="props" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3773">`props :: Array String -⁠> a -⁠> b`</a>

Takes a property path (an array of property names) and an object with
known structure and returns the value at the given path. If for some
reason the path does not exist, a type error is thrown.

For accessing property paths of uncertain objects, use [`gets`](#gets)
instead.

```javascript
> S.props (['a', 'b', 'c']) ({a: {b: {c: 1}}})
1
```

#### <a name="get" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3802">`get :: (Any -⁠> Boolean) -⁠> String -⁠> a -⁠> Maybe b`</a>

Takes a predicate, a property name, and an object and returns Just the
value of the specified object property if it exists and the value
satisfies the given predicate; Nothing otherwise.

See also [`gets`](#gets) and [`prop`](#prop).

```javascript
> S.get (S.is ($.Number)) ('x') ({x: 1, y: 2})
Just (1)

> S.get (S.is ($.Number)) ('x') ({x: '1', y: '2'})
Nothing

> S.get (S.is ($.Number)) ('x') ({})
Nothing

> S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, 3]})
Just ([1, 2, 3])

> S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, 3, null]})
Nothing
```

#### <a name="gets" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3835">`gets :: (Any -⁠> Boolean) -⁠> Array String -⁠> a -⁠> Maybe b`</a>

Takes a predicate, a property path (an array of property names), and
an object and returns Just the value at the given path if such a path
exists and the value satisfies the given predicate; Nothing otherwise.

See also [`get`](#get).

```javascript
> S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({a: {b: {c: 42}}})
Just (42)

> S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({a: {b: {c: '42'}}})
Nothing

> S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({})
Nothing
```

### StrMap

StrMap is an abbreviation of _string map_. A string map is an object,
such as `{foo: 1, bar: 2, baz: 3}`, whose values are all members of
the same type. Formally, a value is a member of type `StrMap a` if its
[type identifier][] is `'Object'` and the values of its enumerable own
properties are all members of type `a`.

#### <a name="singleton" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3876">`singleton :: String -⁠> a -⁠> StrMap a`</a>

Takes a string and a value of any type, and returns a string map with
a single entry (mapping the key to the value).

```javascript
> S.singleton ('foo') (42)
{foo: 42}
```

#### <a name="insert" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3898">`insert :: String -⁠> a -⁠> StrMap a -⁠> StrMap a`</a>

Takes a string, a value of any type, and a string map, and returns a
string map comprising all the entries of the given string map plus the
entry specified by the first two arguments (which takes precedence).

Equivalent to Haskell's `insert` function. Similar to Clojure's `assoc`
function.

```javascript
> S.insert ('c') (3) ({a: 1, b: 2})
{a: 1, b: 2, c: 3}

> S.insert ('a') (4) ({a: 1, b: 2})
{a: 4, b: 2}
```

#### <a name="remove" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3927">`remove :: String -⁠> StrMap a -⁠> StrMap a`</a>

Takes a string and a string map, and returns a string map comprising all
the entries of the given string map except the one whose key matches the
given string (if such a key exists).

Equivalent to Haskell's `delete` function. Similar to Clojure's `dissoc`
function.

```javascript
> S.remove ('c') ({a: 1, b: 2, c: 3})
{a: 1, b: 2}

> S.remove ('c') ({})
{}
```

#### <a name="keys" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3956">`keys :: StrMap a -⁠> Array String`</a>

Returns the keys of the given string map, in arbitrary order.

```javascript
> S.sort (S.keys ({b: 2, c: 3, a: 1}))
['a', 'b', 'c']
```

#### <a name="values" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3970">`values :: StrMap a -⁠> Array a`</a>

Returns the values of the given string map, in arbitrary order.

```javascript
> S.sort (S.values ({a: 1, c: 3, b: 2}))
[1, 2, 3]
```

#### <a name="pairs" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L3987">`pairs :: StrMap a -⁠> Array (Pair String a)`</a>

Returns the key–value pairs of the given string map, in arbitrary order.

```javascript
> S.sort (S.pairs ({b: 2, a: 1, c: 3}))
[Pair ('a') (1), Pair ('b') (2), Pair ('c') (3)]
```

#### <a name="fromPairs" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4005">`fromPairs :: Foldable f => f (Pair String a) -⁠> StrMap a`</a>

Returns a string map containing the key–value pairs specified by the
given [Foldable][]. If a key appears in multiple pairs, the rightmost
pair takes precedence.

```javascript
> S.fromPairs ([S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)])
{a: 1, b: 2, c: 3}

> S.fromPairs ([S.Pair ('x') (1), S.Pair ('x') (2)])
{x: 2}
```

### Number

#### <a name="negate" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4032">`negate :: ValidNumber -⁠> ValidNumber`</a>

Negates its argument.

```javascript
> S.negate (12.5)
-12.5

> S.negate (-42)
42
```

#### <a name="add" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4052">`add :: FiniteNumber -⁠> FiniteNumber -⁠> FiniteNumber`</a>

Returns the sum of two (finite) numbers.

```javascript
> S.add (1) (1)
2
```

#### <a name="sum" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4071">`sum :: Foldable f => f FiniteNumber -⁠> FiniteNumber`</a>

Returns the sum of the given array of (finite) numbers.

```javascript
> S.sum ([1, 2, 3, 4, 5])
15

> S.sum ([])
0

> S.sum (S.Just (42))
42

> S.sum (S.Nothing)
0
```

#### <a name="sub" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4094">`sub :: FiniteNumber -⁠> FiniteNumber -⁠> FiniteNumber`</a>

Takes a finite number `n` and returns the _subtract `n`_ function.

```javascript
> S.map (S.sub (1)) ([1, 2, 3])
[0, 1, 2]
```

#### <a name="mult" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4113">`mult :: FiniteNumber -⁠> FiniteNumber -⁠> FiniteNumber`</a>

Returns the product of two (finite) numbers.

```javascript
> S.mult (4) (2)
8
```

#### <a name="product" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4132">`product :: Foldable f => f FiniteNumber -⁠> FiniteNumber`</a>

Returns the product of the given array of (finite) numbers.

```javascript
> S.product ([1, 2, 3, 4, 5])
120

> S.product ([])
1

> S.product (S.Just (42))
42

> S.product (S.Nothing)
1
```

#### <a name="div" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4155">`div :: NonZeroFiniteNumber -⁠> FiniteNumber -⁠> FiniteNumber`</a>

Takes a non-zero finite number `n` and returns the _divide by `n`_
function.

```javascript
> S.map (S.div (2)) ([0, 1, 2, 3])
[0, 0.5, 1, 1.5]
```

#### <a name="pow" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4175">`pow :: FiniteNumber -⁠> FiniteNumber -⁠> FiniteNumber`</a>

Takes a finite number `n` and returns the _power of `n`_ function.

```javascript
> S.map (S.pow (2)) ([-3, -2, -1, 0, 1, 2, 3])
[9, 4, 1, 0, 1, 4, 9]

> S.map (S.pow (0.5)) ([1, 4, 9, 16, 25])
[1, 2, 3, 4, 5]
```

#### <a name="mean" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4197">`mean :: Foldable f => f FiniteNumber -⁠> Maybe FiniteNumber`</a>

Returns the mean of the given array of (finite) numbers.

```javascript
> S.mean ([1, 2, 3, 4, 5])
Just (3)

> S.mean ([])
Nothing

> S.mean (S.Just (42))
Just (42)

> S.mean (S.Nothing)
Nothing
```

### Integer

#### <a name="even" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4234">`even :: Integer -⁠> Boolean`</a>

Returns `true` if the given integer is even; `false` if it is odd.

```javascript
> S.even (42)
true

> S.even (99)
false
```

#### <a name="odd" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4254">`odd :: Integer -⁠> Boolean`</a>

Returns `true` if the given integer is odd; `false` if it is even.

```javascript
> S.odd (99)
true

> S.odd (42)
false
```

### Parse

#### <a name="parseDate" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4276">`parseDate :: String -⁠> Maybe ValidDate`</a>

Takes a string `s` and returns `Just (new Date (s))` if `new Date (s)`
evaluates to a [`ValidDate`][ValidDate] value; Nothing otherwise.

As noted in [#488][], this function's behaviour is unspecified for some
inputs! [MDN][date parsing] warns against using the `Date` constructor
to parse date strings:

> __Note:__ parsing of date strings with the `Date` constructor \[…] is
> strongly discouraged due to browser differences and inconsistencies.
> Support for RFC 2822 format strings is by convention only. Support for
> ISO 8601 formats differs in that date-only strings (e.g. "1970-01-01")
> are treated as UTC, not local.

```javascript
> S.parseDate ('2011-01-19T17:40:00Z')
Just (new Date ('2011-01-19T17:40:00.000Z'))

> S.parseDate ('today')
Nothing
```

#### <a name="parseFloat" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4342">`parseFloat :: String -⁠> Maybe Number`</a>

Takes a string and returns Just the number represented by the string
if it does in fact represent a number; Nothing otherwise.

```javascript
> S.parseFloat ('-123.45')
Just (-123.45)

> S.parseFloat ('foo.bar')
Nothing
```

#### <a name="parseInt" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4369">`parseInt :: Radix -⁠> String -⁠> Maybe Integer`</a>

Takes a radix (an integer between 2 and 36 inclusive) and a string,
and returns Just the number represented by the string if it does in
fact represent a number in the base specified by the radix; Nothing
otherwise.

This function is stricter than [`parseInt`][parseInt]: a string
is considered to represent an integer only if all its non-prefix
characters are members of the character set specified by the radix.

```javascript
> S.parseInt (10) ('-42')
Just (-42)

> S.parseInt (16) ('0xFF')
Just (255)

> S.parseInt (16) ('0xGG')
Nothing
```

#### <a name="parseJson" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4409">`parseJson :: (Any -⁠> Boolean) -⁠> String -⁠> Maybe a`</a>

Takes a predicate and a string which may or may not be valid JSON, and
returns Just the result of applying `JSON.parse` to the string *if* the
result satisfies the predicate; Nothing otherwise.

```javascript
> S.parseJson (S.is ($.Array ($.Integer))) ('[')
Nothing

> S.parseJson (S.is ($.Array ($.Integer))) ('["1","2","3"]')
Nothing

> S.parseJson (S.is ($.Array ($.Integer))) ('[0,1.5,3,4.5]')
Nothing

> S.parseJson (S.is ($.Array ($.Integer))) ('[1,2,3]')
Just ([1, 2, 3])
```

### RegExp

#### <a name="regex" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4458">`regex :: RegexFlags -⁠> String -⁠> RegExp`</a>

Takes a [RegexFlags][] and a pattern, and returns a RegExp.

```javascript
> S.regex ('g') (':\\d+:')
/:\d+:/g
```

#### <a name="regexEscape" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4477">`regexEscape :: String -⁠> String`</a>

Takes a string which may contain regular expression metacharacters,
and returns a string with those metacharacters escaped.

Properties:

  - `forall s :: String.
     S.test (S.regex ('') (S.regexEscape (s))) (s) = true`

```javascript
> S.regexEscape ('-=*{XYZ}*=-')
'\\-=\\*\\{XYZ\\}\\*=\\-'
```

#### <a name="test" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4500">`test :: RegExp -⁠> String -⁠> Boolean`</a>

Takes a pattern and a string, and returns `true` [iff][] the pattern
matches the string.

```javascript
> S.test (/^a/) ('abacus')
true

> S.test (/^a/) ('banana')
false
```

#### <a name="match" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4523">`match :: NonGlobalRegExp -⁠> String -⁠> Maybe { match :: String, groups :: Array (Maybe String) }`</a>

Takes a pattern and a string, and returns Just a match record if the
pattern matches the string; Nothing otherwise.

`groups :: Array (Maybe String)` acknowledges the existence of optional
capturing groups.

Properties:

  - `forall p :: Pattern, s :: String.
     S.head (S.matchAll (S.regex ('g') (p)) (s))
     = S.match (S.regex ('') (p)) (s)`

See also [`matchAll`](#matchAll).

```javascript
> S.match (/(good)?bye/) ('goodbye')
Just ({match: 'goodbye', groups: [Just ('good')]})

> S.match (/(good)?bye/) ('bye')
Just ({match: 'bye', groups: [Nothing]})
```

#### <a name="matchAll" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4557">`matchAll :: GlobalRegExp -⁠> String -⁠> Array { match :: String, groups :: Array (Maybe String) }`</a>

Takes a pattern and a string, and returns an array of match records.

`groups :: Array (Maybe String)` acknowledges the existence of optional
capturing groups.

See also [`match`](#match).

```javascript
> S.matchAll (/@([a-z]+)/g) ('Hello, world!')
[]

> S.matchAll (/@([a-z]+)/g) ('Hello, @foo! Hello, @bar! Hello, @baz!')
[ {match: '@foo', groups: [Just ('foo')]},
. {match: '@bar', groups: [Just ('bar')]},
. {match: '@baz', groups: [Just ('baz')]} ]
```

### String

#### <a name="toUpper" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4594">`toUpper :: String -⁠> String`</a>

Returns the upper-case equivalent of its argument.

See also [`toLower`](#toLower).

```javascript
> S.toUpper ('ABC def 123')
'ABC DEF 123'
```

#### <a name="toLower" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4610">`toLower :: String -⁠> String`</a>

Returns the lower-case equivalent of its argument.

See also [`toUpper`](#toUpper).

```javascript
> S.toLower ('ABC def 123')
'abc def 123'
```

#### <a name="trim" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4626">`trim :: String -⁠> String`</a>

Strips leading and trailing whitespace characters.

```javascript
> S.trim ('\t\t foo bar \n')
'foo bar'
```

#### <a name="stripPrefix" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4640">`stripPrefix :: String -⁠> String -⁠> Maybe String`</a>

Returns Just the portion of the given string (the second argument) left
after removing the given prefix (the first argument) if the string starts
with the prefix; Nothing otherwise.

See also [`stripSuffix`](#stripSuffix).

```javascript
> S.stripPrefix ('https://') ('https://sanctuary.js.org')
Just ('sanctuary.js.org')

> S.stripPrefix ('https://') ('http://sanctuary.js.org')
Nothing
```

#### <a name="stripSuffix" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4667">`stripSuffix :: String -⁠> String -⁠> Maybe String`</a>

Returns Just the portion of the given string (the second argument) left
after removing the given suffix (the first argument) if the string ends
with the suffix; Nothing otherwise.

See also [`stripPrefix`](#stripPrefix).

```javascript
> S.stripSuffix ('.md') ('README.md')
Just ('README')

> S.stripSuffix ('.md') ('README')
Nothing
```

#### <a name="words" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4694">`words :: String -⁠> Array String`</a>

Takes a string and returns the array of words the string contains
(words are delimited by whitespace characters).

See also [`unwords`](#unwords).

```javascript
> S.words (' foo bar baz ')
['foo', 'bar', 'baz']
```

#### <a name="unwords" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4717">`unwords :: Array String -⁠> String`</a>

Takes an array of words and returns the result of joining the words
with separating spaces.

See also [`words`](#words).

```javascript
> S.unwords (['foo', 'bar', 'baz'])
'foo bar baz'
```

#### <a name="lines" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4734">`lines :: String -⁠> Array String`</a>

Takes a string and returns the array of lines the string contains
(lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
The resulting strings do not contain newlines.

See also [`unlines`](#unlines).

```javascript
> S.lines ('foo\nbar\nbaz\n')
['foo', 'bar', 'baz']
```

#### <a name="unlines" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4756">`unlines :: Array String -⁠> String`</a>

Takes an array of lines and returns the result of joining the lines
after appending a terminating line feed (`'\n'`) to each.

See also [`lines`](#lines).

```javascript
> S.unlines (['foo', 'bar', 'baz'])
'foo\nbar\nbaz\n'
```

#### <a name="splitOn" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4776">`splitOn :: String -⁠> String -⁠> Array String`</a>

Returns the substrings of its second argument separated by occurrences
of its first argument.

See also [`joinWith`](#joinWith) and [`splitOnRegex`](#splitOnRegex).

```javascript
> S.splitOn ('::') ('foo::bar::baz')
['foo', 'bar', 'baz']
```

#### <a name="splitOnRegex" href="https://github.com/sanctuary-js/sanctuary/blob/v1.0.0/index.js#L4793">`splitOnRegex :: GlobalRegExp -⁠> String -⁠> Array String`</a>

Takes a pattern and a string, and returns the result of splitting the
string at every non-overlapping occurrence of the pattern.

Properties:

  - `forall s :: String, t :: String.
     S.joinWith (s)
                (S.splitOnRegex (S.regex ('g') (S.regexEscape (s))) (t))
     = t`

See also [`splitOn`](#splitOn).

```javascript
> S.splitOnRegex (/[,;][ ]*/g) ('foo, bar, baz')
['foo', 'bar', 'baz']

> S.splitOnRegex (/[,;][ ]*/g) ('foo;bar;baz')
['foo', 'bar', 'baz']
```

[#438]:                     https://github.com/sanctuary-js/sanctuary/issues/438
[#488]:                     https://github.com/sanctuary-js/sanctuary/issues/488
[Apply]:                    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#apply
[BinaryType]:               https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#BinaryType
[Chain]:                    https://github.com/fantasyland/fantasy-land/tree/v4.0.1#chain
[Either]:                   #either-type
[Fantasy Land]:             https://github.com/fantasyland/fantasy-land/tree/v4.0.1
[Foldable]:                 https://github.com/fantasyland/fantasy-land/tree/v4.0.1#foldable
[Folktale]:                 https://folktale.origamitower.com/
[GIGO]:                     https://en.wikipedia.org/wiki/Garbage_in,_garbage_out
[Haskell]:                  https://www.haskell.org/
[Kleisli]:                  https://en.wikipedia.org/wiki/Kleisli_category
[Maybe]:                    #maybe-type
[Nullable]:                 https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#Nullable
[PureScript]:               http://www.purescript.org/
[Ramda]:                    http://ramdajs.com/
[RegexFlags]:               https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#RegexFlags
[Semigroupoid]:             https://github.com/fantasyland/fantasy-land/tree/v4.0.1#semigroupoid
[UnaryType]:                https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#UnaryType
[ValidDate]:                https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#ValidDate
[`$.test`]:                 https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0#test
[`Descending`]:             https://github.com/sanctuary-js/sanctuary-descending/tree/v1.1.0#Descending
[`R.__`]:                   http://ramdajs.com/docs/#__
[`R.bind`]:                 http://ramdajs.com/docs/#bind
[`R.invoker`]:              http://ramdajs.com/docs/#invoker
[`Z.alt`]:                  https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#alt
[`Z.ap`]:                   https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#ap
[`Z.apFirst`]:              https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#apFirst
[`Z.apSecond`]:             https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#apSecond
[`Z.bimap`]:                https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#bimap
[`Z.chain`]:                https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#chain
[`Z.chainRec`]:             https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#chainRec
[`Z.compose`]:              https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#compose
[`Z.concat`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#concat
[`Z.contramap`]:            https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#contramap
[`Z.dropWhile`]:            https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#dropWhile
[`Z.duplicate`]:            https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#duplicate
[`Z.empty`]:                https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#empty
[`Z.equals`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#equals
[`Z.extend`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#extend
[`Z.extract`]:              https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#extract
[`Z.filter`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#filter
[`Z.flip`]:                 https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#flip
[`Z.foldMap`]:              https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#foldMap
[`Z.gt`]:                   https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#gt
[`Z.gte`]:                  https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#gte
[`Z.id`]:                   https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#id
[`Z.invert`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#invert
[`Z.join`]:                 https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#join
[`Z.lt`]:                   https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#lt
[`Z.lte`]:                  https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#lte
[`Z.map`]:                  https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#map
[`Z.mapLeft`]:              https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#mapLeft
[`Z.of`]:                   https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#of
[`Z.promap`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#promap
[`Z.reject`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#reject
[`Z.sequence`]:             https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#sequence
[`Z.takeWhile`]:            https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#takeWhile
[`Z.traverse`]:             https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#traverse
[`Z.zero`]:                 https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0#zero
[`show`]:                   https://github.com/sanctuary-js/sanctuary-show/tree/v1.0.0#show
[date parsing]:             https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[equivalence]:              https://en.wikipedia.org/wiki/Equivalence_relation
[iff]:                      https://en.wikipedia.org/wiki/If_and_only_if
[parseInt]:                 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
[partial functions]:        https://en.wikipedia.org/wiki/Partial_function
[ramda/ramda#683]:          https://github.com/ramda/ramda/issues/683
[ramda/ramda#1413]:         https://github.com/ramda/ramda/issues/1413
[ramda/ramda#1419]:         https://github.com/ramda/ramda/pull/1419
[sanctuary-def]:            https://github.com/sanctuary-js/sanctuary-def/tree/v0.19.0
[sanctuary-either]:         https://github.com/sanctuary-js/sanctuary-either/tree/v1.1.0
[sanctuary-maybe]:          https://github.com/sanctuary-js/sanctuary-maybe/tree/v1.1.0
[sanctuary-pair]:           https://github.com/sanctuary-js/sanctuary-pair/tree/v1.1.0
[sanctuary-show]:           https://github.com/sanctuary-js/sanctuary-show/tree/v1.0.0
[sanctuary-type-classes]:   https://github.com/sanctuary-js/sanctuary-type-classes/tree/v10.0.0
[stable sort]:              https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
[thrush]:                   https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
[total functions]:          https://en.wikipedia.org/wiki/Partial_function#Total_function
[type checking]:            #type-checking
[type identifier]:          https://github.com/sanctuary-js/sanctuary-type-identifiers/tree/v2.0.1
[type representative]:      https://github.com/fantasyland/fantasy-land/tree/v4.0.1#type-representatives
[variadic functions]:       https://en.wikipedia.org/wiki/Variadic_function
