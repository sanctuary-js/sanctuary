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
//. Sanctuary is a functional programming library inspired by Haskell and
//. PureScript. It depends on and works nicely with [Ramda][]. Sanctuary
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
//.     R.map(S.toUpper, S.head(words))
//.
//. Sanctuary is designed to work in Node.js and in ES5-compatible browsers.
//.
//. ## Types
//.
//. Sanctuary uses Haskell-like type signatures to describe the types of
//. values, including functions. `'foo'`, for example, is a member of `String`;
//. `[1, 2, 3]` is a member of `Array Number`. The double colon (`::`) is used
//. to mean "is a member of", so one could write:
//.
//.     'foo' :: String
//.     [1, 2, 3] :: Array Number
//.
//. An identifier may appear to the left of the double colon:
//.
//.     Math.PI :: Number
//.
//. The arrow (`->`) is used to express a function's type:
//.
//.     Math.abs :: Number -> Number
//.
//. That states that `Math.abs` is a unary function which takes an argument
//. of type `Number` and returns a value of type `Number`.
//.
//. Some functions are parametrically polymorphic: their types are not fixed.
//. Type variables are used in the representations of such functions:
//.
//.     S.I :: a -> a
//.
//. `a` is a type variable. Type variables are not capitalized, so they
//. are differentiable from type identifiers (which are always capitalized).
//. By convention type variables have single-character names. The signature
//. above states that `S.I` takes a value of any type and returns a value of
//. the same type. Some signatures feature multiple type variables:
//.
//.     S.K :: a -> b -> a
//.
//. It must be possible to replace all occurrences of `a` with a concrete type.
//. The same applies for each other type variable. For the function above, the
//. types with which `a` and `b` are replaced may be different, but needn't be.
//.
//. Since all Sanctuary functions are curried (they accept their arguments
//. one at a time), a binary function is represented as a unary function which
//. returns a unary function: `* -> * -> *`. This aligns neatly with Haskell,
//. which uses curried functions exclusively. In JavaScript, though, we may
//. wish to represent the types of functions with arities less than or greater
//. than one. The general form is `(<input-types>) -> <output-type>`, where
//. `<input-types>` comprises zero or more comma–space (<code>, </code>)
//. -separated type representations:
//.
//.   - `() -> String`
//.   - `(a, b) -> a`
//.   - `(a, b, c) -> d`
//.
//. `Number -> Number` can thus be seen as shorthand for `(Number) -> Number`.
//.
//. The question mark (`?`) is used to represent types which include `null`
//. and `undefined` as members. `String?`, for example, represents the type
//. comprising `null`, `undefined`, and all strings.
//.
//. Sanctuary embraces types. JavaScript doesn't support algebraic data types,
//. but these can be simulated by providing a group of data constructors which
//. return values with the same set of methods. A value of the Either type, for
//. example, is created via the Left constructor or the Right constructor.
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
//. The squiggly arrow is also used when representing non-function properties.
//. `Maybe a ~> Boolean`, for example, represents a Boolean property of a value
//. of type `Maybe a`.
//.
//. Sanctuary supports type classes: constraints on type variables. Whereas
//. `a -> a` implicitly supports every type, `Functor f => (a -> b) -> f a ->
//. f b` requires that `f` be a type which satisfies the requirements of the
//. Functor type class. Type-class constraints appear at the beginning of a
//. type signature, separated from the rest of the signature by a fat arrow
//. (`=>`).
//.
//. ### Accessible pseudotype
//.
//. What is the type of values which support property access? In other words,
//. what is the type of which every value except `null` and `undefined` is a
//. member? Object is close, but `Object.create(null)` produces a value which
//. supports property access but which is not a member of the Object type.
//.
//. Sanctuary uses the Accessible pseudotype to represent the set of values
//. which support property access.
//.
//. ### Integer pseudotype
//.
//. The Integer pseudotype represents integers in the range (-2^53 .. 2^53).
//. It is a pseudotype because each Integer is represented by a Number value.
//. Sanctuary's run-time type checking asserts that a valid Number value is
//. provided wherever an Integer value is required.
//.
//. ### Type representatives
//.
//. What is the type of `Number`? One answer is `a -> Number`, since it's a
//. function which takes an argument of any type and returns a Number value.
//. When provided as the first argument to [`is`](#is), though, `Number` is
//. really the value-level representative of the Number type.
//.
//. Sanctuary uses the TypeRep pseudotype to describe type representatives.
//. For example:
//.
//.     Number :: TypeRep Number
//.
//. `Number` is the sole inhabitant of the TypeRep Number type.
//.
//. ## Type checking
//.
//. Sanctuary functions are defined via [sanctuary-def][] to provide run-time
//. type checking. This is tremendously useful during development: type errors
//. are reported immediately, avoiding circuitous stack traces (at best) and
//. silent failures due to type coercion (at worst). For example:
//.
//. ```javascript
//. S.inc('XXX');
//. // ! TypeError: Invalid value
//. //
//. //   inc :: FiniteNumber -> FiniteNumber
//. //          ^^^^^^^^^^^^
//. //               1
//. //
//. //   1)  "XXX" :: String
//. //
//. //   The value at position 1 is not a member of ‘FiniteNumber’.
//. ```
//.
//. Compare this to the behaviour of Ramda's unchecked equivalent:
//.
//. ```javascript
//. R.inc('XXX');
//. // => NaN
//. ```
//.
//. There is a performance cost to run-time type checking. One may wish to
//. disable type checking in certain contexts to avoid paying this cost.
//. [`create`](#create) facilitates the creation of a Sanctuary module which
//. does not perform type checking.
//.
//. In Node, one could use an environment variable to determine whether to
//. perform type checking:
//.
//. ```javascript
//. const {create, env} = require('sanctuary');
//.
//. const checkTypes = process.env.NODE_ENV !== 'production';
//. const S = create({checkTypes: checkTypes, env: env});
//. ```
//.
//. ## API

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f(require('ramda'), require('sanctuary-def'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['ramda', 'sanctuary-def'], f);
  } else {
    self.sanctuary = f(self.R, self.sanctuaryDef);
  }

}(function(R, $) {

  'use strict';

  var sentinel = {};

  var _slice = Array.prototype.slice;
  var _toString = Object.prototype.toString;

  //  filter :: (Monad m, Monoid (m a)) => (a -> Boolean, m a) -> m a
  var filter = function(pred, m) {
    return m.chain(function(x) {
      return pred(x) ? m.of(x) : m.empty();
    });
  };

  //  hasMethod :: String -> a -> Boolean
  var hasMethod = function(name) {
    return function(x) {
      return x != null && typeof x[name] === 'function';
    };
  };

  //  negativeZero :: a -> Boolean
  var negativeZero = R.either(R.equals(-0), R.equals(new Number(-0)));

  //  uncurry2 :: (a -> b -> c) -> ((a, b) -> c)
  var uncurry2 = function(f) {
    return function(x, y) {
      return f(x)(y);
    };
  };

  //  uncurry3 :: (a -> b -> c -> d) -> ((a, b, c) -> d)
  var uncurry3 = function(f) {
    return function(x, y, z) {
      return f(x)(y)(z);
    };
  };

  //  Accessible :: TypeClass
  var Accessible = $.TypeClass(
    'sanctuary/Accessible',
    function(x) { return x != null; }
  );

  //  Applicative :: TypeClass
  var Applicative = $.TypeClass(
    'sanctuary/Applicative',
    function(x) {
      return R.type(x) === 'Array' ||
             Apply._test(x) && (hasMethod('of')(x) ||
                                hasMethod('of')(x.constructor));
    }
  );

  //  Apply :: TypeClass
  var Apply = $.TypeClass(
    'sanctuary/Apply',
    function(x) {
      return R.contains(R.type(x), ['Array', 'Function']) ||
             Functor._test(x) && hasMethod('ap')(x);
    }
  );

  //  Foldable :: TypeClass
  var Foldable = $.TypeClass(
    'sanctuary/Foldable',
    function(x) {
      return R.type(x) === 'Array' || hasMethod('reduce')(x);
    }
  );

  //  Functor :: TypeClass
  var Functor = $.TypeClass(
    'sanctuary/Functor',
    function(x) {
      return R.contains(R.type(x), ['Array', 'Function']) ||
             hasMethod('map')(x);
    }
  );

  //  Ord :: TypeClass
  var Ord = $.TypeClass(
    'sanctuary/Ord',
    R.anyPass([$.String._test, $.ValidDate._test, $.ValidNumber._test])
  );

  //  Semigroup :: TypeClass
  var Semigroup = $.TypeClass(
    'sanctuary/Semigroup',
    hasMethod('concat')
  );

  var a = $.TypeVariable('a');
  var b = $.TypeVariable('b');
  var c = $.TypeVariable('c');
  var d = $.TypeVariable('d');
  var f = $.TypeVariable('f');
  var l = $.TypeVariable('l');
  var r = $.TypeVariable('r');

  //  $Either :: Type -> Type -> Type
  var $Either = $.BinaryType(
    'sanctuary/Either',
    function(x) { return x != null && x['@@type'] === 'sanctuary/Either'; },
    function(either) { return either.isLeft ? [either.value] : []; },
    function(either) { return either.isRight ? [either.value] : []; }
  );

  //  List :: Type -> Type
  var List = $.UnaryType(
    'sanctuary/List',
    function(x) {
      return R.contains(R.type(x), ['Array', 'String']);
    },
    function(list) {
      return R.type(list) === 'String' ? [] : _slice.call(list);
    }
  );

  //  $Maybe :: Type -> Type
  var $Maybe = $.UnaryType(
    'sanctuary/Maybe',
    function(x) { return x != null && x['@@type'] === 'sanctuary/Maybe'; },
    function(maybe) { return maybe.isJust ? [maybe.value] : []; }
  );

  //  TypeRep :: Type
  var TypeRep = $.NullaryType(
    'sanctuary/TypeRep',
    function(x) {
      return R.type(x) === 'Function' ||
             (x != null &&
              R.type(x.name) === 'String' &&
              R.type(x.test) === 'Function');
    }
  );

  //  defaultEnv :: Array Type
  var defaultEnv = $.env.concat([
    $.FiniteNumber,
    $.NonZeroFiniteNumber,
    $Either,
    $.Integer,
    $Maybe,
    $.Pair,
    $.RegexFlags,
    TypeRep,
    $.ValidDate,
    $.ValidNumber
  ]);

  //  Options :: Type
  var Options = $.RecordType({checkTypes: $.Boolean, env: $.Array($.Any)});

  //  createSanctuary :: Options -> Module
  var createSanctuary = function createSanctuary(opts) {

  /* eslint-disable indent */

  var S = {EitherType: $Either, MaybeType: $Maybe};

  //# create :: { checkTypes :: Boolean, env :: Array Type } -> Module
  //.
  //. Takes an options record and returns a Sanctuary module. `checkTypes`
  //. specifies whether to enable type checking. The module's polymorphic
  //. functions (such as [`I`](#I)) require each value associated with a
  //. type variable to be a member of at least one type in the environment.
  //.
  //. A well-typed application of a Sanctuary function will produce the same
  //. result regardless of whether type checking is enabled. If type checking
  //. is enabled, a badly typed application will produce an exception with a
  //. descriptive error message.
  //.
  //. The following snippet demonstrates defining a custom type and using
  //. `create` to produce a Sanctuary module which is aware of that type:
  //.
  //. ```javascript
  //. const {create, env} = require('sanctuary');
  //. const $ = require('sanctuary-def');
  //.
  //. //    identityTypeName :: String
  //. const identityTypeName = 'my-package/Identity';
  //.
  //. //    Identity :: a -> Identity a
  //. const Identity = function Identity(x) {
  //.   return {
  //.     '@@type': identityTypeName,
  //.     map: f => Identity(f(x)),
  //.     chain: f => f(x),
  //.     // ...
  //.     value: x,
  //.   };
  //. };
  //.
  //. //    isIdentity :: a -> Boolean
  //. const isIdentity = x => x != null && x['@@type'] === identityTypeName;
  //.
  //. //    identityToArray :: Identity a -> Array a
  //. const identityToArray = identity => [identity.value];
  //.
  //. //    IdentityType :: Type
  //. const IdentityType =
  //. $.UnaryType(identityTypeName, isIdentity, identityToArray);
  //.
  //. const S = create({
  //.   checkTypes: process.env.NODE_ENV !== 'production',
  //.   env: env.concat([IdentityType]),
  //. });
  //. ```
  //.
  //. See also [`env`](#env).
  S.create =
  $.create({checkTypes: opts.checkTypes, env: defaultEnv})('create',
                                                           {},
                                                           [Options, $.Object],
                                                           createSanctuary);

  //# env :: Array Type
  //.
  //. The default environment, which may be used as is or as the basis of a
  //. custom environment in conjunction with [`create`](#create).
  S.env = defaultEnv;

  var def = $.create(opts);

  //  Note: Type checking of method arguments takes place once all arguments
  //  have been provided (whereas function arguments are checked as early as
  //  possible). This is not ideal, but provides two benefits:
  //
  //    - accurate type signatures in error messages (though "->" appears in
  //      place of "~>"); and
  //
  //    - intuitive ordering (`a.m(b, c)` is checked in a-b-c order rather
  //      than b-c-a order).
  var method = function(name, constraints, types, _f) {
    var f = def(name, constraints, types, _f);
    return def(name,
               constraints,
               R.repeat($.Any, types.length - 1),
               function() {
                 var args = _slice.call(arguments);
                 args.unshift(this);
                 return f.apply(null, args);
               });
  };

  //. ### Classify

  //# type :: a -> String
  //.
  //. Takes a value, `x`, of any type and returns its type identifier:
  //.
  //.   - `x['@@type']` if `x` has a `'@@type'` property whose value is
  //.     a string; otherwise
  //.
  //.   - the [`Object#toString`][Object#toString] representation of `x`
  //.     sans the leading `'[object '` and trailing `']'`.
  //.
  //. `'@@type'` properties should use the form `'<package-name>/<type-name>'`,
  //. where `<package-name>` is the name of the npm package in which the type
  //. is defined.
  //.
  //. ```javascript
  //. > S.type(S.Just(42))
  //. 'sanctuary/Maybe'
  //.
  //. > S.type([1, 2, 3])
  //. 'Array'
  //. ```
  function type(x) {
    return x != null && _toString.call(x['@@type']) === '[object String]' ?
      x['@@type'] :
      _toString.call(x).slice('[object '.length, -']'.length);
  }
  S.type = def('type', {}, [$.Any, $.String], type);

  //# is :: TypeRep a -> b -> Boolean
  //.
  //. Takes a [type representative](#type-representatives) and a value of
  //. any type and returns `true` if the given value is of the specified
  //. type; `false` otherwise. Subtyping is not respected.
  //.
  //. ```javascript
  //. > S.is(Number, 42)
  //. true
  //.
  //. > S.is(Object, 42)
  //. false
  //.
  //. > S.is(String, 42)
  //. false
  //. ```
  function is(typeRep, x) {
    if (_toString.call(typeRep.prototype['@@type']) === '[object String]') {
      return x != null && x['@@type'] === typeRep.prototype['@@type'];
    } else {
      var match = /function (\w*)/.exec(typeRep);
      return match != null && match[1] === type(x);
    }
  }
  S.is = def('is', {}, [TypeRep, $.Any, $.Boolean], is);

  //. ### Combinator

  //# I :: a -> a
  //.
  //. The I combinator. Returns its argument. Equivalent to Haskell's `id`
  //. function.
  //.
  //. ```javascript
  //. > S.I('foo')
  //. 'foo'
  //. ```
  function I(x) {
    return x;
  }
  S.I = def('I', {}, [a, a], I);

  //# K :: a -> b -> a
  //.
  //. The K combinator. Takes two values and returns the first. Equivalent to
  //. Haskell's `const` function.
  //.
  //. ```javascript
  //. > S.K('foo', 'bar')
  //. 'foo'
  //.
  //. > R.map(S.K(42), R.range(0, 5))
  //. [42, 42, 42, 42, 42]
  //. ```
  function K(x, y) {
    return x;
  }
  S.K = def('K', {}, [a, b, a], K);

  //# A :: (a -> b) -> a -> b
  //.
  //. The A combinator. Takes a function and a value, and returns the result
  //. of applying the function to the value. Equivalent to Haskell's `($)`
  //. function.
  //.
  //. ```javascript
  //. > S.A(S.inc, 42)
  //. 43
  //.
  //. > R.map(S.A(R.__, 100), [S.inc, Math.sqrt])
  //. [101, 10]
  //. ```
  function A(f, x) {
    return f(x);
  }
  S.A = def('A', {}, [$.Function, a, b], A);

  //# T :: a -> (a -> b) -> b
  //.
  //. The T ([thrush][]) combinator. Takes a value and a function, and returns
  //. the result of applying the function to the value. Equivalent to Haskell's
  //. `(&)` function.
  //.
  //. ```javascript
  //. > S.T(42, S.inc)
  //. 43
  //.
  //. > R.map(S.T(100), [S.inc, Math.sqrt])
  //. [101, 10]
  //. ```
  function T(x, f) {
    return f(x);
  }
  S.T = def('T', {}, [a, $.Function, b], T);

  //# C :: (a -> b -> c) -> b -> a -> c
  //.
  //. The C combinator. Takes a curried binary function and two values, and
  //. returns the result of applying the function to the values in reverse
  //. order. Equivalent to Haskell's `flip` function.
  //.
  //. This function is very similar to [`flip`](#flip), except that its first
  //. argument must be curried. This allows it to work with manually curried
  //. functions.
  //.
  //. ```javascript
  //. > S.C(S.concat, 'foo', 'bar')
  //. 'barfoo'
  //.
  //. > R.filter(S.C(R.gt, 0), [-1, -2, 3, -4, 4, 2])
  //. [3, 4, 2]
  //. ```
  function C(f, x, y) {
    return f(y)(x);
  }
  S.C = def('C', {}, [$.Function, b, a, c], C);

  //# B :: (b -> c) -> (a -> b) -> a -> c
  //.
  //. The B combinator. Takes two functions and a value, and returns the
  //. result of applying the first function to the result of applying the
  //. second to the value. Equivalent to [`compose`](#compose) and Haskell's
  //. `(.)` function.
  //.
  //. ```javascript
  //. > S.B(Math.sqrt, S.inc, 99)
  //. 10
  //. ```
  function B(f, g, x) {
    return f(g(x));
  }
  S.B = def('B', {}, [$.Function, $.Function, a, c], B);

  //# S :: (a -> b -> c) -> (a -> b) -> a -> c
  //.
  //. The S combinator. Takes a curried binary function, a unary function,
  //. and a value, and returns the result of applying the binary function to:
  //.
  //.   - the value; and
  //.   - the result of applying the unary function to the value.
  //.
  //. ```javascript
  //. > S.S(S.add, Math.sqrt, 100)
  //. 110
  //. ```
  function S_(f, g, x) {
    return f(x)(g(x));
  }
  S.S = def('S', {}, [$.Function, $.Function, a, c], S_);

  //. ### Function

  //# flip :: ((a, b) -> c) -> b -> a -> c
  //.
  //. Takes a binary function and two values, and returns the result of
  //. applying the function to the values in reverse order.
  //.
  //. See also [`C`](#C).
  //.
  //. ```javascript
  //. > R.map(S.flip(Math.pow)(2), [1, 2, 3, 4, 5])
  //. [1, 4, 9, 16, 25]
  //. ```
  function flip(f, x, y) {
    return f(y, x);
  }
  S.flip = def('flip', {}, [$.Function, b, a, c], flip);

  //# lift :: Functor f => (a -> b) -> f a -> f b
  //.
  //. Promotes a unary function to a function which operates on a [Functor][].
  //.
  //. ```javascript
  //. > S.lift(S.inc, S.Just(2))
  //. Just(3)
  //.
  //. > S.lift(S.inc, S.Nothing)
  //. Nothing
  //. ```
  S.lift =
  def('lift',
      {a: [Functor], b: [Functor]},
      [$.Function, a, b],
      R.map);

  //# lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
  //.
  //. Promotes a curried binary function to a function which operates on two
  //. [Apply][]s.
  //.
  //. ```javascript
  //. > S.lift2(S.add, S.Just(2), S.Just(3))
  //. Just(5)
  //.
  //. > S.lift2(S.add, S.Just(2), S.Nothing)
  //. Nothing
  //.
  //. > S.lift2(S.and, S.Just(true), S.Just(true))
  //. Just(true)
  //.
  //. > S.lift2(S.and, S.Just(true), S.Just(false))
  //. Just(false)
  //. ```
  function lift2(f, x, y) {
    return R.ap(R.map(f, x), y);
  }
  S.lift2 =
  def('lift2',
      {a: [Apply], b: [Apply], c: [Apply]},
      [$.Function, a, b, c],
      lift2);

  //# lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
  //.
  //. Promotes a curried ternary function to a function which operates on three
  //. [Apply][]s.
  //.
  //. ```javascript
  //. > S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Just([1, 2, 3]))
  //. Just(6)
  //.
  //. > S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Nothing)
  //. Nothing
  //. ```
  function lift3(f, x, y, z) {
    return R.ap(R.ap(R.map(f, x), y), z);
  }
  S.lift3 =
  def('lift3',
      {a: [Apply], b: [Apply], c: [Apply], d: [Apply]},
      [$.Function, a, b, c, d],
      lift3);

  //. ### Composition

  //# compose :: (b -> c) -> (a -> b) -> a -> c
  //.
  //. Takes two functions assumed to be unary and a value of any type,
  //. and returns the result of applying the first function to the result
  //. of applying the second function to the given value.
  //.
  //. In general terms, `compose` performs right-to-left composition of two
  //. unary functions.
  //.
  //. See also [`B`](#B) and [`pipe`](#pipe).
  //.
  //. ```javascript
  //. > S.compose(Math.sqrt, S.inc)(99)
  //. 10
  //. ```
  S.compose = def('compose', {}, [$.Function, $.Function, a, c], B);

  //# pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n
  //.
  //. Takes an array of functions assumed to be unary and a value of any type,
  //. and returns the result of applying the sequence of transformations to
  //. the initial value.
  //.
  //. In general terms, `pipe` performs left-to-right composition of an array
  //. of functions. `pipe([f, g, h], x)` is equivalent to `h(g(f(x)))`.
  //.
  //. ```javascript
  //. > S.pipe([S.inc, Math.sqrt, S.dec])(99)
  //. 9
  //. ```
  function pipe(fs, x) {
    return fs.reduce(function(x, f) { return f(x); }, x);
  }
  S.pipe = def('pipe', {}, [$.Array($.Function), a, b], pipe);

  //. ### Maybe type
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either a Just whose value is of type `a` or Nothing (with no value).
  //.
  //. The Maybe type satisfies the [Monoid][], [Monad][], [Traversable][],
  //. and [Extend][] specifications.

  //# MaybeType :: Type -> Type
  //.
  //. A [`UnaryType`][UnaryType] for use with [sanctuary-def][].

  //# Maybe :: TypeRep Maybe
  //.
  //. The [type representative](#type-representatives) for the Maybe type.
  function Maybe(x, tag, value) {
    if (x !== sentinel) throw new Error('Cannot instantiate Maybe');
    this.isNothing = tag === 'Nothing';
    this.isJust = tag === 'Just';
    if (this.isJust) this.value = value;
  }
  S.Maybe = Maybe;

  //# Maybe.empty :: -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > S.Maybe.empty()
  //. Nothing
  //. ```
  function Maybe$empty() {
    return Nothing;
  }
  Maybe.empty = def('Maybe.empty', {}, [$Maybe(a)], Maybe$empty);

  //# Maybe.of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Maybe.of(42)
  //. Just(42)
  //. ```
  Maybe.of = def('Maybe.of', {}, [a, $Maybe(a)], Just);

  //# Maybe#@@type :: Maybe a ~> String
  //.
  //. Maybe type identifier, `'sanctuary/Maybe'`.
  Maybe.prototype['@@type'] = 'sanctuary/Maybe';

  //# Maybe#isNothing :: Maybe a ~> Boolean
  //.
  //. `true` if `this` is Nothing; `false` if `this` is a Just.
  //.
  //. ```javascript
  //. > S.Nothing.isNothing
  //. true
  //.
  //. > S.Just(42).isNothing
  //. false
  //. ```

  //# Maybe#isJust :: Maybe a ~> Boolean
  //.
  //. `true` if `this` is a Just; `false` if `this` is Nothing.
  //.
  //. ```javascript
  //. > S.Just(42).isJust
  //. true
  //.
  //. > S.Nothing.isJust
  //. false
  //. ```

  //# Maybe#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
  //.
  //. Takes a value of type `Maybe a` and returns Nothing unless `this`
  //. is a Just *and* the argument is a Just, in which case it returns a
  //. Just whose value is the result of of applying this Just's value to
  //. the given Just's value.
  //.
  //. ```javascript
  //. > S.Nothing.ap(S.Just(42))
  //. Nothing
  //.
  //. > S.Just(S.inc).ap(S.Nothing)
  //. Nothing
  //.
  //. > S.Just(S.inc).ap(S.Just(42))
  //. Just(43)
  //. ```
  function Maybe$prototype$ap(self, other) {
    return self.isJust ? other.map(self.value) : self;
  }
  Maybe.prototype.ap =
  method('Maybe#ap',
         {},
         [$Maybe($.Function), $Maybe(a), $Maybe(b)],
         Maybe$prototype$ap);

  //# Maybe#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns the result of applying the function to this Just's value.
  //.
  //. ```javascript
  //. > S.Nothing.chain(S.parseFloat)
  //. Nothing
  //.
  //. > S.Just('xxx').chain(S.parseFloat)
  //. Nothing
  //.
  //. > S.Just('12.34').chain(S.parseFloat)
  //. Just(12.34)
  //. ```
  function Maybe$prototype$chain(self, f) {
    return self.isJust ? f(self.value) : self;
  }
  Maybe.prototype.chain =
  method('Maybe#chain',
         {},
         [$Maybe(a), $.Function, $Maybe(b)],
         Maybe$prototype$chain);

  //# Maybe#concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
  //.
  //. Returns the result of concatenating two Maybe values of the same type.
  //. `a` must have a [Semigroup][] (indicated by the presence of a `concat`
  //. method).
  //.
  //. If `this` is Nothing and the argument is Nothing, this method returns
  //. Nothing.
  //.
  //. If `this` is a Just and the argument is a Just, this method returns a
  //. Just whose value is the result of concatenating this Just's value and
  //. the given Just's value.
  //.
  //. Otherwise, this method returns the Just.
  //.
  //. ```javascript
  //. > S.Nothing.concat(S.Nothing)
  //. Nothing
  //.
  //. > S.Just([1, 2, 3]).concat(S.Just([4, 5, 6]))
  //. Just([1, 2, 3, 4, 5, 6])
  //.
  //. > S.Nothing.concat(S.Just([1, 2, 3]))
  //. Just([1, 2, 3])
  //.
  //. > S.Just([1, 2, 3]).concat(S.Nothing)
  //. Just([1, 2, 3])
  //. ```
  function Maybe$prototype$concat(self, other) {
    return self.isNothing ?
      other :
      other.isNothing ? self : Just(self.value.concat(other.value));
  }
  Maybe.prototype.concat =
  method('Maybe#concat',
         {a: [Semigroup]},
         [$Maybe(a), $Maybe(a), $Maybe(a)],
         Maybe$prototype$concat);

  //# Maybe#empty :: Maybe a ~> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > S.Just(42).empty()
  //. Nothing
  //. ```
  Maybe.prototype.empty = def('Maybe#empty', {}, [$Maybe(a)], Maybe.empty);

  //# Maybe#equals :: Maybe a ~> b -> Boolean
  //.
  //. Takes a value of any type and returns `true` if:
  //.
  //.   - it is Nothing and `this` is Nothing; or
  //.
  //.   - it is a Just and `this` is a Just, and their values are equal
  //.     according to [`R.equals`][R.equals].
  //.
  //. ```javascript
  //. > S.Nothing.equals(S.Nothing)
  //. true
  //.
  //. > S.Nothing.equals(null)
  //. false
  //.
  //. > S.Just([1, 2, 3]).equals(S.Just([1, 2, 3]))
  //. true
  //.
  //. > S.Just([1, 2, 3]).equals(S.Just([3, 2, 1]))
  //. false
  //.
  //. > S.Just([1, 2, 3]).equals(S.Nothing)
  //. false
  //. ```
  function Maybe$prototype$equals(self, x) {
    return type(x) === 'sanctuary/Maybe' &&
           (self.isNothing ? x.isNothing
                           : x.isJust && R.equals(x.value, self.value));
  }
  Maybe.prototype.equals =
  method('Maybe#equals',
         {},
         [$Maybe(a), b, $.Boolean],
         Maybe$prototype$equals);

  //# Maybe#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to `this`.
  //.
  //. ```javascript
  //. > S.Nothing.extend(x => x.value + 1)
  //. Nothing
  //.
  //. > S.Just(42).extend(x => x.value + 1)
  //. Just(43)
  //. ```
  function Maybe$prototype$extend(self, f) {
    return self.isJust ? Just(f(self)) : self;
  }
  Maybe.prototype.extend =
  method('Maybe#extend',
         {},
         [$Maybe(a), $.Function, $Maybe(a)],
         Maybe$prototype$extend);

  //# Maybe#filter :: Maybe a ~> (a -> Boolean) -> Maybe a
  //.
  //. Takes a predicate and returns `this` if `this` is a Just whose value
  //. satisfies the predicate; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.Just(42).filter(n => n % 2 === 0)
  //. Just(42)
  //.
  //. > S.Just(43).filter(n => n % 2 === 0)
  //. Nothing
  //. ```
  function Maybe$prototype$filter(self, pred) {
    return filter(pred, self);
  }
  Maybe.prototype.filter =
  method('Maybe#filter',
         {},
         [$Maybe(a), $.Function, $Maybe(a)],
         Maybe$prototype$filter);

  //# Maybe#map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to this Just's value.
  //.
  //. ```javascript
  //. > S.Nothing.map(S.inc)
  //. Nothing
  //.
  //. > S.Just([1, 2, 3]).map(S.sum)
  //. Just(6)
  //. ```
  function Maybe$prototype$map(self, f) {
    return self.isJust ? Just(f(self.value)) : self;
  }
  Maybe.prototype.map =
  method('Maybe#map',
         {},
         [$Maybe(a), $.Function, $Maybe(b)],
         Maybe$prototype$map);

  //# Maybe#of :: Maybe a ~> b -> Maybe b
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Nothing.of(42)
  //. Just(42)
  //. ```
  Maybe.prototype.of = def('Maybe#of', {}, [b, $Maybe(b)], Just);

  //# Maybe#reduce :: Maybe a ~> ((b, a) -> b) -> b -> b
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is Nothing; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Just's value.
  //.
  //. ```javascript
  //. > S.Nothing.reduce(S.add, 10)
  //. 10
  //.
  //. > S.Just(5).reduce(S.add, 10)
  //. 15
  //. ```
  function Maybe$prototype$reduce(self, f, x) {
    return self.isJust ? f(x, self.value) : x;
  }
  Maybe.prototype.reduce =
  method('Maybe#reduce',
         {},
         [$Maybe(a), $.Function, b, b],
         Maybe$prototype$reduce);

  //# Maybe#sequence :: Applicative f => Maybe (f a) ~> (a -> f a) -> f (Maybe a)
  //.
  //. Evaluates an applicative action contained within the Maybe, resulting in:
  //.
  //.   - a pure applicative of Nothing if `this` is Nothing; otherwise
  //.
  //.   - an applicative of Just the value of the evaluated action.
  //.
  //. ```javascript
  //. > S.Nothing.sequence(S.Either.of)
  //. Right(Nothing)
  //.
  //. > S.Just(S.Right(42)).sequence(S.Either.of)
  //. Right(Just(42))
  //.
  //. > S.Just(S.Left('Cannot divide by zero')).sequence(S.Either.of)
  //. Left('Cannot divide by zero')
  //. ```
  function Maybe$prototype$sequence(self, of) {
    return self.isJust ? R.map(Just, self.value) : of(self);
  }
  Maybe.prototype.sequence =
  method('Maybe#sequence',
         {a: [Applicative], b: [Applicative]},
         [$Maybe(a), $.Function, b],
         Maybe$prototype$sequence);

  //# Maybe#toString :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe.
  //.
  //. ```javascript
  //. > S.Nothing.toString()
  //. 'Nothing'
  //.
  //. > S.Just([1, 2, 3]).toString()
  //. 'Just([1, 2, 3])'
  //. ```
  function Maybe$prototype$toString(self) {
    return self.isJust ? 'Just(' + R.toString(self.value) + ')' : 'Nothing';
  }
  Maybe.prototype.toString =
  method('Maybe#toString',
         {},
         [$Maybe(a), $.String],
         Maybe$prototype$toString);

  //# Maybe#inspect :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe. This method is used by
  //. `util.inspect` and the REPL to format a Maybe for display.
  //.
  //. See also [`Maybe#toString`](#Maybe.prototype.toString).
  //.
  //. ```javascript
  //. > S.Nothing.inspect()
  //. 'Nothing'
  //.
  //. > S.Just([1, 2, 3]).inspect()
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.inspect = function() { return this.toString(); };

  //# Nothing :: Maybe a
  //.
  //. Nothing.
  //.
  //. ```javascript
  //. > S.Nothing
  //. Nothing
  //. ```
  var Nothing = S.Nothing = new Maybe(sentinel, 'Nothing');

  //# Just :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Just(42)
  //. Just(42)
  //. ```
  function Just(x) {
    return new Maybe(sentinel, 'Just', x);
  }
  S.Just = def('Just', {}, [a, $Maybe(a)], Just);

  //# isNothing :: Maybe a -> Boolean
  //.
  //. Returns `true` if the given Maybe is Nothing; `false` if it is a Just.
  //.
  //. ```javascript
  //. > S.isNothing(S.Nothing)
  //. true
  //.
  //. > S.isNothing(S.Just(42))
  //. false
  //. ```
  function isNothing(maybe) {
    return maybe.isNothing;
  }
  S.isNothing = def('isNothing', {}, [$Maybe(a), $.Boolean], isNothing);

  //# isJust :: Maybe a -> Boolean
  //.
  //. Returns `true` if the given Maybe is a Just; `false` if it is Nothing.
  //.
  //. ```javascript
  //. > S.isJust(S.Just(42))
  //. true
  //.
  //. > S.isJust(S.Nothing)
  //. false
  //. ```
  function isJust(maybe) {
    return maybe.isJust;
  }
  S.isJust = def('isJust', {}, [$Maybe(a), $.Boolean], isJust);

  //# fromMaybe :: a -> Maybe a -> a
  //.
  //. Takes a default value and a Maybe, and returns the Maybe's value
  //. if the Maybe is a Just; the default value otherwise.
  //.
  //. See also [`maybeToNullable`](#maybeToNullable).
  //.
  //. ```javascript
  //. > S.fromMaybe(0, S.Just(42))
  //. 42
  //.
  //. > S.fromMaybe(0, S.Nothing)
  //. 0
  //. ```
  function fromMaybe(x, maybe) {
    return maybe.isJust ? maybe.value : x;
  }
  S.fromMaybe = def('fromMaybe', {}, [a, $Maybe(a), a], fromMaybe);

  //# maybeToNullable :: Maybe a -> Nullable a
  //.
  //. Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
  //. [Nullable][] is defined in sanctuary-def.
  //.
  //. See also [`fromMaybe`](#fromMaybe).
  //.
  //. ```javascript
  //. > S.maybeToNullable(S.Just(42))
  //. 42
  //.
  //. > S.maybeToNullable(S.Nothing)
  //. null
  //. ```
  function maybeToNullable(maybe) {
    return maybe.isJust ? maybe.value : null;
  }
  S.maybeToNullable =
  def('maybeToNullable', {}, [$Maybe(a), $.Nullable(a)], maybeToNullable);

  //# toMaybe :: a? -> Maybe a
  //.
  //. Takes a value and returns Nothing if the value is `null` or `undefined`;
  //. Just the value otherwise.
  //.
  //. ```javascript
  //. > S.toMaybe(null)
  //. Nothing
  //.
  //. > S.toMaybe(42)
  //. Just(42)
  //. ```
  function toMaybe(x) {
    return x == null ? Nothing : Just(x);
  }
  S.toMaybe = def('toMaybe', {}, [a, $Maybe(a)], toMaybe);

  //# maybe :: b -> (a -> b) -> Maybe a -> b
  //.
  //. Takes a value of any type, a function, and a Maybe. If the Maybe is
  //. a Just, the return value is the result of applying the function to
  //. the Just's value. Otherwise, the first argument is returned.
  //.
  //. ```javascript
  //. > S.maybe(0, R.length, S.Just('refuge'))
  //. 6
  //.
  //. > S.maybe(0, R.length, S.Nothing)
  //. 0
  //. ```
  function maybe(x, f, maybe) {
    return fromMaybe(x, maybe.map(f));
  }
  S.maybe = def('maybe', {}, [b, $.Function, $Maybe(a), b], maybe);

  //# justs :: Array (Maybe a) -> Array a
  //.
  //. Takes an array of Maybes and returns an array containing each Just's
  //. value. Equivalent to Haskell's `catMaybes` function.
  //.
  //. See also [`lefts`](#lefts) and [`rights`](#rights).
  //.
  //. ```javascript
  //. > S.justs([S.Just('foo'), S.Nothing, S.Just('baz')])
  //. ['foo', 'baz']
  //. ```
  function justs(maybes) {
    return maybes.reduce(function(xs, maybe) {
      if (maybe.isJust) xs.push(maybe.value);
      return xs;
    }, []);
  }
  S.justs = def('justs', {}, [$.Array($Maybe(a)), $.Array(a)], justs);

  //# mapMaybe :: (a -> Maybe b) -> Array a -> Array b
  //.
  //. Takes a function and an array, applies the function to each element of
  //. the array, and returns an array of "successful" results. If the result of
  //. applying the function to an element of the array is Nothing, the result
  //. is discarded; if the result is a Just, the Just's value is included in
  //. the output array.
  //.
  //. In general terms, `mapMaybe` filters an array while mapping over it.
  //.
  //. ```javascript
  //. > S.mapMaybe(S.head, [[], [1, 2, 3], [], [4, 5, 6], []])
  //. [1, 4]
  //. ```
  function mapMaybe(f, xs) {
    return justs(R.map(f, xs));
  }
  S.mapMaybe =
  def('mapMaybe', {}, [$.Function, $.Array(a), $.Array(b)], mapMaybe);

  //# encase :: (a -> b) -> a -> Maybe b
  //.
  //. Takes a unary function `f` which may throw and a value `x` of any type,
  //. and applies `f` to `x` inside a `try` block. If an exception is caught,
  //. the return value is Nothing; otherwise the return value is Just the
  //. result of applying `f` to `x`.
  //.
  //. See also [`encaseEither`](#encaseEither).
  //.
  //. ```javascript
  //. > S.encase(eval, '1 + 1')
  //. Just(2)
  //.
  //. > S.encase(eval, '1 +')
  //. Nothing
  //. ```
  function encase(f, x) {
    try {
      return Just(f(x));
    } catch (err) {
      return Nothing;
    }
  }
  S.encase = def('encase', {}, [$.Function, a, $Maybe(b)], encase);

  //# encase2 :: (a -> b -> c) -> a -> b -> Maybe c
  //.
  //. Binary version of [`encase`](#encase).
  //.
  //. See also [`encase2_`](#encase2_).
  function encase2(f, x, y) {
    return encase2_(uncurry2(f), x, y);
  }
  S.encase2 = def('encase2', {}, [$.Function, a, b, $Maybe(c)], encase2);

  //# encase2_ :: ((a, b) -> c) -> a -> b -> Maybe c
  //.
  //. Version of [`encase2`](#encase2) accepting uncurried functions.
  function encase2_(f, x, y) {
    try {
      return Just(f(x, y));
    } catch (err) {
      return Nothing;
    }
  }
  S.encase2_ = def('encase2_', {}, [$.Function, a, b, $Maybe(c)], encase2_);

  //# encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d
  //.
  //. Ternary version of [`encase`](#encase).
  //.
  //. See also [`encase3_`](#encase3_).
  function encase3(f, x, y, z) {
    return encase3_(uncurry3(f), x, y, z);
  }
  S.encase3 = def('encase3', {}, [$.Function, a, b, c, $Maybe(d)], encase3);

  //# encase3_ :: ((a, b, c) -> d) -> a -> b -> c -> Maybe d
  //.
  //. Version of [`encase3`](#encase3) accepting uncurried functions.
  function encase3_(f, x, y, z) {
    try {
      return Just(f(x, y, z));
    } catch (err) {
      return Nothing;
    }
  }
  S.encase3_ = def('encase3_', {}, [$.Function, a, b, c, $Maybe(d)], encase3_);

  //# maybeToEither :: a -> Maybe b -> Either a b
  //.
  //. Converts a Maybe to an Either. Nothing becomes a Left (containing the
  //. first argument); a Just becomes a Right.
  //.
  //. See also [`eitherToMaybe`](#eitherToMaybe).
  //.
  //. ```javascript
  //. > S.maybeToEither('Expecting an integer', S.parseInt(10, 'xyz'))
  //. Left('Expecting an integer')
  //.
  //. > S.maybeToEither('Expecting an integer', S.parseInt(10, '42'))
  //. Right(42)
  //. ```
  function maybeToEither(x, maybe) {
    return maybe.isNothing ? Left(x) : Right(maybe.value);
  }
  S.maybeToEither =
  def('maybeToEither', {}, [a, $Maybe(b), $Either(a, b)], maybeToEither);

  //. ### Either type
  //.
  //. The Either type represents values with two possibilities: a value of type
  //. `Either a b` is either a Left whose value is of type `a` or a Right whose
  //. value is of type `b`.
  //.
  //. The Either type satisfies the [Semigroup][], [Monad][], [Traversable][],
  //. and [Extend][] specifications.

  //# EitherType :: Type -> Type -> Type
  //.
  //. A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

  //# Either :: TypeRep Either
  //.
  //. The [type representative](#type-representatives) for the Either type.
  function Either(x, tag, value) {
    if (x !== sentinel) throw new Error('Cannot instantiate Either');
    this.isLeft = tag === 'Left';
    this.isRight = tag === 'Right';
    this.value = value;
  }
  S.Either = Either;

  //# Either.of :: b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Either.of(42)
  //. Right(42)
  //. ```
  Either.of = def('Either.of', {}, [b, $Either(a, b)], Right);

  //# Either#@@type :: Either a b ~> String
  //.
  //. Either type identifier, `'sanctuary/Either'`.
  Either.prototype['@@type'] = 'sanctuary/Either';

  //# Either#isLeft :: Either a b ~> Boolean
  //.
  //. `true` if `this` is a Left; `false` if `this` is a Right.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').isLeft
  //. true
  //.
  //. > S.Right(42).isLeft
  //. false
  //. ```

  //# Either#isRight :: Either a b ~> Boolean
  //.
  //. `true` if `this` is a Right; `false` if `this` is a Left.
  //.
  //. ```javascript
  //. > S.Right(42).isRight
  //. true
  //.
  //. > S.Left('Cannot divide by zero').isRight
  //. false
  //. ```

  //# Either#ap :: Either a (b -> c) ~> Either a b -> Either a c
  //.
  //. Takes a value of type `Either a b` and returns a Left unless `this`
  //. is a Right *and* the argument is a Right, in which case it returns
  //. a Right whose value is the result of applying this Right's value to
  //. the given Right's value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').ap(S.Right(42))
  //. Left('Cannot divide by zero')
  //.
  //. > S.Right(S.inc).ap(S.Left('Cannot divide by zero'))
  //. Left('Cannot divide by zero')
  //.
  //. > S.Right(S.inc).ap(S.Right(42))
  //. Right(43)
  //. ```
  function Either$prototype$ap(self, other) {
    return self.isRight ? other.map(self.value) : self;
  }
  Either.prototype.ap =
  method('Either#ap',
         {},
         [$Either(a, $.Function), $Either(a, b), $Either(a, c)],
         Either$prototype$ap);

  //# Either#chain :: Either a b ~> (b -> Either a c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise
  //. it returns the result of applying the function to this Right's value.
  //.
  //. ```javascript
  //. > global.sqrt = n =>
  //. .   n < 0 ? S.Left('Cannot represent square root of negative number')
  //. .         : S.Right(Math.sqrt(n))
  //. sqrt
  //.
  //. > S.Left('Cannot divide by zero').chain(sqrt)
  //. Left('Cannot divide by zero')
  //.
  //. > S.Right(-1).chain(sqrt)
  //. Left('Cannot represent square root of negative number')
  //.
  //. > S.Right(25).chain(sqrt)
  //. Right(5)
  //. ```
  function Either$prototype$chain(self, f) {
    return self.isRight ? f(self.value) : self;
  }
  Either.prototype.chain =
  method('Either#chain',
         {},
         [$Either(a, b), $.Function, $Either(a, c)],
         Either$prototype$chain);

  //# Either#concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b
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
  //. Left('abcdef')
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
  function Either$prototype$concat(self, other) {
    return self.isLeft ?
      other.isLeft ? Left(self.value.concat(other.value)) : other :
      other.isLeft ? self : Right(self.value.concat(other.value));
  }
  Either.prototype.concat =
  method('Either#concat',
         {a: [Semigroup], b: [Semigroup]},
         [$Either(a, b), $Either(a, b), $Either(a, b)],
         Either$prototype$concat);

  //# Either#equals :: Either a b ~> c -> Boolean
  //.
  //. Takes a value of any type and returns `true` if:
  //.
  //.   - it is a Left and `this` is a Left, and their values are equal
  //.     according to [`R.equals`][R.equals]; or
  //.
  //.   - it is a Right and `this` is a Right, and their values are equal
  //.     according to [`R.equals`][R.equals].
  //.
  //. ```javascript
  //. > S.Right([1, 2, 3]).equals(S.Right([1, 2, 3]))
  //. true
  //.
  //. > S.Right([1, 2, 3]).equals(S.Left([1, 2, 3]))
  //. false
  //.
  //. > S.Right(42).equals(42)
  //. false
  //. ```
  function Either$prototype$equals(self, x) {
    return type(x) === 'sanctuary/Either' &&
           x.isLeft === self.isLeft && R.equals(x.value, self.value);
  }
  Either.prototype.equals =
  method('Either#equals',
         {},
         [$Either(a, b), c, $.Boolean],
         Either$prototype$equals);

  //# Either#extend :: Either a b ~> (Either a b -> b) -> Either a b
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise it
  //. returns a Right whose value is the result of applying the function to
  //. `this`.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').extend(x => x.value + 1)
  //. Left('Cannot divide by zero')
  //.
  //. > S.Right(42).extend(x => x.value + 1)
  //. Right(43)
  //. ```
  function Either$prototype$extend(self, f) {
    return self.isLeft ? self : Right(f(self));
  }
  Either.prototype.extend =
  method('Either#extend',
         {},
         [$Either(a, b), $.Function, $Either(a, b)],
         Either$prototype$extend);

  //# Either#map :: Either a b ~> (b -> c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise it
  //. returns a Right whose value is the result of applying the function to
  //. this Right's value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').map(S.inc)
  //. Left('Cannot divide by zero')
  //.
  //. > S.Right([1, 2, 3]).map(S.sum)
  //. Right(6)
  //. ```
  function Either$prototype$map(self, f) {
    return self.isRight ? Right(f(self.value)) : self;
  }
  Either.prototype.map =
  method('Either#map',
         {},
         [$Either(a, b), $.Function, $Either(a, c)],
         Either$prototype$map);

  //# Either#of :: Either a b ~> c -> Either a c
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').of(42)
  //. Right(42)
  //. ```
  Either.prototype.of = def('Either#of', {}, [c, $Either(a, c)], Right);

  //# Either#reduce :: Either a b ~> ((c, b) -> c) -> c -> c
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is a Left; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Right's value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').reduce((xs, x) => xs.concat([x]), [42])
  //. [42]
  //.
  //. > S.Right(5).reduce((xs, x) => xs.concat([x]), [42])
  //. [42, 5]
  //. ```
  function Either$prototype$reduce(self, f, x) {
    return self.isRight ? f(x, self.value) : x;
  }
  Either.prototype.reduce =
  method('Either#reduce',
         {},
         [$Either(a, b), $.Function, c, c],
         Either$prototype$reduce);

  //# Either#sequence :: Applicative f => Either a (f b) ~> (b -> f b) -> f (Either a b)
  //.
  //. Evaluates an applicative action contained within the Either,
  //. resulting in:
  //.
  //.   - a pure applicative of a Left if `this` is a Left; otherwise
  //.
  //.   - an applicative of a Right of the evaluated action.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').sequence(S.Maybe.of)
  //. Just(Left('Cannot divide by zero'))
  //.
  //. > S.Right(S.Just(42)).sequence(S.Maybe.of)
  //. Just(Right(42))
  //.
  //. > S.Right(S.Nothing).sequence(S.Maybe.of)
  //. Nothing
  //. ```
  function Either$prototype$sequence(self, of) {
    return self.isRight ? R.map(Right, self.value) : of(self);
  }
  Either.prototype.sequence =
  method('Either#sequence',
         {b: [Applicative], c: [Applicative]},
         [$Either(a, b), $.Function, c],
         Either$prototype$sequence);

  //# Either#toString :: Either a b ~> () -> String
  //.
  //. Returns the string representation of the Either.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').toString()
  //. 'Left("Cannot divide by zero")'
  //.
  //. > S.Right([1, 2, 3]).toString()
  //. 'Right([1, 2, 3])'
  //. ```
  function Either$prototype$toString(self) {
    return (self.isLeft ? 'Left' : 'Right') +
           '(' + R.toString(self.value) + ')';
  }
  Either.prototype.toString =
  method('Either#toString',
         {},
         [$Either(a, b), $.String],
         Either$prototype$toString);

  //# Either#inspect :: Either a b ~> () -> String
  //.
  //. Returns the string representation of the Either. This method is used by
  //. `util.inspect` and the REPL to format a Either for display.
  //.
  //. See also [`Either#toString`](#Either.prototype.toString).
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').inspect()
  //. 'Left("Cannot divide by zero")'
  //.
  //. > S.Right([1, 2, 3]).inspect()
  //. 'Right([1, 2, 3])'
  //. ```
  Either.prototype.inspect = function() { return this.toString(); };

  //# Left :: a -> Either a b
  //.
  //. Takes a value of any type and returns a Left with the given value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero')
  //. Left('Cannot divide by zero')
  //. ```
  function Left(x) {
    return new Either(sentinel, 'Left', x);
  }
  S.Left = def('Left', {}, [a, $Either(a, b)], Left);

  //# Right :: b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Right(42)
  //. Right(42)
  //. ```
  function Right(x) {
    return new Either(sentinel, 'Right', x);
  }
  S.Right = def('Right', {}, [b, $Either(a, b)], Right);

  //# isLeft :: Either a b -> Boolean
  //.
  //. Returns `true` if the given Either is a Left; `false` if it is a Right.
  //.
  //. ```javascript
  //. > S.isLeft(S.Left('Cannot divide by zero'))
  //. true
  //.
  //. > S.isLeft(S.Right(42))
  //. false
  //. ```
  function isLeft(either) {
    return either.isLeft;
  }
  S.isLeft = def('isLeft', {}, [$Either(a, b), $.Boolean], isLeft);

  //# isRight :: Either a b -> Boolean
  //.
  //. Returns `true` if the given Either is a Right; `false` if it is a Left.
  //.
  //. ```javascript
  //. > S.isRight(S.Right(42))
  //. true
  //.
  //. > S.isRight(S.Left('Cannot divide by zero'))
  //. false
  //. ```
  function isRight(either) {
    return either.isRight;
  }
  S.isRight = def('isRight', {}, [$Either(a, b), $.Boolean], isRight);

  //# fromEither :: b -> Either a b -> b
  //.
  //. Takes a default value and an Either, and returns the Right value
  //. if the Either is a Right; the default value otherwise.
  //.
  //. ```javascript
  //. > S.fromEither(0, S.Right(42))
  //. 42
  //.
  //. > S.fromEither(0, S.Left(42))
  //. 0
  //. ```
  function fromEither(x, either) {
    return either.isRight ? either.value : x;
  }
  S.fromEither = def('fromEither', {}, [b, $Either(a, b), b], fromEither);

  //# toEither :: a -> b? -> Either a b
  //.
  //. Converts an arbitrary value to an Either: a Left if the value is `null`
  //. or `undefined`; a Right otherwise. The first argument specifies the
  //. value of the Left in the "failure" case.
  //.
  //. ```javascript
  //. > S.toEither('XYZ', null)
  //. Left('XYZ')
  //.
  //. > S.toEither('XYZ', 'ABC')
  //. Right('ABC')
  //.
  //. > R.map(R.head, S.toEither('Invalid protocol', 'ftp://example.com/'.match(/^https?:/)))
  //. Left('Invalid protocol')
  //.
  //. > R.map(R.head, S.toEither('Invalid protocol', 'https://example.com/'.match(/^https?:/)))
  //. Right('https:')
  //. ```
  function toEither(x, y) {
    return y == null ? Left(x) : Right(y);
  }
  S.toEither = def('toEither', {}, [a, b, $Either(a, b)], toEither);

  //# either :: (a -> c) -> (b -> c) -> Either a b -> c
  //.
  //. Takes two functions and an Either, and returns the result of
  //. applying the first function to the Left's value, if the Either
  //. is a Left, or the result of applying the second function to the
  //. Right's value, if the Either is a Right.
  //.
  //. ```javascript
  //. > S.either(S.toUpper, R.toString, S.Left('Cannot divide by zero'))
  //. 'CANNOT DIVIDE BY ZERO'
  //.
  //. > S.either(S.toUpper, R.toString, S.Right(42))
  //. '42'
  //. ```
  function either(l, r, either) {
    return either.isLeft ? l(either.value) : r(either.value);
  }
  S.either =
  def('either', {}, [$.Function, $.Function, $Either(a, b), c], either);

  //# lefts :: Array (Either a b) -> Array a
  //.
  //. Takes an array of Eithers and returns an array containing each Left's
  //. value.
  //.
  //. See also [`rights`](#rights).
  //.
  //. ```javascript
  //. > S.lefts([S.Right(20), S.Left('foo'), S.Right(10), S.Left('bar')])
  //. ['foo', 'bar']
  //. ```
  function lefts(eithers) {
    return eithers.reduce(function(xs, either) {
      if (either.isLeft) xs.push(either.value);
      return xs;
    }, []);
  }
  S.lefts = def('lefts', {}, [$.Array($Either(a, b)), $.Array(a)], lefts);

  //# rights :: Array (Either a b) -> Array b
  //.
  //. Takes an array of Eithers and returns an array containing each Right's
  //. value.
  //.
  //. See also [`lefts`](#lefts).
  //.
  //. ```javascript
  //. > S.rights([S.Right(20), S.Left('foo'), S.Right(10), S.Left('bar')])
  //. [20, 10]
  //. ```
  function rights(eithers) {
    return eithers.reduce(function(xs, either) {
      if (either.isRight) xs.push(either.value);
      return xs;
    }, []);
  }
  S.rights = def('rights', {}, [$.Array($Either(a, b)), $.Array(b)], rights);

  //# encaseEither :: (Error -> l) -> (a -> r) -> a -> Either l r
  //.
  //. Takes two unary functions, `f` and `g`, the second of which may throw,
  //. and a value `x` of any type. Applies `g` to `x` inside a `try` block.
  //. If an exception is caught, the return value is a Left containing the
  //. result of applying `f` to the caught Error object; otherwise the return
  //. value is a Right containing the result of applying `g` to `x`.
  //.
  //. See also [`encase`](#encase).
  //.
  //. ```javascript
  //. > S.encaseEither(S.I, JSON.parse, '["foo","bar","baz"]')
  //. Right(['foo', 'bar', 'baz'])
  //.
  //. > S.encaseEither(S.I, JSON.parse, '[')
  //. Left(new SyntaxError('Unexpected end of JSON input'))
  //.
  //. > S.encaseEither(S.prop('message'), JSON.parse, '[')
  //. Left('Unexpected end of JSON input')
  //. ```
  function encaseEither(f, g, x) {
    try {
      return Right(g(x));
    } catch (err) {
      return Left(f(err));
    }
  }
  S.encaseEither =
  def('encaseEither',
      {},
      [$.Function, $.Function, a, $Either(l, r)],
      encaseEither);

  //# encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r
  //.
  //. Binary version of [`encaseEither`](#encaseEither).
  //.
  //. See also [`encaseEither2_`](#encaseEither2_).
  function encaseEither2(f, g, x, y) {
    return encaseEither2_(f, uncurry2(g), x, y);
  }
  S.encaseEither2 =
  def('encaseEither2',
      {},
      [$.Function, $.Function, a, b, $Either(l, r)],
      encaseEither2);

  //# encaseEither2_ :: (Error -> l) -> ((a, b) -> r) -> a -> b -> Either l r
  //.
  //. Version of [`encaseEither2`](#encaseEither2) accepting uncurried
  //. functions.
  function encaseEither2_(f, g, x, y) {
    try {
      return Right(g(x, y));
    } catch (err) {
      return Left(f(err));
    }
  }
  S.encaseEither2_ =
  def('encaseEither2_',
      {},
      [$.Function, $.Function, a, b, $Either(l, r)],
      encaseEither2_);

  //# encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r
  //.
  //. Ternary version of [`encaseEither`](#encaseEither).
  //.
  //. See also [`encaseEither3_`](#encaseEither3_).
  function encaseEither3(f, g, x, y, z) {
    return encaseEither3_(f, uncurry3(g), x, y, z);
  }
  S.encaseEither3 =
  def('encaseEither3',
      {},
      [$.Function, $.Function, a, b, c, $Either(l, r)],
      encaseEither3);

  //# encaseEither3_ :: (Error -> l) -> ((a, b, c) -> r) -> a -> b -> c -> Either l r
  //.
  //. Version of [`encaseEither3`](#encaseEither3) accepting uncurried
  //. functions.
  function encaseEither3_(f, g, x, y, z) {
    try {
      return Right(g(x, y, z));
    } catch (err) {
      return Left(f(err));
    }
  }
  S.encaseEither3_ =
  def('encaseEither3',
      {},
      [$.Function, $.Function, a, b, c, $Either(l, r)],
      encaseEither3_);

  //# eitherToMaybe :: Either a b -> Maybe b
  //.
  //. Converts an Either to a Maybe. A Left becomes Nothing; a Right becomes
  //. a Just.
  //.
  //. See also [`maybeToEither`](#maybeToEither).
  //.
  //. ```javascript
  //. > S.eitherToMaybe(S.Left('Cannot divide by zero'))
  //. Nothing
  //.
  //. > S.eitherToMaybe(S.Right(42))
  //. Just(42)
  //. ```
  function eitherToMaybe(either) {
    return either.isLeft ? Nothing : Just(either.value);
  }
  S.eitherToMaybe =
  def('eitherToMaybe', {}, [$Either(a, b), $Maybe(b)], eitherToMaybe);

  //. ### Logic

  //# and :: Boolean -> Boolean -> Boolean
  //.
  //. Boolean "and".
  //.
  //. ```javascript
  //. > S.and(false, false)
  //. false
  //.
  //. > S.and(false, true)
  //. false
  //.
  //. > S.and(true, false)
  //. false
  //.
  //. > S.and(true, true)
  //. true
  //. ```
  function and(x, y) {
    return x.valueOf() && y.valueOf();
  }
  S.and = def('and', {}, [$.Boolean, $.Boolean, $.Boolean], and);

  //# or :: Boolean -> Boolean -> Boolean
  //.
  //. Boolean "or".
  //.
  //. ```javascript
  //. > S.or(false, false)
  //. false
  //.
  //. > S.or(false, true)
  //. true
  //.
  //. > S.or(true, false)
  //. true
  //.
  //. > S.or(true, true)
  //. true
  //. ```
  function or(x, y) {
    return x.valueOf() || y.valueOf();
  }
  S.or = def('or', {}, [$.Boolean, $.Boolean, $.Boolean], or);

  //# not :: Boolean -> Boolean
  //.
  //. Boolean "not".
  //.
  //. ```javascript
  //. > S.not(false)
  //. true
  //.
  //. > S.not(true)
  //. false
  //. ```
  function not(x) {
    return !x.valueOf();
  }
  S.not = def('not', {}, [$.Boolean, $.Boolean], not);

  //# ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b
  //.
  //. Takes a unary predicate, a unary "if" function, a unary "else"
  //. function, and a value of any type, and returns the result of
  //. applying the "if" function to the value if the value satisfies
  //. the predicate; the result of applying the "else" function to the
  //. value otherwise.
  //.
  //. ```javascript
  //. > S.ifElse(x => x < 0, Math.abs, Math.sqrt, -1)
  //. 1
  //.
  //. > S.ifElse(x => x < 0, Math.abs, Math.sqrt, 16)
  //. 4
  //. ```
  function ifElse(pred, f, g, x) {
    return pred(x) ? f(x) : g(x);
  }
  S.ifElse =
  def('ifElse', {}, [$.Function, $.Function, $.Function, a, b], ifElse);

  //# allPass :: Array (a -> Boolean) -> a -> Boolean
  //.
  //. Takes an array of unary predicates and a value of any type
  //. and returns `true` if all the predicates pass; `false` otherwise.
  //. None of the subsequent predicates will be evaluated after the
  //. first failed predicate.
  //.
  //. ```javascript
  //. > S.allPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'quiessence')
  //. true
  //.
  //. > S.allPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'fissiparous')
  //. false
  //. ```
  function allPass(preds, x) {
    return preds.every(function(p) { return p(x); });
  }
  S.allPass = def('allPass', {}, [$.Array($.Function), a, $.Boolean], allPass);

  //# anyPass :: Array (a -> Boolean) -> a -> Boolean
  //.
  //. Takes an array of unary predicates and a value of any type
  //. and returns `true` if any of the predicates pass; `false` otherwise.
  //. None of the subsequent predicates will be evaluated after the
  //. first passed predicate.
  //.
  //. ```javascript
  //. > S.anyPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'incandescent')
  //. true
  //.
  //. > S.anyPass([S.test(/q/), S.test(/u/), S.test(/i/)], 'empathy')
  //. false
  //. ```
  function anyPass(preds, x) {
    return preds.some(function(p) { return p(x); });
  }
  S.anyPass = def('anyPass', {}, [$.Array($.Function), a, $.Boolean], anyPass);

  //. ### List
  //.
  //. The List type constructor enables type signatures to describe ad hoc
  //. polymorphic functions which operate on either [`Array`][$.Array] or
  //. [`String`][$.String] values.
  //.
  //. Mental gymnastics are required to treat arrays and strings similarly.
  //. `[1, 2, 3]` is a list containing `1`, `2`, and `3`. `'abc'` is a list
  //. containing `'a'`, `'b'`, and `'c'`. But what is the type of `'a'`?
  //. `String`, since JavaScript has no Char type! Thus:
  //.
  //.     'abc' :: String, List String, List (List String), ...
  //.
  //. Every member of `String` is also a member of `List String`! This
  //. affects the interpretation of type signatures. Consider the type of
  //. [`indexOf`](#indexOf):
  //.
  //.     a -> List a -> Maybe Integer
  //.
  //. Assume the second argument is `'hello' :: List String`. `a` must then be
  //. replaced with `String`:
  //.
  //.     String -> List String -> Maybe Integer
  //.
  //. Since `List String` and `String` are interchangeable, the former can be
  //. replaced with the latter:
  //.
  //.     String -> String -> Maybe Integer
  //.
  //. It's then apparent that the first argument needn't be a single-character
  //. string; the correspondence between arrays and strings does not hold.

  //# concat :: Semigroup a => a -> a -> a
  //.
  //. Concatenates two (homogeneous) arrays, two strings, or two values of any
  //. other type which satisfies the [Semigroup][] specification.
  //.
  //. ```javascript
  //. > S.concat([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > S.concat('foo', 'bar')
  //. 'foobar'
  //.
  //. > S.concat(S.Just('foo'), S.Just('bar'))
  //. S.Just('foobar')
  //. ```
  function concat(x, y) {
    return x.concat(y);
  }
  S.concat = def('concat', {a: [Semigroup]}, [a, a, a], concat);

  //# slice :: Integer -> Integer -> List a -> Maybe (List a)
  //.
  //. Returns Just a list containing the elements from the supplied list
  //. from a beginning index (inclusive) to an end index (exclusive).
  //. Returns Nothing unless the start interval is less than or equal to
  //. the end interval, and the list contains both (half-open) intervals.
  //. Accepts negative indices, which indicate an offset from the end of
  //. the list.
  //.
  //. ```javascript
  //. > S.slice(1, 3, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['b', 'c'])
  //.
  //. > S.slice(-2, -0, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['d', 'e'])
  //.
  //. > S.slice(2, -0, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['c', 'd', 'e'])
  //.
  //. > S.slice(1, 6, ['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //.
  //. > S.slice(2, 6, 'banana')
  //. Just('nana')
  //. ```
  function slice(start, end, xs) {
    var len = xs.length;
    var fromIdx = negativeZero(start) ? len : start < 0 ? start + len : start;
    var toIdx = negativeZero(end) ? len : end < 0 ? end + len : end;

    return Math.abs(start) <= len && Math.abs(end) <= len && fromIdx <= toIdx ?
      Just(xs.slice(fromIdx, toIdx)) :
      Nothing;
  }
  S.slice =
  def('slice', {}, [$.Integer, $.Integer, List(a), $Maybe(List(a))], slice);

  //# at :: Integer -> List a -> Maybe a
  //.
  //. Takes an index and a list and returns Just the element of the list at
  //. the index if the index is within the list's bounds; Nothing otherwise.
  //. A negative index represents an offset from the length of the list.
  //.
  //. ```javascript
  //. > S.at(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just('c')
  //.
  //. > S.at(5, ['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //.
  //. > S.at(-2, ['a', 'b', 'c', 'd', 'e'])
  //. Just('d')
  //. ```
  function at(n, xs) {
    return slice(n, n === -1 ? -0 : n + 1, xs).map(R.head);
  }
  S.at = def('at', {}, [$.Integer, List(a), $Maybe(a)], at);

  //# head :: List a -> Maybe a
  //.
  //. Takes a list and returns Just the first element of the list if the
  //. list contains at least one element; Nothing if the list is empty.
  //.
  //. ```javascript
  //. > S.head([1, 2, 3])
  //. Just(1)
  //.
  //. > S.head([])
  //. Nothing
  //. ```
  function head(xs) {
    return at(0, xs);
  }
  S.head = def('head', {}, [List(a), $Maybe(a)], head);

  //# last :: List a -> Maybe a
  //.
  //. Takes a list and returns Just the last element of the list if the
  //. list contains at least one element; Nothing if the list is empty.
  //.
  //. ```javascript
  //. > S.last([1, 2, 3])
  //. Just(3)
  //.
  //. > S.last([])
  //. Nothing
  //. ```
  function last(xs) {
    return at(-1, xs);
  }
  S.last = def('last', {}, [List(a), $Maybe(a)], last);

  //# tail :: List a -> Maybe (List a)
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
  //. Nothing
  //. ```
  function tail(xs) {
    return slice(1, -0, xs);
  }
  S.tail = def('tail', {}, [List(a), $Maybe(List(a))], tail);

  //# init :: List a -> Maybe (List a)
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
  //. Nothing
  //. ```
  function init(xs) {
    return slice(0, -1, xs);
  }
  S.init = def('init', {}, [List(a), $Maybe(List(a))], init);

  //# take :: Integer -> List a -> Maybe (List a)
  //.
  //. Returns Just the first N elements of the given collection if N is
  //. greater than or equal to zero and less than or equal to the length
  //. of the collection; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.take(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['a', 'b'])
  //.
  //. > S.take(4, 'abcdefg')
  //. Just('abcd')
  //.
  //. > S.take(4, ['a', 'b', 'c'])
  //. Nothing
  //. ```
  function take(n, xs) {
    return n < 0 || negativeZero(n) ? Nothing : slice(0, n, xs);
  }
  S.take = def('take', {}, [$.Integer, List(a), $Maybe(List(a))], take);

  //# takeLast :: Integer -> List a -> Maybe (List a)
  //.
  //. Returns Just the last N elements of the given collection if N is
  //. greater than or equal to zero and less than or equal to the length
  //. of the collection; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.takeLast(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['d', 'e'])
  //.
  //. > S.takeLast(4, 'abcdefg')
  //. Just('defg')
  //.
  //. > S.takeLast(4, ['a', 'b', 'c'])
  //. Nothing
  //. ```
  function takeLast(n, xs) {
    return n < 0 || negativeZero(n) ? Nothing : slice(-n, -0, xs);
  }
  S.takeLast =
  def('takeLast', {}, [$.Integer, List(a), $Maybe(List(a))], takeLast);

  //# drop :: Integer -> List a -> Maybe (List a)
  //.
  //. Returns Just all but the first N elements of the given collection
  //. if N is greater than or equal to zero and less than or equal to the
  //. length of the collection; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.drop(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['c', 'd', 'e'])
  //.
  //. > S.drop(4, 'abcdefg')
  //. Just('efg')
  //.
  //. > S.drop(4, 'abc')
  //. Nothing
  //. ```
  function drop(n, xs) {
    return n < 0 || negativeZero(n) ? Nothing : slice(n, -0, xs);
  }
  S.drop = def('drop', {}, [$.Integer, List(a), $Maybe(List(a))], drop);

  //# dropLast :: Integer -> List a -> Maybe (List a)
  //.
  //. Returns Just all but the last N elements of the given collection
  //. if N is greater than or equal to zero and less than or equal to the
  //. length of the collection; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.dropLast(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['a', 'b', 'c'])
  //.
  //. > S.dropLast(4, 'abcdefg')
  //. Just('abc')
  //.
  //. > S.dropLast(4, 'abc')
  //. Nothing
  //. ```
  function dropLast(n, xs) {
    return n < 0 || negativeZero(n) ? Nothing : slice(0, -n, xs);
  }
  S.dropLast =
  def('dropLast', {}, [$.Integer, List(a), $Maybe(List(a))], dropLast);

  //# reverse :: List a -> List a
  //.
  //. Returns the elements of the given list in reverse order.
  //.
  //. ```javascript
  //. > S.reverse([1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > S.reverse('abc')
  //. 'cba'
  //. ```
  function reverse(xs) {
    return type(xs) === 'String' ? xs.split('').reverse().join('')
                                 : xs.slice().reverse();
  }
  S.reverse = def('reverse', {}, [List(a), List(a)], reverse);

  //# indexOf :: a -> List a -> Maybe Integer
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
  //. Nothing
  //.
  //. > S.indexOf('an', 'banana')
  //. Just(1)
  //.
  //. > S.indexOf('ax', 'banana')
  //. Nothing
  //. ```
  function indexOf(x, xs) {
    var idx = xs.indexOf(x);
    return idx >= 0 ? Just(idx) : Nothing;
  }
  S.indexOf = def('indexOf', {}, [a, List(a), $Maybe($.Integer)], indexOf);

  //# lastIndexOf :: a -> List a -> Maybe Integer
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
  //. Nothing
  //.
  //. > S.lastIndexOf('an', 'banana')
  //. Just(3)
  //.
  //. > S.lastIndexOf('ax', 'banana')
  //. Nothing
  //. ```
  function lastIndexOf(x, xs) {
    var idx = xs.lastIndexOf(x);
    return idx >= 0 ? Just(idx) : Nothing;
  }
  S.lastIndexOf =
  def('lastIndexOf', {}, [a, List(a), $Maybe($.Integer)], lastIndexOf);

  //. ### Array

  //# append :: a -> Array a -> Array a
  //.
  //. Takes a value of any type and an array of values of that type, and
  //. returns the result of appending the value to the array.
  //.
  //. See also [`prepend`](#prepend).
  //.
  //. ```javascript
  //. > S.append(3, [1, 2])
  //. [1, 2, 3]
  //. ```
  function append(x, xs) {
    return xs.concat([x]);
  }
  S.append = def('append', {}, [a, $.Array(a), $.Array(a)], append);

  //# prepend :: a -> Array a -> Array a
  //.
  //. Takes a value of any type and an array of values of that type, and
  //. returns the result of prepending the value to the array.
  //.
  //. See also [`append`](#append).
  //.
  //. ```javascript
  //. > S.prepend(1, [2, 3])
  //. [1, 2, 3]
  //. ```
  function prepend(x, xs) {
    return [x].concat(xs);
  }
  S.prepend = def('prepend', {}, [a, $.Array(a), $.Array(a)], prepend);

  //# joinWith :: String -> Array String -> String
  //.
  //. Joins the strings of the second argument separated by the first argument.
  //.
  //. Properties:
  //.
  //.   - `forall s :: String, t :: String. S.joinWith(s, S.splitOn(s, t)) = t`
  //.
  //. See also [`splitOn`](#splitOn).
  //.
  //. ```javascript
  //. > S.joinWith(':', ['foo', 'bar', 'baz'])
  //. 'foo:bar:baz'
  //. ```
  function joinWith(separator, ss) {
    return ss.join(separator);
  }
  S.joinWith =
  def('joinWith', {}, [$.String, $.Array($.String), $.String], joinWith);

  //# find :: (a -> Boolean) -> Array a -> Maybe a
  //.
  //. Takes a predicate and an array and returns Just the leftmost element of
  //. the array which satisfies the predicate; Nothing if none of the array's
  //. elements satisfies the predicate.
  //.
  //. ```javascript
  //. > S.find(n => n < 0, [1, -2, 3, -4, 5])
  //. Just(-2)
  //.
  //. > S.find(n => n < 0, [1, 2, 3, 4, 5])
  //. Nothing
  //. ```
  function find(pred, xs) {
    var result = Nothing;
    xs.some(function(x) {
      var ok = pred(x);
      if (ok) result = Just(x);
      return ok;
    });
    return result;
  }
  S.find = def('find', {}, [$.Function, $.Array(a), $Maybe(a)], find);

  //# pluck :: Accessible a => TypeRep b -> String -> Array a -> Array (Maybe b)
  //.
  //. Takes a [type representative](#type-representatives), a property name,
  //. and an array of objects and returns an array of equal length. Each
  //. element of the output array is Just the value of the specified property
  //. of the corresponding object if the value is of the specified type
  //. (according to [`is`](#is)); Nothing otherwise.
  //.
  //. See also [`get`](#get).
  //.
  //. ```javascript
  //. > S.pluck(Number, 'x', [{x: 1}, {x: 2}, {x: '3'}, {x: null}, {}])
  //. [Just(1), Just(2), Nothing, Nothing, Nothing]
  //. ```
  function pluck(typeRep, key, xs) {
    return xs.map(function(x) { return get(typeRep, key, x); });
  }
  S.pluck =
  def('pluck',
      {a: [Accessible]},
      [TypeRep, $.String, $.Array(a), $.Array($Maybe(b))],
      pluck);

  //# reduce :: Foldable f => (a -> b -> a) -> a -> f b -> a
  //.
  //. Takes a curried binary function, an initial value, and a [Foldable][],
  //. and applies the function to the initial value and the Foldable's first
  //. value, then applies the function to the result of the previous
  //. application and the Foldable's second value. Repeats this process
  //. until each of the Foldable's values has been used. Returns the initial
  //. value if the Foldable is empty; the result of the final application
  //. otherwise.
  //.
  //. See also [`reduce_`](#reduce_).
  //.
  //. ```javascript
  //. > S.reduce(S.add, 0, [1, 2, 3, 4, 5])
  //. 15
  //.
  //. > S.reduce(xs => x => [x].concat(xs), [], [1, 2, 3, 4, 5])
  //. [5, 4, 3, 2, 1]
  //. ```
  function reduce(f, initial, foldable) {
    return reduce_(uncurry2(f), initial, foldable);
  }
  S.reduce = def('reduce', {b: [Foldable]}, [$.Function, a, b, a], reduce);

  //# reduce_ :: Foldable f => ((a, b) -> a) -> a -> f b -> a
  //.
  //. Version of [`reduce`](#reduce) accepting uncurried functions.
  function reduce_(f, initial, foldable) {
    return foldable.reduce(
      type(foldable) === 'Array' ? function(acc, x) { return f(acc, x); } : f,
      initial
    );
  }
  S.reduce_ = def('reduce_', {b: [Foldable]}, [$.Function, a, b, a], reduce_);

  //# unfoldr :: (b -> Maybe (Pair a b)) -> b -> Array a
  //.
  //. Takes a function and a seed value, and returns an array generated by
  //. applying the function repeatedly. The array is initially empty. The
  //. function is initially applied to the seed value. Each application
  //. of the function should result in either:
  //.
  //.   - Nothing, in which case the array is returned; or
  //.
  //.   - Just a pair, in which case the first element is appended to
  //.     the array and the function is applied to the second element.
  //.
  //. ```javascript
  //. > S.unfoldr(n => n < 5 ? S.Just([n, n + 1]) : S.Nothing, 1)
  //. [1, 2, 3, 4]
  //. ```
  function unfoldr(f, x) {
    var result = [];
    for (var m = f(x); m.isJust; m = f(m.value[1])) result.push(m.value[0]);
    return result;
  }
  S.unfoldr = def('unfoldr', {}, [$.Function, b, $.Array(a)], unfoldr);

  //# range :: Integer -> Integer -> Array Integer
  //.
  //. Returns an array of consecutive integers starting with the first argument
  //. and ending with the second argument minus one. Returns `[]` if the second
  //. argument is less than or equal to the first argument.
  //.
  //. ```javascript
  //. > S.range(0, 10)
  //. [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  //.
  //. > S.range(-5, 0)
  //. [-5, -4, -3, -2, -1]
  //.
  //. > S.range(0, -5)
  //. []
  //. ```
  function range(from, to) {
    var result = [];
    for (var n = from; n < to; n += 1) result.push(n);
    return result;
  }
  S.range =
  def('range', {}, [$.Integer, $.Integer, $.Array($.Integer)], range);

  //. ### Object

  //# prop :: Accessible a => String -> a -> b
  //.
  //. Takes a property name and an object with known properties and returns
  //. the value of the specified property. If for some reason the object
  //. lacks the specified property, a type error is thrown.
  //.
  //. For accessing properties of uncertain objects, use [`get`](#get) instead.
  //.
  //. ```javascript
  //. > S.prop('a', {a: 1, b: 2})
  //. 1
  //. ```
  function prop(key, obj) {
    if (key in Object(obj)) return obj[key];
    throw new TypeError('‘prop’ expected object to have a property named ‘' +
                        key + '’; ' + R.toString(obj) + ' does not');
  }
  S.prop = def('prop', {a: [Accessible]}, [$.String, a, b], prop);

  //# get :: Accessible a => TypeRep b -> String -> a -> Maybe b
  //.
  //. Takes a [type representative](#type-representatives), a property
  //. name, and an object and returns Just the value of the specified object
  //. property if it is of the specified type (according to [`is`](#is));
  //. Nothing otherwise.
  //.
  //. The `Object` type representative may be used as a catch-all since most
  //. values have `Object.prototype` in their prototype chains.
  //.
  //. See also [`gets`](#gets) and [`prop`](#prop).
  //.
  //. ```javascript
  //. > S.get(Number, 'x', {x: 1, y: 2})
  //. Just(1)
  //.
  //. > S.get(Number, 'x', {x: '1', y: '2'})
  //. Nothing
  //.
  //. > S.get(Number, 'x', {})
  //. Nothing
  //. ```
  function get(typeRep, key, obj) {
    var x = obj[key];
    return is(typeRep, x) ? Just(x) : Nothing;
  }
  S.get =
  def('get', {a: [Accessible]}, [TypeRep, $.String, a, $Maybe(b)], get);

  //# gets :: Accessible a => TypeRep b -> Array String -> a -> Maybe b
  //.
  //. Takes a [type representative](#type-representatives), an array of
  //. property names, and an object and returns Just the value at the path
  //. specified by the array of property names if such a path exists and
  //. the value is of the specified type; Nothing otherwise.
  //.
  //. See also [`get`](#get).
  //.
  //. ```javascript
  //. > S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: 42}}})
  //. Just(42)
  //.
  //. > S.gets(Number, ['a', 'b', 'c'], {a: {b: {c: '42'}}})
  //. Nothing
  //.
  //. > S.gets(Number, ['a', 'b', 'c'], {})
  //. Nothing
  //. ```
  function gets(typeRep, keys, obj) {
    var maybe = keys.reduce(function(m, k) {
      return m.chain(function(x) { return x == null ? Nothing : Just(x[k]); });
    }, Just(obj));
    return filter(function(x) { return is(typeRep, x); }, maybe);
  }
  S.gets =
  def('gets',
      {a: [Accessible]},
      [TypeRep, $.Array($.String), a, $Maybe(b)],
      gets);

  //# keys :: StrMap a -> Array String
  //.
  //. Returns the keys of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.keys({b: 2, c: 3, a: 1}).sort()
  //. ['a', 'b', 'c']
  //. ```
  S.keys = def('keys', {}, [$.StrMap(a), $.Array($.String)], Object.keys);

  //# values :: StrMap a -> Array a
  //.
  //. Returns the values of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.values({a: 1, c: 3, b: 2}).sort()
  //. [1, 2, 3]
  //. ```
  function values(strMap) {
    return Object.keys(strMap).map(function(k) { return strMap[k]; });
  }
  S.values = def('values', {}, [$.StrMap(a), $.Array(a)], values);

  //# pairs :: StrMap a -> Array (Pair String a)
  //.
  //. Returns the key–value pairs of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.pairs({b: 2, a: 1, c: 3}).sort()
  //. [['a', 1], ['b', 2], ['c', 3]]
  //. ```
  function pairs(strMap) {
    return Object.keys(strMap).map(function(k) { return [k, strMap[k]]; });
  }
  S.pairs =
  def('pairs', {}, [$.StrMap(a), $.Array($.Pair($.String, a))], pairs);

  //. ### Number

  //# negate :: ValidNumber -> ValidNumber
  //.
  //. Negates its argument.
  //.
  //. ```javascript
  //. > S.negate(12.5)
  //. -12.5
  //.
  //. > S.negate(-42)
  //. 42
  //. ```
  function negate(n) {
    return -n;
  }
  S.negate = def('negate', {}, [$.ValidNumber, $.ValidNumber], negate);

  //# add :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the sum of two (finite) numbers.
  //.
  //. ```javascript
  //. > S.add(1, 1)
  //. 2
  //. ```
  function add(x, y) {
    return x + y;
  }
  S.add =
  def('add', {}, [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber], add);

  //# sum :: Foldable f => f FiniteNumber -> FiniteNumber
  //.
  //. Returns the sum of the given array of (finite) numbers.
  //.
  //. ```javascript
  //. > S.sum([1, 2, 3, 4, 5])
  //. 15
  //.
  //. > S.sum([])
  //. 0
  //.
  //. > S.sum(S.Just(42))
  //. 42
  //.
  //. > S.sum(S.Nothing)
  //. 0
  //. ```
  function sum(foldable) {
    return reduce_(add, 0, foldable);
  }
  S.sum = def('sum', {f: [Foldable]}, [f, $.FiniteNumber], sum);

  //# sub :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the difference between two (finite) numbers.
  //.
  //. ```javascript
  //. > S.sub(4, 2)
  //. 2
  //. ```
  function sub(x, y) {
    return x - y;
  }
  S.sub =
  def('sub', {}, [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber], sub);

  //# inc :: FiniteNumber -> FiniteNumber
  //.
  //. Increments a (finite) number by one.
  //.
  //. ```javascript
  //. > S.inc(1)
  //. 2
  //. ```
  function inc(x) {
    return x + 1;
  }
  S.inc = def('inc', {}, [$.FiniteNumber, $.FiniteNumber], inc);

  //# dec :: FiniteNumber -> FiniteNumber
  //.
  //. Decrements a (finite) number by one.
  //.
  //. ```javascript
  //. > S.dec(2)
  //. 1
  //. ```
  function dec(x) {
    return x - 1;
  }
  S.dec = def('dec', {}, [$.FiniteNumber, $.FiniteNumber], dec);

  //# mult :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the product of two (finite) numbers.
  //.
  //. ```javascript
  //. > S.mult(4, 2)
  //. 8
  //. ```
  function mult(x, y) {
    return x * y;
  }
  S.mult =
  def('mult', {}, [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber], mult);

  //# product :: Foldable f => f FiniteNumber -> FiniteNumber
  //.
  //. Returns the product of the given array of (finite) numbers.
  //.
  //. ```javascript
  //. > S.product([1, 2, 3, 4, 5])
  //. 120
  //.
  //. > S.product([])
  //. 1
  //.
  //. > S.product(S.Just(42))
  //. 42
  //.
  //. > S.product(S.Nothing)
  //. 1
  //. ```
  function product(foldable) {
    return reduce_(mult, 1, foldable);
  }
  S.product = def('product', {f: [Foldable]}, [f, $.FiniteNumber], product);

  //# div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber
  //.
  //. Returns the result of dividing its first argument (a finite number) by
  //. its second argument (a non-zero finite number).
  //.
  //. ```javascript
  //. > S.div(7, 2)
  //. 3.5
  //. ```
  function div(x, y) {
    return x / y;
  }
  S.div =
  def('div', {}, [$.FiniteNumber, $.NonZeroFiniteNumber, $.FiniteNumber], div);

  //# mean :: Foldable f => f FiniteNumber -> Maybe FiniteNumber
  //.
  //. Returns the mean of the given array of (finite) numbers.
  //.
  //. ```javascript
  //. > S.mean([1, 2, 3, 4, 5])
  //. S.Just(3)
  //.
  //. > S.mean([])
  //. S.Nothing
  //.
  //. > S.mean(S.Just(42))
  //. S.Just(42)
  //.
  //. > S.mean(S.Nothing)
  //. S.Nothing
  //. ```
  function mean(foldable) {
    var result = reduce_(
      function(acc, n) {
        acc.total += n;
        acc.count += 1;
        return acc;
      },
      {total: 0, count: 0},
      foldable
    );
    return result.count > 0 ? Just(result.total / result.count) : Nothing;
  }
  S.mean = def('mean', {f: [Foldable]}, [f, $Maybe($.FiniteNumber)], mean);

  //# min :: Ord a => a -> a -> a
  //.
  //. Returns the smaller of its two arguments.
  //.
  //. Strings are compared lexicographically. Specifically, the Unicode
  //. code point value of each character in the first string is compared
  //. to the value of the corresponding character in the second string.
  //.
  //. See also [`max`](#max).
  //.
  //. ```javascript
  //. > S.min(10, 2)
  //. 2
  //.
  //. > S.min(new Date('1999-12-31'), new Date('2000-01-01'))
  //. new Date('1999-12-31')
  //.
  //. > S.min('10', '2')
  //. '10'
  //. ```
  function min(x, y) {
    return x < y ? x : y;
  }
  S.min = def('min', {a: [Ord]}, [a, a, a], min);

  //# max :: Ord a => a -> a -> a
  //.
  //. Returns the larger of its two arguments.
  //.
  //. Strings are compared lexicographically. Specifically, the Unicode
  //. code point value of each character in the first string is compared
  //. to the value of the corresponding character in the second string.
  //.
  //. See also [`min`](#min).
  //.
  //. ```javascript
  //. > S.max(10, 2)
  //. 10
  //.
  //. > S.max(new Date('1999-12-31'), new Date('2000-01-01'))
  //. new Date('2000-01-01')
  //.
  //. > S.max('10', '2')
  //. '2'
  //. ```
  function max(x, y) {
    return x > y ? x : y;
  }
  S.max = def('max', {a: [Ord]}, [a, a, a], max);

  //. ### Integer

  //# even :: Integer -> Boolean
  //.
  //. Returns `true` if the given integer is even; `false` if it is odd.
  //.
  //. ```javascript
  //. > S.even(42)
  //. true
  //.
  //. > S.even(99)
  //. false
  //. ```
  function even(n) {
    return n % 2 === 0;
  }
  S.even = def('even', {}, [$.Integer, $.Boolean], even);

  //# odd :: Integer -> Boolean
  //.
  //. Returns `true` if the given integer is odd; `false` if it is even.
  //.
  //. ```javascript
  //. > S.odd(99)
  //. true
  //.
  //. > S.odd(42)
  //. false
  //. ```
  function odd(n) {
    return n % 2 !== 0;
  }
  S.odd = def('odd', {}, [$.Integer, $.Boolean], odd);

  //. ### Parse

  //# parseDate :: String -> Maybe Date
  //.
  //. Takes a string and returns Just the date represented by the string
  //. if it does in fact represent a date; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseDate('2011-01-19T17:40:00Z')
  //. Just(new Date('2011-01-19T17:40:00.000Z'))
  //.
  //. > S.parseDate('today')
  //. Nothing
  //. ```
  function parseDate(s) {
    var date = new Date(s);
    return isNaN(date.valueOf()) ? Nothing : Just(date);
  }
  S.parseDate = def('parseDate', {}, [$.String, $Maybe($.Date)], parseDate);

  //  requiredNonCapturingGroup :: Array String -> String
  var requiredNonCapturingGroup = function(xs) {
    return '(?:' + xs.join('|') + ')';
  };

  //  optionalNonCapturingGroup :: Array String -> String
  var optionalNonCapturingGroup = function(xs) {
    return requiredNonCapturingGroup(xs) + '?';
  };

  //  validFloatRepr :: RegExp
  var validFloatRepr = new RegExp(
    '^' +                     // start-of-string anchor
    '\\s*' +                  // any number of leading whitespace characters
    '[+-]?' +                 // optional sign
    requiredNonCapturingGroup([
      'Infinity',             // "Infinity"
      'NaN',                  // "NaN"
      requiredNonCapturingGroup([
        '[0-9]+',             // number
        '[0-9]+[.][0-9]+',    // number with interior decimal point
        '[0-9]+[.]',          // number with trailing decimal point
        '[.][0-9]+'           // number with leading decimal point
      ]) +
      optionalNonCapturingGroup([
        '[Ee]' +              // "E" or "e"
        '[+-]?' +             // optional sign
        '[0-9]+'              // exponent
      ])
    ]) +
    '\\s*' +                  // any number of trailing whitespace characters
    '$'                       // end-of-string anchor
  );

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
  //. Nothing
  //. ```
  function parseFloat_(s) {
    return validFloatRepr.test(s) ? Just(parseFloat(s)) : Nothing;
  }
  S.parseFloat =
  def('parseFloat', {}, [$.String, $Maybe($.Number)], parseFloat_);

  //# parseInt :: Integer -> String -> Maybe Integer
  //.
  //. Takes a radix (an integer between 2 and 36 inclusive) and a string,
  //. and returns Just the number represented by the string if it does in
  //. fact represent a number in the base specified by the radix; Nothing
  //. otherwise.
  //.
  //. This function is stricter than [`parseInt`][parseInt]: a string
  //. is considered to represent an integer only if all its non-prefix
  //. characters are members of the character set specified by the radix.
  //.
  //. ```javascript
  //. > S.parseInt(10, '-42')
  //. Just(-42)
  //.
  //. > S.parseInt(16, '0xFF')
  //. Just(255)
  //.
  //. > S.parseInt(16, '0xGG')
  //. Nothing
  //. ```
  function parseInt_(radix, s) {
    if (radix < 2 || radix > 36) {
      throw new RangeError('Radix not in [2 .. 36]');
    }

    var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, radix);
    var pattern = new RegExp('^[' + charset + ']+$', 'i');

    var t = s.replace(/^[+-]/, '');
    if (pattern.test(radix === 16 ? t.replace(/^0x/i, '') : t)) {
      var n = parseInt(s, radix);
      if ($.Integer._test(n)) return Just(n);
    }
    return Nothing;
  }
  S.parseInt =
  def('parseInt', {}, [$.Integer, $.String, $Maybe($.Integer)], parseInt_);

  //# parseJson :: TypeRep a -> String -> Maybe a
  //.
  //. Takes a [type representative](#type-representatives) and a string which
  //. may or may not be valid JSON, and returns Just the result of applying
  //. `JSON.parse` to the string *if* the result is of the specified type
  //. (according to [`is`](#is)); Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseJson(Array, '["foo","bar","baz"]')
  //. Just(['foo', 'bar', 'baz'])
  //.
  //. > S.parseJson(Array, '[')
  //. Nothing
  //.
  //. > S.parseJson(Object, '["foo","bar","baz"]')
  //. Nothing
  //. ```
  function parseJson(typeRep, s) {
    return filter(function(x) { return is(typeRep, x); },
                  encase(JSON.parse, s));
  }
  S.parseJson =
  def('parseJson', {}, [TypeRep, $.String, $Maybe(a)], parseJson);

  //. ### RegExp

  //# regex :: RegexFlags -> String -> RegExp
  //.
  //. Takes a [RegexFlags][] and a pattern, and returns a RegExp.
  //.
  //. ```javascript
  //. > S.regex('g', ':\\d+:')
  //. /:\d+:/g
  //. ```
  function regex(flags, source) {
    return new RegExp(source, flags);
  }
  S.regex = def('regex', {}, [$.RegexFlags, $.String, $.RegExp], regex);

  //# regexEscape :: String -> String
  //.
  //. Takes a string which may contain regular expression metacharacters,
  //. and returns a string with those metacharacters escaped.
  //.
  //. Properties:
  //.
  //.   - `forall s :: String. S.test(S.regex('', S.regexEscape(s)), s) = true`
  //.
  //. ```javascript
  //. > S.regexEscape('-=*{XYZ}*=-')
  //. '\\-=\\*\\{XYZ\\}\\*=\\-'
  //. ```
  function regexEscape(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  S.regexEscape = def('regexEscape', {}, [$.String, $.String], regexEscape);

  //# test :: RegExp -> String -> Boolean
  //.
  //. Takes a pattern and a string, and returns `true` if the pattern
  //. matches the string; `false` otherwise.
  //.
  //. ```javascript
  //. > S.test(/^a/, 'abacus')
  //. true
  //.
  //. > S.test(/^a/, 'banana')
  //. false
  //. ```
  function test(pattern, s) {
    var lastIndex = pattern.lastIndex;
    var result = pattern.test(s);
    pattern.lastIndex = lastIndex;
    return result;
  }
  S.test = def('test', {}, [$.RegExp, $.String, $.Boolean], test);

  //# match :: RegExp -> String -> Maybe (Array (Maybe String))
  //.
  //. Takes a pattern and a string, and returns Just an array of matches
  //. if the pattern matches the string; Nothing otherwise. Each match has
  //. type `Maybe String`, where Nothing represents an unmatched optional
  //. capturing group.
  //.
  //. ```javascript
  //. > S.match(/(good)?bye/, 'goodbye')
  //. Just([Just('goodbye'), Just('good')])
  //.
  //. > S.match(/(good)?bye/, 'bye')
  //. Just([Just('bye'), Nothing])
  //. ```
  function match(pattern, s) {
    var match = s.match(pattern);
    return match == null ? Nothing : Just(match.map(toMaybe));
  }
  S.match =
  def('match',
      {},
      [$.RegExp, $.String, $Maybe($.Array($Maybe($.String)))],
      match);

  //. ### String

  //# toUpper :: String -> String
  //.
  //. Returns the upper-case equivalent of its argument.
  //.
  //. See also [`toLower`](#toLower).
  //.
  //. ```javascript
  //. > S.toUpper('ABC def 123')
  //. 'ABC DEF 123'
  //. ```
  function toUpper(s) {
    return s.toUpperCase();
  }
  S.toUpper = def('toUpper', {}, [$.String, $.String], toUpper);

  //# toLower :: String -> String
  //.
  //. Returns the lower-case equivalent of its argument.
  //.
  //. See also [`toUpper`](#toUpper).
  //.
  //. ```javascript
  //. > S.toLower('ABC def 123')
  //. 'abc def 123'
  //. ```
  function toLower(s) {
    return s.toLowerCase();
  }
  S.toLower = def('toLower', {}, [$.String, $.String], toLower);

  //# trim :: String -> String
  //.
  //. Strips leading and trailing whitespace characters.
  //.
  //. ```javascript
  //. > S.trim('\t\t foo bar \n')
  //. 'foo bar'
  //. ```
  function trim(s) {
    return s.trim();
  }
  S.trim = def('trim', {}, [$.String, $.String], trim);

  //# words :: String -> Array String
  //.
  //. Takes a string and returns the array of words the string contains
  //. (words are delimited by whitespace characters).
  //.
  //. See also [`unwords`](#unwords).
  //.
  //. ```javascript
  //. > S.words(' foo bar baz ')
  //. ['foo', 'bar', 'baz']
  //. ```
  function words(s) {
    var words = s.split(/\s+/);
    return words.slice(words[0] === '' ? 1 : 0,
                       words[words.length - 1] === '' ? -1 : Infinity);
  }
  S.words = def('words', {}, [$.String, $.Array($.String)], words);

  //# unwords :: Array String -> String
  //.
  //. Takes an array of words and returns the result of joining the words
  //. with separating spaces.
  //.
  //. See also [`words`](#words).
  //.
  //. ```javascript
  //. > S.unwords(['foo', 'bar', 'baz'])
  //. 'foo bar baz'
  //. ```
  function unwords(xs) {
    return xs.join(' ');
  }
  S.unwords = def('unwords', {}, [$.Array($.String), $.String], unwords);

  //# lines :: String -> Array String
  //.
  //. Takes a string and returns the array of lines the string contains
  //. (lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
  //. The resulting strings do not contain newlines.
  //.
  //. See also [`unlines`](#unlines).
  //.
  //. ```javascript
  //. > S.lines('foo\nbar\nbaz\n')
  //. ['foo', 'bar', 'baz']
  //. ```
  function lines(s) {
    var match = s.replace(/\r\n?/g, '\n').match(/^(?=[\s\S]).*/gm);
    return match == null ? [] : match;
  }
  S.lines = def('lines', {}, [$.String, $.Array($.String)], lines);

  //# unlines :: Array String -> String
  //.
  //. Takes an array of lines and returns the result of joining the lines
  //. after appending a terminating line feed (`'\n'`) to each.
  //.
  //. See also [`lines`](#lines).
  //.
  //. ```javascript
  //. > S.unlines(['foo', 'bar', 'baz'])
  //. 'foo\nbar\nbaz\n'
  //. ```
  function unlines(xs) {
    return xs.reduce(function(s, x) { return s + x + '\n'; }, '');
  }
  S.unlines = def('unlines', {}, [$.Array($.String), $.String], unlines);

  //# splitOn :: String -> String -> Array String
  //.
  //. Returns the substrings of its second argument separated by occurrences
  //. of its first argument.
  //.
  //. See also [`joinWith`](#joinWith).
  //.
  //. ```javascript
  //. > S.splitOn('::', 'foo::bar::baz')
  //. ['foo', 'bar', 'baz']
  //. ```
  function splitOn(separator, s) {
    return s.split(separator);
  }
  S.splitOn =
  def('splitOn', {}, [$.String, $.String, $.Array($.String)], splitOn);

  return S;

  /* eslint-enable indent */

  };

  return createSanctuary({checkTypes: true, env: defaultEnv});

}));

