# Sanctuary

Sanctuary is a small functional programming library inspired by Haskell
and PureScript. It depends on and works nicely with [Ramda][]. Sanctuary
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

## API

### Combinator

<h4 name="K"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L162">K :: a -> b -> a</a></code></h4>

The K combinator. Takes two values and returns the first. Equivalent to
Haskell's `const` function.

```javascript
> S.K('foo', 'bar')
"foo"
> R.map(S.K(42), R.range(0, 5))
[42, 42, 42, 42, 42]
```

### Maybe type

<h4 name="Maybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L179">Maybe :: Type</a></code></h4>

The Maybe type represents optional values: a value of type `Maybe a` is
either a Just whose value is of type `a` or a Nothing (with no value).

The Maybe type satisfies the [Monoid][] and [Monad][] specifications.

<h4 name="Maybe.empty"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L189">Maybe.empty :: -> Maybe a</a></code></h4>

Returns a Nothing.

```javascript
> S.Maybe.empty()
Nothing()
```

<h4 name="Maybe.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L201">Maybe.of :: a -> Maybe a</a></code></h4>

Takes a value of any type and returns a Just with the given value.

```javascript
> S.Maybe.of(42)
Just(42)
```

<h4 name="Maybe.prototype.ap"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L213">Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b</a></code></h4>

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

<h4 name="Maybe.prototype.chain"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L231">Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b</a></code></h4>

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

<h4 name="Maybe.prototype.concat"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L247">Maybe#concat :: Maybe a ~> Maybe a -> Maybe a</a></code></h4>

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

<h4 name="Maybe.prototype.empty"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L276">Maybe#empty :: Maybe a ~> Maybe a</a></code></h4>

Returns a Nothing.

```javascript
> S.Just(42).empty()
Nothing()
```

<h4 name="Maybe.prototype.equals"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L286">Maybe#equals :: Maybe a ~> b -> Boolean</a></code></h4>

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

<h4 name="Maybe.prototype.filter"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L312">Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a</a></code></h4>

Takes a predicate and returns `this` if `this` is a Just whose value
satisfies the predicate; Nothing otherwise.

```javascript
> S.Just(42).filter(function(n) { return n % 2 === 0; })
Just(42)

> S.Just(43).filter(function(n) { return n % 2 === 0; })
Nothing()
```

<h4 name="Maybe.prototype.map"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L328">Maybe#map :: Maybe a ~> (a -> b) -> Maybe b</a></code></h4>

Takes a function and returns `this` if `this` is a Nothing; otherwise
it returns a Just whose value is the result of applying the function to
this Just's value.

```javascript
> S.Nothing().map(R.inc)
Nothing()

> S.Just(42).map(R.inc)
Just(43)
```

<h4 name="Maybe.prototype.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L342">Maybe#of :: Maybe a ~> b -> Maybe b</a></code></h4>

Takes a value of any type and returns a Just with the given value.

```javascript
> S.Nothing().of(42)
Just(42)
```

<h4 name="Maybe.prototype.toBoolean"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L352">Maybe#toBoolean :: Maybe a ~> Boolean</a></code></h4>

Returns `false` if `this` is a Nothing; `true` if `this` is a Just.

```javascript
> S.Nothing().toBoolean()
false

> S.Just(42).toBoolean()
true
```

<h4 name="Maybe.prototype.toString"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L364">Maybe#toString :: Maybe a ~> String</a></code></h4>

Returns the string representation of the Maybe.

```javascript
> S.Nothing().toString()
"Nothing()"

> S.Just([1, 2, 3]).toString()
"Just([1, 2, 3])"
```

<h4 name="Maybe.prototype.type"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L376">Maybe#type :: Type</a></code></h4>

A reference to the Maybe type. Useful for determining whether two
values such as `S.Nothing()` and `S.Just(42)` are of the same type.

<h4 name="Nothing"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L382">Nothing :: -> Maybe a</a></code></h4>

Returns a Nothing. Though this is a constructor function the `new`
keyword needn't be used.

```javascript
> S.Nothing()
Nothing()
```

<h4 name="Just"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L420">Just :: a -> Maybe a</a></code></h4>

Takes a value of any type and returns a Just with the given value.
Though this is a constructor function the `new` keyword needn't be
used.

```javascript
> S.Just(42)
Just(42)
```

<h4 name="fromMaybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L470">fromMaybe :: a -> Maybe a -> a</a></code></h4>

Takes a default value and a Maybe, and returns the Maybe's value
if the Maybe is a Just; the default value otherwise.

```javascript
> S.fromMaybe(0, S.Just(42))
42

> S.fromMaybe(0, S.Nothing())
0
```

<h4 name="toMaybe"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L486">toMaybe :: a? -> Maybe a</a></code></h4>

Takes a value and returns Nothing if the value is null or undefined;
Just the value otherwise.

