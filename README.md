# Sanctuary

Sanctuary is a functional programming library inspired by Haskell and
PureScript. It depends on and works nicely with [Ramda][]. Sanctuary
makes it possible to write safe code without null checks.

In JavaScript it's trivial to introduce a possible run-time type error:

    words[0].toUpperCase()

If `words` is `[]` we'll get a familiar error at run-time:

    TypeError: Cannot read property 'toUpperCase' of undefined

Sanctuary gives us a fighting chance of avoiding such errors. We might
write:

    R.map(R.toUpper, S.head(words))

## Types

Sanctuary uses Haskell-like type signatures to describe the types of
values, including functions. `'foo'`, for example, has type `String`;
`[1, 2, 3]` has type `[Number]`. The arrow (`->`) is used to express a
function's type. `Math.abs`, for example, has type `Number -> Number`.
That is, it takes an argument of type `Number` and returns a value of
type `Number`.

[`R.map`][R.map] has type `(a -> b) -> [a] -> [b]`. That is, it takes
an argument of type `a -> b` and returns a value of type `[a] -> [b]`.
`a` and `b` are type variables: applying `R.map` to a value of type
`String -> Number` will give a value of type `[String] -> [Number]`.

Sanctuary embraces types. JavaScript doesn't support algebraic data types,
but these can be simulated by providing a group of constructor functions
whose prototypes provide the same set of methods. A value of the Maybe
type, for example, is created via the Nothing constructor or the Just
constructor.

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

### List pseudotype

The List pseudotype represents non-Function values with numeric `length`
properties greater than or equal to zero, such as `[1, 2, 3]` and `'foo'`.

### Type representatives