//. [$.Array]:          https://github.com/sanctuary-js/sanctuary-def/#array
//. [$.String]:         https://github.com/sanctuary-js/sanctuary-def/#string
//. [Apply]:            https://github.com/fantasyland/fantasy-land#apply
//. [BinaryType]:       https://github.com/sanctuary-js/sanctuary-def#binarytype
//. [Extend]:           https://github.com/fantasyland/fantasy-land#extend
//. [Foldable]:         https://github.com/fantasyland/fantasy-land#foldable
//. [Functor]:          https://github.com/fantasyland/fantasy-land#functor
//. [Monad]:            https://github.com/fantasyland/fantasy-land#monad
//. [Monoid]:           https://github.com/fantasyland/fantasy-land#monoid
//. [Nullable]:         https://github.com/sanctuary-js/sanctuary-def#nullable
//. [Object#toString]:  https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
//. [R.equals]:         http://ramdajs.com/docs/#equals
//. [Ramda]:            http://ramdajs.com/
//. [RegexFlags]:       https://github.com/sanctuary-js/sanctuary-def#regexflags
//. [Semigroup]:        https://github.com/fantasyland/fantasy-land#semigroup
//. [Traversable]:      https://github.com/fantasyland/fantasy-land#traversable
//. [UnaryType]:        https://github.com/sanctuary-js/sanctuary-def#unarytype
//. [parseInt]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
//. [sanctuary-def]:    https://github.com/sanctuary-js/sanctuary-def
//. [thrush]:           https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