```javascript
> S.toMaybe(null)
Nothing()

> S.toMaybe(42)
Just(42)
```

<h4 name="encase"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L501">encase :: (* -> a) -> (* -> Maybe a)</a></code></h4>

Takes a function `f` which may throw and returns a curried function
`g` which will not throw. The result of applying `g` is determined by
applying `f` to the same arguments: if this succeeds, `g` returns Just
the result; otherwise `g` returns Nothing.

```javascript
> S.encase(eval)('1 + 1')
Just(2)

> S.encase(eval)('1 +')
Nothing()
```

### Either type

<h4 name="Either"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L527">Either :: Type</a></code></h4>

The Either type represents values with two possibilities: a value of type
`Either a b` is either a Left whose value is of type `a` or a Right whose
value is of type `b`.

The Either type satisfies the [Semigroup][] and [Monad][] specifications.

<h4 name="Either.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L538">Either.of :: b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.

```javascript
> S.Either.of(42)
Right(42)
```

<h4 name="Either.prototype.ap"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L550">Either#ap :: Either a (b -> c) ~> Either a b -> Either a c</a></code></h4>

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

<h4 name="Either.prototype.chain"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L568">Either#chain :: Either a b ~> (b -> Either a c) -> Either a c</a></code></h4>

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

<h4 name="Either.prototype.concat"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L587">Either#concat :: Either a b ~> Either a b -> Either a b</a></code></h4>

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

<h4 name="Either.prototype.equals"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L617">Either#equals :: Either a b ~> c -> Boolean</a></code></h4>

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

<h4 name="Either.prototype.map"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L638">Either#map :: Either a b ~> (b -> c) -> Either a c</a></code></h4>

Takes a function and returns `this` if `this` is a Left; otherwise it
returns a Right whose value is the result of applying the function to
this Right's value.

```javascript
> S.Left('Cannot divide by zero').map(R.inc)
Left("Cannot divide by zero")

> S.Right(42).map(R.inc)
Right(43)
```

<h4 name="Either.prototype.of"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L652">Either#of :: Either a b ~> b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.

```javascript
> S.Left('Cannot divide by zero').of(42)
Right(42)
```

<h4 name="Either.prototype.toBoolean"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L662">Either#toBoolean :: Either a b ~> Boolean</a></code></h4>

Returns `false` if `this` is a Left; `true` if `this` is a Right.

```javascript
> S.Left(42).toBoolean()
false

> S.Right(42).toBoolean()
true
```

<h4 name="Either.prototype.toString"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L674">Either#toString :: Either a b ~> String</a></code></h4>

Returns the string representation of the Either.

```javascript
> S.Left('Cannot divide by zero').toString()
"Left(\\"Cannot divide by zero\\")"

> S.Right([1, 2, 3]).toString()
"Right([1, 2, 3])"
```

<h4 name="Either.prototype.type"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L686">Either#type :: Type</a></code></h4>

A reference to the Either type. Useful for determining whether two
values such as `S.Left('Cannot divide by zero')` and `S.Right(42)`
are of the same type.

<h4 name="Left"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L693">Left :: a -> Either a b</a></code></h4>

Takes a value of any type and returns a Left with the given value.
Though this is a constructor function the `new` keyword needn't be
used.

```javascript
> S.Left('Cannot divide by zero')
Left("Cannot divide by zero")
```

<h4 name="Right"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L736">Right :: b -> Either a b</a></code></h4>

Takes a value of any type and returns a Right with the given value.
Though this is a constructor function the `new` keyword needn't be
used.

```javascript
> S.Right(42)
Right(42)
```

<h4 name="either"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L785">either :: (a -> c) -> (b -> c) -> Either a b -> c</a></code></h4>

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

### Control

<h4 name="and"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L828">and :: a -> a -> a</a></code></h4>

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

<h4 name="or"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L848">or :: a -> a -> a</a></code></h4>

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

<h4 name="xor"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L867">xor :: a -> a -> a</a></code></h4>

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

<h4 name="slice"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L893">slice :: Number -> Number -> [a] -> Maybe [a]</a></code></h4>

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

<h4 name="at"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L932">at :: Number -> [a] -> Maybe a</a></code></h4>

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

<h4 name="head"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L952">head :: [a] -> Maybe a</a></code></h4>

Takes a list and returns Just the first element of the list if the
list contains at least one element; Nothing if the list is empty.

```javascript
> S.head([1, 2, 3])
Just(1)

> S.head([])
Nothing()
```

<h4 name="last"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L966">last :: [a] -> Maybe a</a></code></h4>

Takes a list and returns Just the last element of the list if the
list contains at least one element; Nothing if the list is empty.

```javascript
> S.last([1, 2, 3])
Just(3)

> S.last([])
Nothing()
```

<h4 name="tail"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L980">tail :: [a] -> Maybe [a]</a></code></h4>

