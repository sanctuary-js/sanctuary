/*    #######
   ####     ####
 ####   ###   ####
#####   ###########   sanctuary
########   ########   noun
###########   #####   1 [ mass noun ] refuge from unsafe JavaScript
 ####   ###   ####
   ####     ####
      #######    */

//. # Sanctuary
//.
//. Sanctuary is a small functional programming library inspired by Haskell
//. and PureScript. It depends on and works nicely with [Ramda][]. Sanctuary
//. makes it possible to write safe code without null checks.
//.
//. In JavaScript it's trivial to introduce a possible run-time type error:
//.
//.     words[0].toUpperCase()
//.
//. If `words` is `[]` we'll get a familiar error at run-time:
//.
//.     TypeError: Cannot read property 'toUpperCase' of undefined
//.
//. Sanctuary gives us a fighting chance of avoiding such errors. We might
//. write:
//.
//.     R.map(R.toUpper, S.head(words))
//.
//. ## Types
//.
//. Sanctuary uses Haskell-like type signatures to describe the types of
//. values, including functions. `'foo'`, for example, has type `String`;
//. `[1, 2, 3]` has type `[Number]`. The arrow (`->`) is used to express a
//. function's type. `Math.abs`, for example, has type `Number -> Number`.
//. That is, it takes an argument of type `Number` and returns a value of
//. type `Number`.
//.
//. [`R.map`][R.map] has type `(a -> b) -> [a] -> [b]`. That is, it takes
//. an argument of type `a -> b` and returns a value of type `[a] -> [b]`.
//. `a` and `b` are type variables: applying `R.map` to a value of type
//. `String -> Number` will give a value of type `[String] -> [Number]`.
//.
//. Sanctuary embraces types. JavaScript doesn't support algebraic data types,
//. but these can be simulated by providing a group of constructor functions
//. whose prototypes provide the same set of methods. A value of the Maybe
//. type, for example, is created via the Nothing constructor or the Just
//. constructor.
//.
//. It's necessary to extend Haskell's notation to describe implicit arguments
//. to the *methods* provided by Sanctuary's types. In `x.map(y)`, for example,
//. the `map` method takes an implicit argument `x` in addition to the explicit
//. argument `y`. The type of the value upon which a method is invoked appears
//. at the beginning of the signature, separated from the arguments and return
//. value by a squiggly arrow (`~>`). The type of the `map` method of the Maybe
//. type is written `Maybe a ~> (a -> b) -> Maybe b`. One could read this as:
//.
//. _When the `map` method is invoked on a value of type `Maybe a`
//. (for any type `a`) with an argument of type `a -> b` (for any type `b`),
//. it returns a value of type `Maybe b`._
//.
//. ## API