What is the type of `Number`? One answer is `a -> Number`, since it's a
function which takes an argument of any type and returns a Number value.
When provided as the first argument to [`is`](#is), though, `Number` is
really the value-level representative of the Number type.

Sanctuary uses the TypeRep pseudotype to describe type representatives.
For example:

    Number :: TypeRep Number

`Number` is the sole inhabitant of the TypeRep Number type.

## API

### Classify

<h4 name="is"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L305">is :: TypeRep a -> b -> Boolean</a></code></h4>

Takes a [type representative](#type-representatives) and a value of
any type and returns `true` if the given value is of the specified
type (either directly or via the prototype chain); `false` otherwise.

Boolean, number, string, and symbol [primitives][] are promoted to
their object equivalents. `42`, for example, is considered a Number
and an Object (whereas [`R.is`][R.is] considers it a Number but not
an Object).

```javascript
> S.is(Number, 42)
true

> S.is(Object, 42)
true

> S.is(String, 42)
false
```

### Combinator

<h4 name="I"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L330">I :: a -> a</a></code></h4>

The I combinator. Returns its argument. Equivalent to Haskell's `id`
function.

```javascript
> S.I('foo')
"foo"
```

<h4 name="K"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L341">K :: a -> b -> a</a></code></h4>

The K combinator. Takes two values and returns the first. Equivalent to
Haskell's `const` function.

```javascript
> S.K('foo', 'bar')
"foo"

> R.map(S.K(42), R.range(0, 5))
[42, 42, 42, 42, 42]
```

### Composition

<h4 name="compose"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L359">compose :: (b -> c) -> (a -> b) -> a -> c</a></code></h4>

Takes two functions assumed to be unary and a value of any type,
and returns the result of applying the first function to the result
of applying the second function to the given value.

In general terms, `compose` performs right-to-left composition of two
unary functions.

See also [`pipe`](#pipe).

```javascript
> S.compose(Math.sqrt, R.inc)(99)
10
```

<h4 name="pipe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L379">pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n</a></code></h4>

Takes a list of functions assumed to be unary and a value of any type,
and returns the result of applying the sequence of transformations to
the initial value.

In general terms, `pipe` performs left-to-right composition of a list
of functions. `pipe([f, g, h], x)` is equivalent to `h(g(f(x)))`.

See also [`meld`](#meld).

```javascript
> S.pipe([R.inc, Math.sqrt, R.dec])(99)
9
```

<h4 name="meld"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L398">meld :: [** -> *] -> (* -> * -> ... -> *)</a></code></h4>

Takes a list of non-nullary functions and returns a curried function
whose arity is one greater than the sum of the arities of the given
functions less the number of functions.

The behaviour of `meld` is best conveyed diagrammatically. The following
diagram depicts the "melding" of binary functions `f` and `g`:

              +-------+
    --- a --->|       |
              |   f   |                +-------+
    --- b --->|       |--- f(a, b) --->|       |
              +-------+                |   g   |
    --- c ---------------------------->|       |--- g(f(a, b), c) --->
                                       +-------+

See also [`pipe`](#pipe).

```javascript
> S.meld([Math.pow, R.subtract])(3, 4, 5)
76

> S.meld([Math.pow, R.subtract])(3)(4)(5)
76
```

### Maybe type

<h4 name="Maybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L436">Maybe :: TypeRep Maybe</a></code></h4>

The Maybe type represents optional values: a value of type `Maybe a` is
either a Just whose value is of type `a` or a Nothing (with no value).

The Maybe type satisfies the [Monoid][], [Monad][], [Foldable][], and
[Extend][] specifications.

<h4 name="Maybe.empty"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L447">Maybe.empty :: -> Maybe a</a></code></h4>

Returns a Nothing.

```javascript
> S.Maybe.empty()
Nothing()
```

<h4 name="Maybe.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L459">Maybe.of :: a -> Maybe a</a></code></h4>

Takes a value of any type and returns a Just with the given value.

```javascript
> S.Maybe.of(42)
Just(42)
```

<h4 name="Maybe.prototype.ap"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L471">Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b</a></code></h4>

Takes a value of type `Maybe a` and returns a Nothing unless `this`
is a Just *and* the argument is a Just, in which case it returns a
Just whose value is the result of of applying this Just's value to
the given Just's value.

```javascript
> S.Nothing().ap(S.Just(42))
Nothing()

> S.Just(R.inc).ap(S.Nothing())
Nothing()

> S.Just(R.inc).ap(S.Just(42))
Just(43)
```

<h4 name="Maybe.prototype.chain"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L489">Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b</a></code></h4>

Takes a function and returns `this` if `this` is a Nothing; otherwise
it returns the result of applying the function to this Just's value.

```javascript
> S.Nothing().chain(S.parseFloat)
Nothing()

> S.Just('xxx').chain(S.parseFloat)
Nothing()

> S.Just('12.34').chain(S.parseFloat)
Just(12.34)
```

<h4 name="Maybe.prototype.concat"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L505">Maybe#concat :: Maybe a ~> Maybe a -> Maybe a</a></code></h4>

Returns the result of concatenating two Maybe values of the same type.
`a` must have a [Semigroup][] (indicated by the presence of a `concat`
method).

If `this` is a Nothing and the argument is a Nothing, this method returns
a Nothing.

If `this` is a Just and the argument is a Just, this method returns a
Just whose value is the result of concatenating this Just's value and
the given Just's value.

Otherwise, this method returns the Just.

```javascript
> S.Nothing().concat(S.Nothing())
Nothing()

> S.Just([1, 2, 3]).concat(S.Just([4, 5, 6]))
Just([1, 2, 3, 4, 5, 6])

> S.Nothing().concat(S.Just([1, 2, 3]))
Just([1, 2, 3])

> S.Just([1, 2, 3]).concat(S.Nothing())
Just([1, 2, 3])
```

<h4 name="Maybe.prototype.empty"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L534">Maybe#empty :: Maybe a ~> Maybe a</a></code></h4>

Returns a Nothing.

```javascript
> S.Just(42).empty()
Nothing()
```

<h4 name="Maybe.prototype.equals"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L544">Maybe#equals :: Maybe a ~> b -> Boolean</a></code></h4>

Takes a value of any type and returns `true` if:

  - it is a Nothing and `this` is a Nothing; or

  - it is a Just and `this` is a Just, and their values are equal
    according to [`R.equals`][R.equals].

```javascript
> S.Nothing().equals(S.Nothing())
true

> S.Nothing().equals(null)
false

> S.Just([1, 2, 3]).equals(S.Just([1, 2, 3]))
true

> S.Just([1, 2, 3]).equals(S.Just([3, 2, 1]))
false

> S.Just([1, 2, 3]).equals(S.Nothing())
false
```

<h4 name="Maybe.prototype.extend"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L570">Maybe#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a</a></code></h4>

Takes a function and returns `this` if `this` is a Nothing; otherwise
it returns a Just whose value is the result of applying the function to
`this`.

```javascript
> S.Nothing().extend(function(x) { return x.value + 1; })
Nothing()

> S.Just(42).extend(function(x) { return x.value + 1; })
Just(43)
```

<h4 name="Maybe.prototype.filter"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L584">Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a</a></code></h4>

Takes a predicate and returns `this` if `this` is a Just whose value
satisfies the predicate; Nothing otherwise.

```javascript
> S.Just(42).filter(function(n) { return n % 2 === 0; })
Just(42)

> S.Just(43).filter(function(n) { return n % 2 === 0; })
Nothing()
```

<h4 name="Maybe.prototype.map"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L600">Maybe#map :: Maybe a ~> (a -> b) -> Maybe b</a></code></h4>

Takes a function and returns `this` if `this` is a Nothing; otherwise
it returns a Just whose value is the result of applying the function to
this Just's value.

```javascript
> S.Nothing().map(R.inc)
Nothing()

> S.Just([1, 2, 3]).map(R.sum)
Just(6)
```

<h4 name="Maybe.prototype.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L614">Maybe#of :: Maybe a ~> b -> Maybe b</a></code></h4>

Takes a value of any type and returns a Just with the given value.

```javascript
> S.Nothing().of(42)
Just(42)
```

<h4 name="Maybe.prototype.reduce"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L624">Maybe#reduce :: Maybe a ~> (b -> a -> b) -> b -> b</a></code></h4>

Takes a function and an initial value of any type, and returns:

  - the initial value if `this` is a Nothing; otherwise

  - the result of applying the function to the initial value and this
    Just's value.

```javascript
> S.Nothing().reduce(R.add, 10)
10

> S.Just(5).reduce(R.add, 10)
15
```

<h4 name="Maybe.prototype.toBoolean"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L641">Maybe#toBoolean :: Maybe a ~> Boolean</a></code></h4>

Returns `false` if `this` is a Nothing; `true` if `this` is a Just.

```javascript
> S.Nothing().toBoolean()
false

> S.Just(42).toBoolean()
true
```

<h4 name="Maybe.prototype.toString"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L653">Maybe#toString :: Maybe a ~> String</a></code></h4>

Returns the string representation of the Maybe.

```javascript
> S.Nothing().toString()
"Nothing()"

> S.Just([1, 2, 3]).toString()
"Just([1, 2, 3])"
```

<h4 name="Maybe.prototype.type"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L665">Maybe#type :: TypeRep Maybe</a></code></h4>

A reference to the Maybe type. Useful for determining whether two
values such as `S.Nothing()` and `S.Just(42)` are of the same type.

<h4 name="Nothing"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L671">Nothing :: -> Maybe a</a></code></h4>

Returns a Nothing. Though this is a constructor function the `new`
keyword needn't be used.

```javascript
> S.Nothing()
Nothing()
```

<h4 name="Just"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L721">Just :: a -> Maybe a</a></code></h4>

Takes a value of any type and returns a Just with the given value.
Though this is a constructor function the `new` keyword needn't be
used.

```javascript
> S.Just(42)
Just(42)
```

<h4 name="fromMaybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L787">fromMaybe :: a -> Maybe a -> a</a></code></h4>

Takes a default value and a Maybe, and returns the Maybe's value
if the Maybe is a Just; the default value otherwise.

```javascript
> S.fromMaybe(0, S.Just(42))
42

> S.fromMaybe(0, S.Nothing())
0
```

<h4 name="toMaybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L804">toMaybe :: a? -> Maybe a</a></code></h4>

Takes a value and returns Nothing if the value is null or undefined;
Just the value otherwise.

```javascript
> S.toMaybe(null)
Nothing()

> S.toMaybe(42)
Just(42)
```

<h4 name="maybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L819">maybe :: b -> (a -> b) -> Maybe a -> b</a></code></h4>

Takes a value of any type, a function, and a Maybe. If the Maybe is
a Just, the return value is the result of applying the function to
the Just's value. Otherwise, the first argument is returned.

```javascript
> S.maybe(0, R.length, S.Just('refuge'))
6

> S.maybe(0, R.length, S.Nothing())
0
```

<h4 name="catMaybes"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L837">catMaybes :: [Maybe a] -> [a]</a></code></h4>

Takes a list of Maybes and returns a list containing each Just's value.

```javascript
> S.catMaybes([S.Just('foo'), S.Nothing(), S.Just('baz')])
["foo", "baz"]
```

<h4 name="mapMaybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L848">mapMaybe :: (a -> Maybe b) -> [a] -> [b]</a></code></h4>

Takes a function and a list, applies the function to each element of
the list, and returns a list of "successful" results. If the result of
applying the function to an element of the list is a Nothing, the result
is discarded; if the result is a Just, the Just's value is included in
the output list.

In general terms, `mapMaybe` filters a list while mapping over it.

```javascript
> S.mapMaybe(S.head, [[], [1, 2, 3], [], [4, 5, 6], []])
[1, 4]
```

<h4 name="encase"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L864">encase :: (* -> a) -> (* -> Maybe a)</a></code></h4>

Takes a function `f` which may throw and returns a curried function
`g` which will not throw. The result of applying `g` is determined by
applying `f` to the same arguments: if this succeeds, `g` returns Just
the result; otherwise `g` returns Nothing.

See also [`encaseEither`](#encaseEither).

```javascript
> S.encase(eval)('1 + 1')
Just(2)

> S.encase(eval)('1 +')
Nothing()
```

### Either type

<h4 name="Either"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L892">Either :: TypeRep Either</a></code></h4>

The Either type represents values with two possibilities: a value of type
`Either a b` is either a Left whose value is of type `a` or a Right whose
value is of type `b`.

The Either type satisfies the [Semigroup][], [Monad][], and [Extend][]
specifications.

<h4 name="Either.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L904">Either.of :: b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.

```javascript
> S.Either.of(42)
Right(42)
```

<h4 name="Either.prototype.ap"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L916">Either#ap :: Either a (b -> c) ~> Either a b -> Either a c</a></code></h4>

Takes a value of type `Either a b` and returns a Left unless `this`
is a Right *and* the argument is a Right, in which case it returns
a Right whose value is the result of applying this Right's value to
the given Right's value.

```javascript
> S.Left('Cannot divide by zero').ap(S.Right(42))
Left("Cannot divide by zero")

> S.Right(R.inc).ap(S.Left('Cannot divide by zero'))
Left("Cannot divide by zero")

> S.Right(R.inc).ap(S.Right(42))
Right(43)
```

<h4 name="Either.prototype.chain"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L934">Either#chain :: Either a b ~> (b -> Either a c) -> Either a c</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise
it returns the result of applying the function to this Right's value.

```javascript
> void (sqrt = function(n) { return n < 0 ? S.Left('Cannot represent square root of negative number') : S.Right(Math.sqrt(n)); })
undefined

> S.Left('Cannot divide by zero').chain(sqrt)
Left("Cannot divide by zero")

> S.Right(-1).chain(sqrt)
Left("Cannot represent square root of negative number")

> S.Right(25).chain(sqrt)
Right(5)
```

<h4 name="Either.prototype.concat"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L953">Either#concat :: Either a b ~> Either a b -> Either a b</a></code></h4>

Returns the result of concatenating two Either values of the same type.
`a` must have a [Semigroup][] (indicated by the presence of a `concat`
method), as must `b`.

If `this` is a Left and the argument is a Left, this method returns a
Left whose value is the result of concatenating this Left's value and
the given Left's value.

If `this` is a Right and the argument is a Right, this method returns a
Right whose value is the result of concatenating this Right's value and
the given Right's value.

Otherwise, this method returns the Right.

```javascript
> S.Left('abc').concat(S.Left('def'))
Left("abcdef")

> S.Right([1, 2, 3]).concat(S.Right([4, 5, 6]))
Right([1, 2, 3, 4, 5, 6])

> S.Left('abc').concat(S.Right([1, 2, 3]))
Right([1, 2, 3])

> S.Right([1, 2, 3]).concat(S.Left('abc'))
Right([1, 2, 3])
```

<h4 name="Either.prototype.equals"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L983">Either#equals :: Either a b ~> c -> Boolean</a></code></h4>

Takes a value of any type and returns `true` if:

  - it is a Left and `this` is a Left, and their values are equal
    according to [`R.equals`][R.equals]; or

  - it is a Right and `this` is a Right, and their values are equal
    according to [`R.equals`][R.equals].

```javascript
> S.Right([1, 2, 3]).equals(S.Right([1, 2, 3]))
true

> S.Right([1, 2, 3]).equals(S.Left([1, 2, 3]))
false

> S.Right(42).equals(42)
false
```

<h4 name="Either.prototype.extend"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1004">Either#extend :: Either a b ~> (Either a b -> b) -> Either a b</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise it
returns a Right whose value is the result of applying the function to
`this`.

```javascript
> S.Left('Cannot divide by zero').extend(function(x) { return x.value + 1; })
Left("Cannot divide by zero")

> S.Right(42).extend(function(x) { return x.value + 1; })
Right(43)
```

<h4 name="Either.prototype.map"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1018">Either#map :: Either a b ~> (b -> c) -> Either a c</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise it
returns a Right whose value is the result of applying the function to
this Right's value.

```javascript
> S.Left('Cannot divide by zero').map(R.inc)
Left("Cannot divide by zero")

> S.Right([1, 2, 3]).map(R.sum)
Right(6)
```

<h4 name="Either.prototype.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1032">Either#of :: Either a b ~> b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.

```javascript
> S.Left('Cannot divide by zero').of(42)
Right(42)
```

<h4 name="Either.prototype.toBoolean"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1042">Either#toBoolean :: Either a b ~> Boolean</a></code></h4>

Returns `false` if `this` is a Left; `true` if `this` is a Right.

```javascript
> S.Left(42).toBoolean()
false

> S.Right(42).toBoolean()
true
```

<h4 name="Either.prototype.toString"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1054">Either#toString :: Either a b ~> String</a></code></h4>

Returns the string representation of the Either.

```javascript
> S.Left('Cannot divide by zero').toString()
"Left(\\"Cannot divide by zero\\")"

> S.Right([1, 2, 3]).toString()
"Right([1, 2, 3])"
```

<h4 name="Either.prototype.type"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1066">Either#type :: TypeRep Either</a></code></h4>

A reference to the Either type. Useful for determining whether two
values such as `S.Left('Cannot divide by zero')` and `S.Right(42)`
are of the same type.

<h4 name="Left"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1073">Left :: a -> Either a b</a></code></h4>

Takes a value of any type and returns a Left with the given value.
Though this is a constructor function the `new` keyword needn't be
used.

```javascript
> S.Left('Cannot divide by zero')
Left("Cannot divide by zero")
```

<h4 name="Right"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1121">Right :: b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.
Though this is a constructor function the `new` keyword needn't be
used.

```javascript
> S.Right(42)
Right(42)
```

<h4 name="either"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1177">either :: (a -> c) -> (b -> c) -> Either a b -> c</a></code></h4>

Takes two functions and an Either, and returns the result of
applying the first function to the Left's value, if the Either
is a Left, or the result of applying the second function to the
Right's value, if the Either is a Right.

```javascript
> S.either(R.toUpper, R.toString, S.Left('Cannot divide by zero'))
"CANNOT DIVIDE BY ZERO"

> S.either(R.toUpper, R.toString, S.Right(42))
"42"
```

<h4 name="encaseEither"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1196">encaseEither :: (Error -> a) -> (* -> b) -> (* -> Either a b)</a></code></h4>

Takes two functions, `f` and `g`, the second of which may throw,
and returns a curried function of the same arity as `g` which will
not throw. The result of applying this function is determined by
applying `g` to the same arguments: if this succeeds, the return
value is a Right whose value is the result; otherwise the return
value is a Left whose value is the result of applying `f` to the
caught Error object.

See also [`encase`](#encase).

```javascript
> S.encaseEither(R.identity, Array)(0)
Right([])

> S.encaseEither(R.identity, Array)(-1)
Left(RangeError: Invalid array length)

> S.encaseEither(R.prop('message'), Array)(-1)
Left("Invalid array length")
```

<h4 name="maybeToEither"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1228">maybeToEither :: a -> Maybe b -> Either a b</a></code></h4>

Takes a value of any type and a Maybe, and returns an Either.
If the second argument is a Nothing, a Left containing the first
argument is returned. If the second argument is a Just, a Right
containing the Just's value is returned.

```javascript
> S.maybeToEither('Expecting an integer', S.parseInt(10, 'xyz'))
Left("Expecting an integer")

> S.maybeToEither('Expecting an integer', S.parseInt(10, '42'))
Right(42)
```

### Control

<h4 name="and"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1262">and :: a -> a -> a</a></code></h4>

Takes two values of the same type and returns the second value
if the first is "true"; the first value otherwise. An array is
considered "true" if its length is greater than zero. The Boolean
value `true` is also considered "true". Other types must provide
a `toBoolean` method.

```javascript
> S.and(S.Just(1), S.Just(2))
Just(2)

> S.and(S.Nothing(), S.Just(3))
Nothing()
```

<h4 name="or"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1281">or :: a -> a -> a</a></code></h4>

Takes two values of the same type and returns the first value if it
is "true"; the second value otherwise. An array is considered "true"
if its length is greater than zero. The Boolean value `true` is also
considered "true". Other types must provide a `toBoolean` method.

```javascript
> S.or(S.Just(1), S.Just(2))
Just(1)

> S.or(S.Nothing(), S.Just(3))
Just(3)
```

<h4 name="xor"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1299">xor :: a -> a -> a</a></code></h4>

Takes two values of the same type and returns the "true" value
if one value is "true" and the other is "false"; otherwise it
returns the type's "false" value. An array is considered "true"
if its length is greater than zero. The Boolean value `true` is
also considered "true". Other types must provide `toBoolean` and
`empty` methods.

```javascript
> S.xor(S.Nothing(), S.Just(1))
Just(1)

> S.xor(S.Just(2), S.Just(3))
Nothing()
```

### List

<h4 name="slice"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1324">slice :: Integer -> Integer -> [a] -> Maybe [a]</a></code></h4>

Returns Just a list containing the elements from the supplied list
from a beginning index (inclusive) to an end index (exclusive).
Returns Nothing unless the start interval is less than or equal to
the end interval, and the list contains both (half-open) intervals.
Accepts negative indices, which indicate an offset from the end of
the list.

Dispatches to its third argument's `slice` method if present. As a
result, one may replace `[a]` with `String` in the type signature.

```javascript
> S.slice(1, 3, ['a', 'b', 'c', 'd', 'e'])
Just(["b", "c"])

> S.slice(-2, -0, ['a', 'b', 'c', 'd', 'e'])
Just(["d", "e"])

> S.slice(2, -0, ['a', 'b', 'c', 'd', 'e'])
Just(["c", "d", "e"])

> S.slice(1, 6, ['a', 'b', 'c', 'd', 'e'])
Nothing()

> S.slice(2, 6, 'banana')
Just("nana")
```

<h4 name="at"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1363">at :: Integer -> [a] -> Maybe a</a></code></h4>

Takes an index and a list and returns Just the element of the list at
the index if the index is within the list's bounds; Nothing otherwise.
A negative index represents an offset from the length of the list.

```javascript
> S.at(2, ['a', 'b', 'c', 'd', 'e'])
Just("c")

> S.at(5, ['a', 'b', 'c', 'd', 'e'])
Nothing()

> S.at(-2, ['a', 'b', 'c', 'd', 'e'])
Just("d")
```

<h4 name="head"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1383">head :: [a] -> Maybe a</a></code></h4>

Takes a list and returns Just the first element of the list if the
list contains at least one element; Nothing if the list is empty.

```javascript
> S.head([1, 2, 3])
Just(1)

> S.head([])
Nothing()
```

<h4 name="last"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1397">last :: [a] -> Maybe a</a></code></h4>

Takes a list and returns Just the last element of the list if the
list contains at least one element; Nothing if the list is empty.

```javascript
> S.last([1, 2, 3])
Just(3)

> S.last([])
Nothing()
```

<h4 name="tail"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1411">tail :: [a] -> Maybe [a]</a></code></h4>

Takes a list and returns Just a list containing all but the first
of the list's elements if the list contains at least one element;
Nothing if the list is empty.

```javascript
> S.tail([1, 2, 3])
Just([2, 3])

> S.tail([])
Nothing()
```

<h4 name="init"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1426">init :: [a] -> Maybe [a]</a></code></h4>

Takes a list and returns Just a list containing all but the last
of the list's elements if the list contains at least one element;
Nothing if the list is empty.

```javascript
> S.init([1, 2, 3])
Just([1, 2])

> S.init([])
Nothing()
```

<h4 name="take"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1441">take :: Integer -> [a] -> Maybe [a]</a></code></h4>

Returns Just the first N elements of the given collection if N is
greater than or equal to zero and less than or equal to the length
of the collection; Nothing otherwise. Supports Array, String, and
any other collection type which provides a `slice` method.

```javascript
> S.take(2, ['a', 'b', 'c', 'd', 'e'])
Just(["a", "b"])

> S.take(4, 'abcdefg')
Just("abcd")

> S.take(4, ['a', 'b', 'c'])
Nothing()
```

<h4 name="takeLast"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1462">takeLast :: Integer -> [a] -> Maybe [a]</a></code></h4>

Returns Just the last N elements of the given collection if N is
greater than or equal to zero and less than or equal to the length
of the collection; Nothing otherwise. Supports Array, String, and
any other collection type which provides a `slice` method.

```javascript
> S.takeLast(2, ['a', 'b', 'c', 'd', 'e'])
Just(["d", "e"])

> S.takeLast(4, 'abcdefg')
Just("defg")

> S.takeLast(4, ['a', 'b', 'c'])
Nothing()
```

<h4 name="drop"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1483">drop :: Integer -> [a] -> Maybe [a]</a></code></h4>

Returns Just all but the first N elements of the given collection
if N is greater than or equal to zero and less than or equal to the
length of the collection; Nothing otherwise. Supports Array, String,
and any other collection type which provides a `slice` method.

```javascript
> S.drop(2, ['a', 'b', 'c', 'd', 'e'])
Just(["c", "d", "e"])

> S.drop(4, 'abcdefg')
Just("efg")

> S.drop(4, 'abc')
Nothing()
```

<h4 name="dropLast"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1504">dropLast :: Integer -> [a] -> Maybe [a]</a></code></h4>

Returns Just all but the last N elements of the given collection
if N is greater than or equal to zero and less than or equal to the
length of the collection; Nothing otherwise. Supports Array, String,
and any other collection type which provides a `slice` method.

```javascript
> S.dropLast(2, ['a', 'b', 'c', 'd', 'e'])
Just(["a", "b", "c"])

> S.dropLast(4, 'abcdefg')
Just("abc")

> S.dropLast(4, 'abc')
Nothing()
```

<h4 name="find"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1525">find :: (a -> Boolean) -> [a] -> Maybe a</a></code></h4>

Takes a predicate and a list and returns Just the leftmost element of
the list which satisfies the predicate; Nothing if none of the list's
elements satisfies the predicate.

```javascript
> S.find(function(n) { return n < 0; }, [1, -2, 3, -4, 5])
Just(-2)

> S.find(function(n) { return n < 0; }, [1, 2, 3, 4, 5])
Nothing()
```

<h4 name="indexOf"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1551">indexOf :: a -> [a] -> Maybe Integer</a></code></h4>

Takes a value of any type and a list, and returns Just the index
of the first occurrence of the value in the list, if applicable;
Nothing otherwise.

Dispatches to its second argument's `indexOf` method if present.
As a result, `String -> String -> Maybe Integer` is an alternative
type signature.

```javascript
> S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
Just(1)

> S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
Nothing()

> S.indexOf('an', 'banana')
Just(1)

> S.indexOf('ax', 'banana')
Nothing()
```

<h4 name="lastIndexOf"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1576">lastIndexOf :: a -> [a] -> Maybe Integer</a></code></h4>

Takes a value of any type and a list, and returns Just the index
of the last occurrence of the value in the list, if applicable;
Nothing otherwise.

Dispatches to its second argument's `lastIndexOf` method if present.
As a result, `String -> String -> Maybe Integer` is an alternative
type signature.

```javascript
> S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
Just(5)

> S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
Nothing()

> S.lastIndexOf('an', 'banana')
Just(3)

> S.lastIndexOf('ax', 'banana')
Nothing()
```

<h4 name="pluck"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1601">pluck :: TypeRep a -> String -> [Accessible] -> [Maybe a]</a></code></h4>

Takes a [type representative](#type-representatives), a property name,
and a list of objects and returns a list of equal length. Each element
of the output list is Just the value of the specified property of the
corresponding object if the value is of the specified type (according
to [`is`](#is)); Nothing otherwise.

See also [`get`](#get).

```javascript
> S.pluck(Number, 'x', [{x: 1}, {x: 2}, {x: '3'}, {x: null}, {}])
[Just(1), Just(2), Nothing(), Nothing(), Nothing()]
```

### Object

<h4 name="get"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1621">get :: TypeRep a -> String -> Accessible -> Maybe a</a></code></h4>

Takes a [type representative](#type-representatives), a property
name, and an object and returns Just the value of the specified object
property if it is of the specified type (according to [`is`](#is));
Nothing otherwise.

The `Object` type representative may be used as a catch-all since most
values have `Object.prototype` in their prototype chains.

See also [`gets`](#gets).

```javascript
> S.get(Number, 'x', {x: 1, y: 2})
Just(1)

> S.get(Number, 'x', {x: '1', y: '2'})
Nothing()

> S.get(Number, 'x', {})
Nothing()
```

<h4 name="gets"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1648">gets :: TypeRep a -> [String] -> Accessible -> Maybe a</a></code></h4>

Takes a [type representative](#type-representatives), a list of property
names, and an object and returns Just the value at the path specified by
the list of property names if such a path exists and the value is of the
specified type; Nothing otherwise.

See also [`get`](#get).

```javascript
> S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: 42}}})
Just(42)

> S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: '42'}}})
Nothing()

> S.gets(Number, ['a', 'b', 'c'], {})
Nothing()
```

### Parse

<h4 name="parseDate"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1674">parseDate :: String -> Maybe Date</a></code></h4>

Takes a string and returns Just the date represented by the string
if it does in fact represent a date; Nothing otherwise.

```javascript
> S.parseDate('2011-01-19T17:40:00Z')
Just(new Date("2011-01-19T17:40:00.000Z"))

> S.parseDate('today')
Nothing()
```

<h4 name="parseFloat"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1725">parseFloat :: String -> Maybe Number</a></code></h4>

Takes a string and returns Just the number represented by the string
if it does in fact represent a number; Nothing otherwise.

```javascript
> S.parseFloat('-123.45')
Just(-123.45)

> S.parseFloat('foo.bar')
Nothing()
```

<h4 name="parseInt"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1741">parseInt :: Integer -> String -> Maybe Integer</a></code></h4>

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
Nothing()
```

<h4 name="parseJson"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1782">parseJson :: String -> Maybe *</a></code></h4>

Takes a string which may or may not be valid JSON, and returns Just
the result of applying `JSON.parse` to the string if valid; Nothing
otherwise.

```javascript
> S.parseJson('["foo","bar","baz"]')
Just(["foo", "bar", "baz"])

> S.parseJson('[')
Nothing()
```

### RegExp

<h4 name="match"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1801">match :: RegExp -> String -> Maybe [Maybe String]</a></code></h4>

Takes a pattern and a string, and returns Just a list of matches
if the pattern matches the string; Nothing otherwise. Each match
has type `Maybe String`, where a Nothing represents an unmatched
optional capturing group.

```javascript
> S.match(/(good)?bye/, 'goodbye')
Just([Just("goodbye"), Just("good")])

> S.match(/(good)?bye/, 'bye')
Just([Just("bye"), Nothing()])
```

### String

<h4 name="words"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1821">words :: String -> [String]</a></code></h4>

Takes a string and returns the list of words the string contains
(words are delimited by whitespace characters).

See also [`unwords`](#unwords).

```javascript
> S.words(' foo bar baz ')
["foo", "bar", "baz"]
```

<h4 name="unwords"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1835">unwords :: [String] -> String</a></code></h4>

Takes a list of words and returns the result of joining the words
with separating spaces.

See also [`words`](#words).

```javascript
> S.unwords(['foo', 'bar', 'baz'])
"foo bar baz"
```

<h4 name="lines"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1848">lines :: String -> [String]</a></code></h4>

Takes a string and returns the list of lines the string contains
(lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
The resulting strings do not contain newlines.

See also [`unlines`](#unlines).

```javascript
> S.lines('foo\nbar\nbaz\n')
["foo", "bar", "baz"]
```

<h4 name="unlines"><code><a href="https://github.com/plaid/sanctuary/blob/v0.7.1/index.js#L1864">unlines :: [String] -> String</a></code></h4>

Takes a list of lines and returns the result of joining the lines
after appending a terminating line feed (`'\n'`) to each.

See also [`lines`](#lines).

```javascript
> S.unlines(['foo', 'bar', 'baz'])
"foo\nbar\nbaz\n"
```

[Extend]:       https://github.com/fantasyland/fantasy-land#extend
[Foldable]:     https://github.com/fantasyland/fantasy-land#foldable
[Monad]:        https://github.com/fantasyland/fantasy-land#monad
[Monoid]:       https://github.com/fantasyland/fantasy-land#monoid
[R.equals]:     http://ramdajs.com/docs/#equals
[R.is]:         http://ramdajs.com/docs/#is
[R.map]:        http://ramdajs.com/docs/#map
[Ramda]:        http://ramdajs.com/
[Semigroup]:    https://github.com/fantasyland/fantasy-land#semigroup
[parseInt]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
[primitives]:   https://developer.mozilla.org/en-US/docs/Glossary/Primitive