Takes a list and returns Just a list containing all but the first
of the list's elements if the list contains at least one element;
Nothing if the list is empty.

```javascript
> S.tail([1, 2, 3])
Just([2, 3])

> S.tail([])
Nothing()
```

<h4 name="init"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L995">init :: [a] -> Maybe [a]</a></code></h4>

Takes a list and returns Just a list containing all but the last
of the list's elements if the list contains at least one element;
Nothing if the list is empty.

```javascript
> S.init([1, 2, 3])
Just([1, 2])

> S.init([])
Nothing()
```

<h4 name="take"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1010">take :: Number -> [a] -> Maybe [a]</a></code></h4>

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

<h4 name="drop"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1031">drop :: Number -> [a] -> Maybe [a]</a></code></h4>

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

<h4 name="find"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1052">find :: (a -> Boolean) -> [a] -> Maybe a</a></code></h4>

Takes a predicate and a list and returns Just the leftmost element of
the list which satisfies the predicate; Nothing if none of the list's
elements satisfies the predicate.

```javascript
> S.find(function(n) { return n < 0; }, [1, -2, 3, -4, 5])
Just(-2)

> S.find(function(n) { return n < 0; }, [1, 2, 3, 4, 5])
Nothing()
```

<h4 name="indexOf"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1078">indexOf :: a -> [a] -> Maybe Number</a></code></h4>

Takes a value of any type and a list, and returns Just the index
of the first occurrence of the value in the list, if applicable;
Nothing otherwise.

Dispatches to its second argument's `indexOf` method if present.
As a result, `String -> String -> Maybe Number` is an alternative
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

<h4 name="lastIndexOf"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1103">lastIndexOf :: a -> [a] -> Maybe Number</a></code></h4>

Takes a value of any type and a list, and returns Just the index
of the last occurrence of the value in the list, if applicable;
Nothing otherwise.

Dispatches to its second argument's `lastIndexOf` method if present.
As a result, `String -> String -> Maybe Number` is an alternative
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

<h4 name="pluck"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1128">pluck :: String -> [{String: *}] -> [Maybe *]</a></code></h4>

Takes a list of objects and plucks the value of the specified key
for each object in the list. Returns the value wrapped in a Just
if an object has the key and a Nothing if it does not.

```javascript
> S.pluck('a', [{a: 1, b: 2}, {a: 4, b: 5}, {b: 3, c: 7}])
[Just(1), Just(4), Nothing()]

> S.pluck('x', [{x: 1}, {x: 2}, {x: undefined}])
[Just(1), Just(2), Just(undefined)]
```

### Object

<h4 name="get"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1147">get :: String -> Object -> Maybe *</a></code></h4>

Takes a property name and an object and returns Just the value of
the specified property of the object if the object has such an own
property; Nothing otherwise.

```javascript
> S.get('x', {x: 1, y: 2})
Just(1)

> S.get('toString', {x: 1, y: 2})
Nothing()
```

<h4 name="gets"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1164">gets :: [String] -> Object -> Maybe *</a></code></h4>

Takes a list of property names and an object and returns Just the
value at the path specified by the list of property names if such
a path exists; Nothing otherwise.

```javascript
> S.gets(['a', 'b', 'c'], {a: {b: {c: 42}}})
Just(42)

> S.gets(['a', 'b', 'c'], {})
Nothing()
```

### Parse

<h4 name="parseDate"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1185">parseDate :: String -> Maybe Date</a></code></h4>

Takes a string and returns Just the date represented by the string
if it does in fact represent a date; Nothing otherwise.

```javascript
> S.parseDate('2011-01-19T17:40:00Z')
Just(new Date("2011-01-19T17:40:00.000Z"))

> S.parseDate('today')
Nothing()
```

<h4 name="parseFloat"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1202">parseFloat :: String -> Maybe Number</a></code></h4>

Takes a string and returns Just the number represented by the string
if it does in fact represent a number; Nothing otherwise.

```javascript
> S.parseFloat('-123.45')
Just(-123.45)

> S.parseFloat('foo.bar')
Nothing()
```

<h4 name="parseInt"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1219">parseInt :: Number -> String -> Maybe Number</a></code></h4>

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

<h4 name="parseJson"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1259">parseJson :: String -> Maybe *</a></code></h4>

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

<h4 name="match"><code><a href="https://github.com/plaid/sanctuary/blob/v0.6.0/index.js#L1278">match :: RegExp -> String -> Maybe [Maybe String]</a></code></h4>

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

[Monad]:        https://github.com/fantasyland/fantasy-land#monad
[Monoid]:       https://github.com/fantasyland/fantasy-land#monoid
[R.equals]:     http://ramdajs.com/docs/#equals
[R.map]:        http://ramdajs.com/docs/#map
[Ramda]:        http://ramdajs.com/
[Semigroup]:    https://github.com/fantasyland/fantasy-land#semigroup
[parseInt]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