;(function() {

  'use strict';

  var R;
  var S = {};

  /* istanbul ignore else */
  if (typeof module !== 'undefined') {
    R = require('ramda');
    module.exports = S;
  } else {
    R = this.R;
    this.sanctuary = S;
  }

  var _ = R.__;

  var extend = function(Child, Parent) {
    function Ctor() {
      this.constructor = Child;
    }
    Ctor.prototype = Parent.prototype;
    Child.prototype = new Ctor();
    Child.super_ = Parent.prototype;
  };

  var filter = function(pred, m) {
    return m.chain(function(x) {
      return pred(x) ? m.of(x) : m.empty();
    });
  };

  //. ### Combinator

  //# K :: a -> b -> a
  //.
  //. The K combinator. Takes two values and returns the first. Equivalent to
  //. Haskell's `const` function.
  //.
  //. ```javascript
  //. > S.K('foo', 'bar')
  //. "foo"
  //. > R.map(S.K(42), R.range(0, 5))
  //. [42, 42, 42, 42, 42]
  //. ```
  S.K = R.curry(function(x, y) {
    return x;
  });

  //. ### Maybe type

  //# Maybe :: Type
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either a Just whose value is of type `a` or a Nothing (with no value).
  //.
  //. The Maybe type satisfies the [Monoid][] and [Monad][] specifications.
  var Maybe = S.Maybe = function Maybe() {
    throw new Error('Cannot instantiate Maybe');
  };

  //# Maybe.empty :: -> Maybe a
  //.
  //. Returns a Nothing.
  //.
  //. ```javascript
  //. > S.Maybe.empty()
  //. Nothing()
  //. ```
  Maybe.empty = function() {
    return new Nothing();
  };

  //# Maybe.of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Maybe.of(42)
  //. Just(42)
  //. ```
  Maybe.of = function(x) {
    return new Just(x);
  };

  //# Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
  //.
  //. Takes a value of type `Maybe a` and returns a Nothing unless `this`
  //. is a Just *and* the argument is a Just, in which case it returns a
  //. Just whose value is the result of of applying this Just's value to
  //. the given Just's value.
  //.
  //. ```javascript
  //. > S.Nothing().ap(S.Just(42))
  //. Nothing()
  //.
  //. > S.Just(R.inc).ap(S.Nothing())
  //. Nothing()
  //.
  //. > S.Just(R.inc).ap(S.Just(42))
  //. Just(43)
  //. ```

  //# Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is a Nothing; otherwise
  //. it returns the result of applying the function to this Just's value.
  //.
  //. ```javascript
  //. > S.Nothing().chain(S.parseFloat)
  //. Nothing()
  //.
  //. > S.Just('xxx').chain(S.parseFloat)
  //. Nothing()
  //.
  //. > S.Just('12.34').chain(S.parseFloat)
  //. Just(12.34)
  //. ```

  //# Maybe#concat :: Maybe a ~> Maybe a -> Maybe a
  //.
  //. Returns the result of concatenating two Maybe values of the same type.
  //. `a` must have a [Semigroup][] (indicated by the presence of a `concat`
  //. method).
  //.
  //. If `this` is a Nothing and the argument is a Nothing, this method returns
  //. a Nothing.
  //.
  //. If `this` is a Just and the argument is a Just, this method returns a
  //. Just whose value is the result of concatenating this Just's value and
  //. the given Just's value.
  //.
  //. Otherwise, this method returns the Just.
  //.
  //. ```javascript
  //. > S.Nothing().concat(S.Nothing())
  //. Nothing()
  //.
  //. > S.Just([1, 2, 3]).concat(S.Just([4, 5, 6]))
  //. Just([1, 2, 3, 4, 5, 6])
  //.
  //. > S.Nothing().concat(S.Just([1, 2, 3]))
  //. Just([1, 2, 3])
  //.
  //. > S.Just([1, 2, 3]).concat(S.Nothing())
  //. Just([1, 2, 3])
  //. ```

  //# Maybe#empty :: Maybe a ~> Maybe a
  //.
  //. Returns a Nothing.
  //.
  //. ```javascript
  //. > S.Just(42).empty()
  //. Nothing()
  //. ```
  Maybe.prototype.empty = Maybe.empty;

  //# Maybe#equals :: Maybe a ~> Maybe a -> Boolean
  //.
  //. Takes a Maybe and returns `true` if:
  //.
  //.   - it is a Nothing and `this` is a Nothing; or
  //.
  //.   - it is a Just and `this` is a Just, and their values are equal,
  //.     in [SameValue][] terms.
  //.
  //. ```javascript
  //. > S.Nothing().equals(S.Nothing())
  //. true
  //.
  //. > S.Just(42).equals(S.Just(42))
  //. true
  //.
  //. > S.Just(42).equals(S.Just(43))
  //. false
  //.
  //. > S.Just(42).equals(S.Nothing())
  //. false
  //. ```

  //# Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a
  //.
  //. Takes a predicate and returns `this` if `this` is a Just whose value
  //. satisfies the predicate; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.Just(42).filter(function(n) { return n % 2 === 0; })
  //. Just(42)
  //.
  //. > S.Just(43).filter(function(n) { return n % 2 === 0; })
  //. Nothing()
  //. ```
  Maybe.prototype.filter = function(pred) {
    return filter(pred, this);
  };

  //# Maybe#map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is a Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function to
  //. this Just's value.
  //.
  //. ```javascript
  //. > S.Nothing().map(R.inc)
  //. Nothing()
  //.
  //. > S.Just(42).map(R.inc)
  //. Just(43)
  //. ```

  //# Maybe#of :: Maybe a ~> b -> Maybe b
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Nothing().of(42)
  //. Just(42)
  //. ```
  Maybe.prototype.of = Maybe.of;

  //# Maybe#toBoolean :: Maybe a ~> Boolean
  //.
  //. Returns `false` if `this` is a Nothing; `true` if `this` is a Just.
  //.
  //. ```javascript
  //. > S.Nothing().toBoolean()
  //. false
  //.
  //. > S.Just(42).toBoolean()
  //. true
  //. ```

  //# Maybe#toString :: Maybe a ~> String
  //.
  //. Returns the string representation of the Maybe.
  //.
  //. ```javascript
  //. > S.Nothing().toString()
  //. "Nothing()"
  //.
  //. > S.Just([1, 2, 3]).toString()
  //. "Just([1, 2, 3])"
  //. ```

  //# Maybe#type :: Type
  //.
  //. A reference to the Maybe type. Useful for determining whether two
  //. values such as `S.Nothing()` and `S.Just(42)` are of the same type.
  Maybe.prototype.type = Maybe;

  //# Nothing :: -> Maybe a
  //.
  //. Returns a Nothing. Though this is a constructor function the `new`
  //. keyword needn't be used.
  //.
  //. ```javascript
  //. > S.Nothing()
  //. Nothing()
  //. ```
  var Nothing = S.Nothing = function Nothing() {
    if (!(this instanceof Nothing)) {
      return new Nothing();
    }
  };
  extend(Nothing, Maybe);

  //  Nothing#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
  Nothing.prototype.ap = function(x) {
    return this;
  };

  //  Nothing#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  Nothing.prototype.chain = function(f) {
    return this;
  };

  //  Nothing#concat :: Maybe a ~> Maybe a -> Maybe a
  Nothing.prototype.concat = function(maybe) {
    return maybe;
  };

  //  Nothing#equals :: Maybe a ~> Maybe a -> Boolean
  Nothing.prototype.equals = function(maybe) {
    return maybe instanceof Nothing;
  };

  //  Nothing#map :: Maybe a ~> (a -> b) -> Maybe b
  Nothing.prototype.map = function(f) {
    return this;
  };

  //  Nothing#toBoolean :: Maybe a ~> Boolean
  Nothing.prototype.toBoolean = function() {
    return false;
  };

  //  Nothing#toString :: Maybe a ~> String
  Nothing.prototype.toString = function() {
    return 'Nothing()';
  };

  //# Just :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //. Though this is a constructor function the `new` keyword needn't be
  //. used.
  //.
  //. ```javascript
  //. > S.Just(42)
  //. Just(42)
  //. ```
  var Just = S.Just = function Just(value) {
    if (!(this instanceof Just)) {
      return new Just(value);
    } else {
      this.value = value;
    }
  };
  extend(Just, Maybe);

  //  Just#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
  Just.prototype.ap = function(x) {
    return x.map(this.value);
  };

  //  Just#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  Just.prototype.chain = function(f) {
    return f(this.value);
  };

  //  Just#concat :: Maybe a ~> Maybe a -> Maybe a
  Just.prototype.concat = function(maybe) {
    return maybe instanceof Just ? Just(this.value.concat(maybe.value)) : this;
  };

  //  Just#equals :: Maybe a ~> Maybe a -> Boolean
  Just.prototype.equals = function(maybe) {
    return maybe instanceof Just && R.eqProps('value', maybe, this);
  };

  //  Just#map :: Maybe a ~> (a -> b) -> Maybe b
  Just.prototype.map = function(f) {
    return new Just(f(this.value));
  };

  //  Just#toBoolean :: Maybe a ~> Boolean
  Just.prototype.toBoolean = function() {
    return true;
  };

  //  Just#toString :: Maybe a ~> String
  Just.prototype.toString = function() {
    return 'Just(' + R.toString(this.value) + ')';
  };

  //# fromMaybe :: a -> Maybe a -> a
  //.
  //. Takes a default value and a Maybe, and returns the Maybe's value
  //. if the Maybe is a Just; the default value otherwise.
  //.
  //. ```javascript
  //. > S.fromMaybe(0, S.Just(42))
  //. 42
  //.
  //. > S.fromMaybe(0, S.Nothing())
  //. 0
  //. ```
  S.fromMaybe = R.curry(function(x, maybe) {
    switch (true) {
      case maybe instanceof Nothing:
        return x;
      case maybe instanceof Just:
        return maybe.value;
      default:
        throw new TypeError('Pattern match failure');
    }
  });

  //# toMaybe :: a? -> Maybe a
  //.
  //. Takes a value and returns Nothing if the value is null or undefined;
  //. Just the value otherwise.
  //.
  //. ```javascript
  //. > S.toMaybe(null)
  //. Nothing()
  //.
  //. > S.toMaybe(42)
  //. Just(42)
  //. ```
  S.toMaybe = R.ifElse(R.isNil, Nothing, Just);

  //# encase :: (* -> a) -> (* -> Maybe a)
  //.
  //. Takes a function `f` which may throw and returns a curried function
  //. `g` which will not throw. The result of applying `g` is determined by
  //. applying `f` to the same arguments: if this succeeds, `g` returns Just
  //. the result; otherwise `g` returns Nothing.
  //.
  //. ```javascript
  //. > S.encase(eval)('1 + 1')
  //. Just(2)
  //.
  //. > S.encase(eval)('1 +')
  //. Nothing()
  //. ```
  var encase = S.encase = R.curry(function(f) {
    return R.curryN(f.length, function() {
      try {
        return Just(f.apply(this, arguments));
      } catch (err) {
        return Nothing();
      }
    });
  });

  //. ### Either type

  //# Either :: Type
  //.
  //. The Either type represents values with two possibilities: a value of type
  //. `Either a b` is either a Left whose value is of type `a` or a Right whose
  //. value is of type `b`.
  //.
  //. The Either type satisfies the [Semigroup][] and [Monad][] specifications.
  var Either = S.Either = function Either() {
    throw new Error('Cannot instantiate Either');
  };

  //# Either.of :: b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Either.of(42)
  //. Right(42)
  //. ```
  Either.of = function(x) {
    return new Right(x);
  };

  //# Either#ap :: Either a (b -> c) ~> Either a b -> Either a c
  //.
  //. Takes a value of type `Either a b` and returns a Left unless `this`
  //. is a Right *and* the argument is a Right, in which case it returns
  //. a Right whose value is the result of applying this Right's value to
  //. the given Right's value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').ap(S.Right(42))
  //. Left("Cannot divide by zero")
  //.
  //. > S.Right(R.inc).ap(S.Left('Cannot divide by zero'))
  //. Left("Cannot divide by zero")
  //.
  //. > S.Right(R.inc).ap(S.Right(42))
  //. Right(43)
  //. ```

  //# Either#chain :: Either a b ~> (b -> Either a c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise
  //. it returns the result of applying the function to this Right's value.
  //.
  //. ```javascript
  //. > void (sqrt = function(n) { return n < 0 ? S.Left('Cannot represent square root of negative number') : S.Right(Math.sqrt(n)); })
  //. undefined
  //.
  //. > S.Left('Cannot divide by zero').chain(sqrt)
  //. Left("Cannot divide by zero")
  //.
  //. > S.Right(-1).chain(sqrt)
  //. Left("Cannot represent square root of negative number")
  //.
  //. > S.Right(25).chain(sqrt)
  //. Right(5)
  //. ```

  //# Either#concat :: Either a b ~> Either a b -> Either a b
  //.
  //. Returns the result of concatenating two Either values of the same type.
  //. `a` must have a [Semigroup][] (indicated by the presence of a `concat`
  //. method), as must `b`.
  //.
  //. If `this` is a Left and the argument is a Left, this method returns a
  //. Left whose value is the result of concatenating this Left's value and
  //. the given Left's value.
  //.
  //. If `this` is a Right and the argument is a Right, this method returns a
  //. Right whose value is the result of concatenating this Right's value and
  //. the given Right's value.
  //.
  //. Otherwise, this method returns the Right.
  //.
  //. ```javascript
  //. > S.Left('abc').concat(S.Left('def'))
  //. Left("abcdef")
  //.
  //. > S.Right([1, 2, 3]).concat(S.Right([4, 5, 6]))
  //. Right([1, 2, 3, 4, 5, 6])
  //.
  //. > S.Left('abc').concat(S.Right([1, 2, 3]))
  //. Right([1, 2, 3])
  //.
  //. > S.Right([1, 2, 3]).concat(S.Left('abc'))
  //. Right([1, 2, 3])
  //. ```

  //# Either#equals :: Either a b ~> Either a b -> Boolean
  //.
  //. Takes an Either and returns `true` if:
  //.
  //.   - it is a Left and `this` is a Left, and their values are equal,
  //.     in [SameValue][] terms; or
  //.
  //.   - it is a Right and `this` is a Right, and their values are equal,
  //.     in [SameValue][] terms.
  //.
  //. ```javascript
  //. > S.Right(42).equals(S.Right(42))
  //. true
  //.
  //. > S.Right(42).equals(S.Left(42))
  //. false
  //. ```

  //# Either#map :: Either a b ~> (b -> c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise it
  //. returns a Right whose value is the result of applying the function to
  //. this Right's value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').map(R.inc)
  //. Left("Cannot divide by zero")
  //.
  //. > S.Right(42).map(R.inc)
  //. Right(43)
  //. ```

  //# Either#of :: Either a b ~> b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').of(42)
  //. Right(42)
  //. ```
  Either.prototype.of = Either.of;

  //# Either#toBoolean :: Either a b ~> Boolean
  //.
  //. Returns `false` if `this` is a Left; `true` if `this` is a Right.
  //.
  //. ```javascript
  //. > S.Left(42).toBoolean()
  //. false
  //.
  //. > S.Right(42).toBoolean()
  //. true
  //. ```

  //# Either#toString :: Either a b ~> String
  //.
  //. Returns the string representation of the Either.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').toString()
  //. "Left(\\"Cannot divide by zero\\")"
  //.
  //. > S.Right([1, 2, 3]).toString()
  //. "Right([1, 2, 3])"
  //. ```

  //# Either#type :: Type
  //.
  //. A reference to the Either type. Useful for determining whether two
  //. values such as `S.Left('Cannot divide by zero')` and `S.Right(42)`
  //. are of the same type.
  Either.prototype.type = Either;

  //# Left :: a -> Either a b
  //.
  //. Takes a value of any type and returns a Left with the given value.
  //. Though this is a constructor function the `new` keyword needn't be
  //. used.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero')
  //. Left("Cannot divide by zero")
  //. ```
  var Left = S.Left = function Left(value) {
    if (!(this instanceof Left)) {
      return new Left(value);
    }
    this.value = value;
  };
  extend(Left, Either);

  //  Left#ap :: Either a (b -> c) ~> Either a b -> Either a c
  Left.prototype.ap = function(x) {
    return this;
  };

  //  Left#chain :: Either a b ~> (b -> Either a c) -> Either a c
  Left.prototype.chain = function(f) {
    return this;
  };

  //  Left#concat :: Either a b ~> Either a b -> Either a b
  Left.prototype.concat = function(either) {
    return R.is(Left, either) ? Left(this.value.concat(either.value)) : either;
  };

  //  Left#equals :: Either a b ~> Either a b -> Boolean
  Left.prototype.equals = function(either) {
    return either instanceof Left && R.eqProps('value', either, this);
  };

  //  Left#map :: Either a b ~> (b -> c) -> Either a c
  Left.prototype.map = function(f) {
    return this;
  };

  //  Left#toBoolean :: Either a b ~> Boolean
  Left.prototype.toBoolean = function() {
    return false;
  };

  //  Left#toString :: Either a b ~> String
  Left.prototype.toString = function() {
    return 'Left(' + R.toString(this.value) + ')';
  };

  //# Right :: b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //. Though this is a constructor function the `new` keyword needn't be
  //. used.
  //.
  //. ```javascript
  //. > S.Right(42)
  //. Right(42)
  //. ```
  var Right = S.Right = function Right(value) {
    if (!(this instanceof Right)) {
      return new Right(value);
    }
    this.value = value;
  };
  extend(Right, Either);

  //  Right#ap :: Either a (b -> c) ~> Either a b -> Either a c
  Right.prototype.ap = function(x) {
    return x.map(this.value);
  };

  //  Right#chain :: Either a b ~> (b -> Either a c) -> Either a c
  Right.prototype.chain = function(f) {
    return f(this.value);
  };

  //  Right#concat :: Either a b ~> Either a b -> Either a b
  Right.prototype.concat = function(either) {
    return R.is(Right, either) ? Right(this.value.concat(either.value)) : this;
  };

  //  Right#equals :: Either a b ~> Either a b -> Boolean
  Right.prototype.equals = function(either) {
    return either instanceof Right && R.eqProps('value', either, this);
  };

  //  Right#map :: Either a b ~> (b -> c) -> Either a c
  Right.prototype.map = function(f) {
    return new Right(f(this.value));
  };

  //  Right#toBoolean :: Either a b ~> Boolean
  Right.prototype.toBoolean = function() {
    return true;
  };

  //  Right#toString :: Either a b ~> String
  Right.prototype.toString = function() {
    return 'Right(' + R.toString(this.value) + ')';
  };

  //# either :: (a -> c) -> (b -> c) -> Either a b -> c
  //.
  //. Takes two functions and an Either, and returns the result of
  //. applying the first function to the Left's value, if the Either
  //. is a Left, or the result of applying the second function to the
  //. Right's value, if the Either is a Right.
  //.
  //. ```javascript
  //. > S.either(R.toUpper, R.toString, S.Left('Cannot divide by zero'))
  //. "CANNOT DIVIDE BY ZERO"
  //.
  //. > S.either(R.toUpper, R.toString, S.Right(42))
  //. "42"
  //. ```
  S.either = R.curry(function(l, r, either) {
    switch (true) {
      case either instanceof Left:
        return l(either.value);
      case either instanceof Right:
        return r(either.value);
      default:
        throw new TypeError('Pattern match failure');
    }
  });

  //. ### Control

  var assertTypeMatch = function(x, y) {
    if (R.type(x) !== R.type(y) || x.type !== y.type) {
      throw new TypeError('Type mismatch');
    }
  };

  //  toBoolean :: * -> Boolean
  var toBoolean = function(x) {
    if (R.is(Array, x))               return x.length > 0;
    if (R.is(Boolean, x))             return x;
    if (R.is(Function, x.toBoolean))  return x.toBoolean();
    throw new TypeError(R.toString(x) + ' does not have a "toBoolean" method');
  };

  //  empty :: a -> a
  var empty = function(x) {
    if (R.is(Array, x))               return [];
    if (R.is(Boolean, x))             return false;
    if (R.is(Function, x.empty))      return x.empty();
    throw new TypeError(R.toString(x) + ' does not have an "empty" method');
  };

  //# and :: a -> a -> a
  //.
  //. Takes two values of the same type and returns the second value
  //. if the first is "true"; the first value otherwise. An array is
  //. considered "true" if its length is greater than zero. The Boolean
  //. value `true` is also considered "true". Other types must provide
  //. a `toBoolean` method.
  //.
  //. ```javascript
  //. > S.and(S.Just(1), S.Just(2))
  //. Just(2)
  //.
  //. > S.and(S.Nothing(), S.Just(3))
  //. Nothing()
  //. ```
  S.and = R.curry(function(x, y) {
    assertTypeMatch(x, y);
    return toBoolean(x) ? y : x;
  });

  //# or :: a -> a -> a
  //.
  //. Takes two values of the same type and returns the first value if it
  //. is "true"; the second value otherwise. An array is considered "true"
  //. if its length is greater than zero. The Boolean value `true` is also
  //. considered "true". Other types must provide a `toBoolean` method.
  //.
  //. ```javascript
  //. > S.or(S.Just(1), S.Just(2))
  //. Just(1)
  //.
  //. > S.or(S.Nothing(), S.Just(3))
  //. Just(3)
  //. ```
  var or = S.or = R.curry(function(x, y) {
    assertTypeMatch(x, y);
    return toBoolean(x) ? x : y;
  });

  //# xor :: a -> a -> a
  //.
  //. Takes two values of the same type and returns the "true" value
  //. if one value is "true" and the other is "false"; otherwise it
  //. returns the type's "false" value. An array is considered "true"
  //. if its length is greater than zero. The Boolean value `true` is
  //. also considered "true". Other types must provide `toBoolean` and
  //. `empty` methods.
  //.
  //. ```javascript
  //. > S.xor(S.Nothing(), S.Just(1))
  //. Just(1)
  //.
  //. > S.xor(S.Just(2), S.Just(3))
  //. Nothing()
  //. ```
  S.xor = R.curry(function(x, y) {
    assertTypeMatch(x, y);
    var xBool = toBoolean(x);
    var yBool = toBoolean(y);
    var xEmpty = empty(x);
    return xBool !== yBool ? or(x, y) : xEmpty;
  });

  //. ### List

  //# slice :: Number -> Number -> [a] -> Maybe [a]
  //.
  //. Returns Just a list containing the elements from the supplied list
  //. from a beginning index (inclusive) to an end index (exclusive).
  //. Returns Nothing unless the start interval is less than or equal to
  //. the end interval, and the list contains both (half-open) intervals.
  //. Accepts negative indices, which indicate an offset from the end of
  //. the list.
  //.
  //. ```javascript
  //. > S.slice(1, 1, ['a', 'b', 'c', 'd', 'e'])
  //. Just([])
  //.
  //. > S.slice(1, 3, ['a', 'b', 'c', 'd', 'e'])
  //. Just(["b", "c"])
  //.
  //. > S.slice(-2, -0, ['a', 'b', 'c', 'd', 'e'])
  //. Just(["d", "e"])
  //.
  //. > S.slice(2, -0, ['a', 'b', 'c', 'd', 'e'])
  //. Just(["c", "d", "e"])
  //.
  //. > S.slice(0, 2, [])
  //. Nothing()
  //.
  //. > S.slice(1, 6, ['a', 'b', 'c', 'd', 'e'])
  //. Nothing()
  //. ```
  var slice = S.slice = R.curry(function(start, end, xs) {
    var len = xs.length;
    var startIdx = R.eq(-0, start) ? len : start < 0 ? start + len : start;
    var endIdx = R.eq(-0, end) ? len : end < 0 ? end + len : end;

    return (Math.abs(start) <= len && Math.abs(end) <= len && startIdx <= endIdx) ?
      Just(R.slice(startIdx, endIdx, xs)) :
      Nothing();
  });

  //# at :: Number -> [a] -> Maybe a
  //.
  //. Takes an index and a list and returns Just the element of the list at
  //. the index if the index is within the list's bounds; Nothing otherwise.
  //. A negative index represents an offset from the length of the list.
  //.
  //. ```javascript
  //. > S.at(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just("c")
  //.
  //. > S.at(5, ['a', 'b', 'c', 'd', 'e'])
  //. Nothing()
  //.
  //. > S.at(-2, ['a', 'b', 'c', 'd', 'e'])
  //. Just("d")
  //. ```
  var at = S.at = R.curry(function(n, xs) {
    return R.map(R.head, slice(n, n === -1 ? -0 : n + 1, xs));
  });

  //# head :: [a] -> Maybe a
  //.
  //. Takes a list and returns Just the first element of the list if the
  //. list contains at least one element; Nothing if the list is empty.
  //.
  //. ```javascript
  //. > S.head([1, 2, 3])
  //. Just(1)
  //.
  //. > S.head([])
  //. Nothing()
  //. ```
  S.head = at(0);

  //# last :: [a] -> Maybe a
  //.
  //. Takes a list and returns Just the last element of the list if the
  //. list contains at least one element; Nothing if the list is empty.
  //.
  //. ```javascript
  //. > S.last([1, 2, 3])
  //. Just(3)
  //.
  //. > S.last([])
  //. Nothing()
  //. ```
  S.last = at(-1);

  //# tail :: [a] -> Maybe [a]
  //.
  //. Takes a list and returns Just a list containing all but the first
  //. of the list's elements if the list contains at least one element;
  //. Nothing if the list is empty.
  //.
  //. ```javascript
  //. > S.tail([1, 2, 3])
  //. Just([2, 3])
  //.
  //. > S.tail([])
  //. Nothing()
  //. ```
  S.tail = S.slice(1, -0);

  //# init :: [a] -> Maybe [a]
  //.
  //. Takes a list and returns Just a list containing all but the last
  //. of the list's elements if the list contains at least one element;
  //. Nothing if the list is empty.
  //.
  //. ```javascript
  //. > S.init([1, 2, 3])
  //. Just([1, 2])
  //.
  //. > S.init([])
  //. Nothing()
  //. ```
  S.init = S.slice(0, -1);

  //# take :: Number -> [a] -> Maybe [a]
  //.
  //. Returns Just the first N elements of the given collection if N is
  //. greater than or equal to zero and less than or equal to the length
  //. of the collection; Nothing otherwise. Supports Array, String, and
  //. any other collection type which provides a `slice` method.
  //.
  //. ```javascript
  //. > S.take(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(["a", "b"])
  //.
  //. > S.take(4, 'abcdefg')
  //. Just("abcd")
  //.
  //. > S.take(4, ['a', 'b', 'c'])
  //. Nothing()
  //. ```
  S.take = R.curry(function(n, xs) {
    return n < 0 || R.eq(n, -0) ? Nothing() : slice(0, n, xs);
  });

  //# drop :: Number -> [a] -> Maybe [a]
  //.
  //. Returns Just all but the first N elements of the given collection
  //. if N is greater than or equal to zero and less than or equal to the
  //. length of the collection; Nothing otherwise. Supports Array, String,
  //. and any other collection type which provides a `slice` method.
  //.
  //. ```javascript
  //. > S.drop(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(["c", "d", "e"])
  //.
  //. > S.drop(4, 'abcdefg')
  //. Just("efg")
  //.
  //. > S.drop(4, 'abc')
  //. Nothing()
  //. ```
  S.drop = R.curry(function(n, xs) {
    return n < 0 || R.eq(n, -0) ? Nothing() : slice(n, -0, xs);
  });

  //# find :: (a -> Boolean) -> [a] -> Maybe a
  //.
  //. Takes a predicate and a list and returns Just the leftmost element of
  //. the list which satisfies the predicate; Nothing if none of the list's
  //. elements satisfies the predicate.
  //.
  //. ```javascript
  //. > S.find(function(n) { return n < 0; }, [1, -2, 3, -4, 5])
  //. Just(-2)
  //.
  //. > S.find(function(n) { return n < 0; }, [1, 2, 3, 4, 5])
  //. Nothing()
  //. ```
  S.find = R.curry(function(pred, xs) {
    for (var idx = 0, len = xs.length; idx < len; idx += 1) {
      if (pred(xs[idx])) {
        return Just(xs[idx]);
      }
    }
    return Nothing();
  });

  var sanctifyIndexOf = function(f) {
    return R.curry(R.compose(R.ifElse(R.gte(_, 0), Just, Nothing), f));
  };

  //# indexOf :: a -> [a] -> Maybe Number
  //.
  //. Takes a value of any type and a list, and returns Just the index
  //. of the first occurrence of the value in the list, if applicable;
  //. Nothing otherwise.
  //.
  //. ```javascript
  //. > S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Just(1)
  //.
  //. > S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Nothing()
  //. ```
  S.indexOf = sanctifyIndexOf(R.indexOf);

  //# lastIndexOf :: a -> [a] -> Maybe Number
  //.
  //. Takes a value of any type and a list, and returns Just the index
  //. of the last occurrence of the value in the list, if applicable;
  //. Nothing otherwise.
  //.
  //. ```javascript
  //. > S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Just(5)
  //.
  //. > S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Nothing()
  //. ```
  S.lastIndexOf = sanctifyIndexOf(R.lastIndexOf);

  //# pluck :: String -> [{String: *}] -> [Maybe *]
  //.
  //. Takes a list of objects and plucks the value of the specified key
  //. for each object in the list. Returns the value wrapped in a Just
  //. if an object has the key and a Nothing if it does not.
  //.
  //. ```javascript
  //. > S.pluck('a', [{a: 1, b: 2}, {a: 4, b: 5}, {b: 3, c: 7}])
  //. [Just(1), Just(4), Nothing()]
  //.
  //. > S.pluck('x', [{x: 1}, {x: 2}, {x: undefined}])
  //. [Just(1), Just(2), Just(undefined)]
  //. ```
  S.pluck = R.curry(function(key, xs) {
    return R.map(get(key), xs);
  });

  //. ### Object

  //# get :: String -> Object -> Maybe *
  //.
  //. Takes a property name and an object and returns Just the value of
  //. the specified property of the object if the object has such an own
  //. property; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.get('x', {x: 1, y: 2})
  //. Just(1)
  //.
  //. > S.get('toString', {x: 1, y: 2})
  //. Nothing()
  //. ```
  var get = S.get = R.ifElse(R.has, R.compose(Just, R.prop), Nothing);

  //# gets :: [String] -> Object -> Maybe *
  //.
  //. Takes a list of property names and an object and returns Just the
  //. value at the path specified by the list of property names if such
  //. a path exists; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.gets(['a', 'b', 'c'], {a: {b: {c: 42}}})
  //. Just(42)
  //.
  //. > S.gets(['a', 'b', 'c'], {})
  //. Nothing()
  //. ```
  S.gets = R.curry(function(keys, obj) {
    return R.reduce(function(acc, key) {
      return R.chain(get(key), acc);
    }, Just(obj), keys);
  });

  //. ### Parse

  //# parseDate :: String -> Maybe Date
  //.
  //. Takes a string and returns Just the date represented by the string
  //. if it does in fact represent a date; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseDate('2011-01-19T17:40:00Z')
  //. Just(new Date("2011-01-19T17:40:00.000Z"))
  //.
  //. > S.parseDate('today')
  //. Nothing()
  //. ```
  S.parseDate = R.curry(function(s) {
    var d = new Date(s);
    return d.valueOf() === d.valueOf() ? Just(d) : Nothing();
  });

  //# parseFloat :: String -> Maybe Number
  //.
  //. Takes a string and returns Just the number represented by the string
  //. if it does in fact represent a number; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseFloat('-123.45')
  //. Just(-123.45)
  //.
  //. > S.parseFloat('foo.bar')
  //. Nothing()
  //. ```
  S.parseFloat = R.curry(function(s) {
    var n = parseFloat(s);
    return n === n ? Just(n) : Nothing();
  });

  //# parseInt :: Number -> String -> Maybe Number
  //.
  //. Takes a radix (an integer between 2 and 36 inclusive) and a string,
  //. and returns Just the number represented by the string if it does in
  //. fact represent a number in the base specified by the radix; Nothing
  //. otherwise.
  //.
  //. ```javascript
  //. > S.parseInt(16, '0xFF')
  //. Just(255)
  //.
  //. > S.parseInt(16, '0xGG')
  //. Nothing()
  //. ```
  S.parseInt = R.curry(function(radix, s) {
    var n = parseInt(s, radix);
    return n === n ? Just(n) : Nothing();
  });

  //# parseJson :: String -> Maybe *
  //.
  //. Takes a string which may or may not be valid JSON, and returns Just
  //. the result of applying `JSON.parse` to the string if valid; Nothing
  //. otherwise.
  //.
  //. ```javascript
  //. > S.parseJson('["foo","bar","baz"]')
  //. Just(["foo", "bar", "baz"])
  //.
  //. > S.parseJson('[')
  //. Nothing()
  //. ```
  S.parseJson = encase(function(s) {
    return JSON.parse(s);
  });

  //. ### RegExp

  //# match :: RegExp -> String -> Maybe [Maybe String]
  //.
  //. Takes a pattern and a string, and returns Just a list of matches
  //. if the pattern matches the string; Nothing otherwise. Each match
  //. has type `Maybe String`, where a Nothing represents an unmatched
  //. optional capturing group.
  //.
  //. ```javascript
  //. > S.match(/(good)?bye/, 'goodbye')
  //. Just([Just("goodbye"), Just("good")])
  //.
  //. > S.match(/(good)?bye/, 'bye')
  //. Just([Just("bye"), Nothing()])
  //. ```
  S.match = R.curry(R.compose(R.map(R.map(S.toMaybe)), S.toMaybe, R.match));

}.call(this));

//. [Monad]:        https://github.com/fantasyland/fantasy-land#monad
//. [Monoid]:       https://github.com/fantasyland/fantasy-land#monoid
//. [R.map]:        http://ramdajs.com/docs/#map
//. [Ramda]:        http://ramdajs.com/
//. [SameValue]:    http://ecma-international.org/ecma-262/5.1/#sec-9.12
//. [Semigroup]:    https://github.com/fantasyland/fantasy-land#semigroup
