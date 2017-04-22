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
//. [![npm](https://img.shields.io/npm/v/sanctuary.svg)](https://www.npmjs.com/package/sanctuary)
//. [![CircleCI](https://img.shields.io/circleci/project/github/sanctuary-js/sanctuary/master.svg)](https://circleci.com/gh/sanctuary-js/sanctuary/tree/master)
//. [![Gitter](https://img.shields.io/gitter/room/badges/shields.svg)](https://gitter.im/sanctuary-js/sanctuary)
//.
//. Sanctuary is a JavaScript functional programming library inspired by
//. Haskell and PureScript. It's stricter than [Ramda][], and provides a
//. similar suite of functions.
//.
//. Sanctuary promotes programs composed of simple, pure functions. Such
//. programs are easier to comprehend, test, and maintain &ndash; they are
//. also a pleasure to write.
//.
//. Sanctuary provides two data types, [Maybe][] and [Either][], both of
//. which are compatible with [Fantasy Land][]. Thanks to these data types
//. even Sanctuary functions which may fail, such as [`head`](#head), are
//. composable.
//.
//. Sanctuary makes it possible to write safe code without null checks.
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
//.     S.map(S.toUpper, S.head(words))
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
    module.exports = f(require('sanctuary-def'),
                       require('sanctuary-type-classes'),
                       require('sanctuary-type-identifiers'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['sanctuary-def',
            'sanctuary-type-classes',
            'sanctuary-type-identifiers'],
           f);
  } else {
    self.sanctuary = f(self.sanctuaryDef,
                       self.sanctuaryTypeClasses,
                       self.sanctuaryTypeIdentifiers);
  }

}(function($, Z, type) {

  'use strict';

  //  Fn :: (Type, Type) -> Type
  function Fn(x, y) { return $.Function([x, y]); }

  //  Pred :: Type -> Type
  function Pred(x) { return Fn(x, $.Boolean); }

  //  Thunk :: Type -> Type
  function Thunk(x) { return $.Function([x]); }

  //  typeEq :: String -> a -> Boolean
  function typeEq(typeIdent) {
    return function(x) {
      return type(x) === typeIdent;
    };
  }

  //  uncurry2 :: (a -> b -> c) -> ((a, b) -> c)
  function uncurry2(f) {
    return function(x, y) {
      return f(x)(y);
    };
  }

  //  uncurry3 :: (a -> b -> c -> d) -> ((a, b, c) -> d)
  function uncurry3(f) {
    return function(x, y, z) {
      return f(x)(y)(z);
    };
  }

  //  unsafeHead :: Array a -> a?
  function unsafeHead(xs) { return xs[0]; }

  //  Accessible :: TypeClass
  var Accessible = Z.TypeClass(
    'sanctuary/Accessible',
    [],
    function(x) { return x != null; }
  );

  //  Ord :: TypeClass
  var Ord = Z.TypeClass(
    'sanctuary/Ord',
    [],
    function(x) {
      return $.String._test(x) ||
             $.ValidDate._test(x) ||
             $.ValidNumber._test(x);
    }
  );

  //  readmeUrl :: String -> String
  function readmeUrl(id) {
    var version = '0.12.2';  // updated programmatically
    return 'https://github.com/sanctuary-js/sanctuary/tree/v' + version +
           '#' + id;
  }

  //  :: Type
  var a = $.TypeVariable('a');
  var b = $.TypeVariable('b');
  var c = $.TypeVariable('c');
  var d = $.TypeVariable('d');
  var e = $.TypeVariable('e');
  var l = $.TypeVariable('l');
  var r = $.TypeVariable('r');

  //  :: Type -> Type
  var f = $.UnaryTypeVariable('f');
  var m = $.UnaryTypeVariable('m');
  var t = $.UnaryTypeVariable('t');
  var w = $.UnaryTypeVariable('w');

  //  :: Type -> Type -> Type
  var p = $.BinaryTypeVariable('p');

  //  eitherTypeIdent :: String
  var eitherTypeIdent = 'sanctuary/Either';

  //  $Either :: Type -> Type -> Type
  var $Either = $.BinaryType(
    eitherTypeIdent,
    readmeUrl('EitherType'),
    typeEq(eitherTypeIdent),
    function(either) { return either.isLeft ? [either.value] : []; },
    function(either) { return either.isRight ? [either.value] : []; }
  );

  //  List :: Type -> Type
  var List = $.UnaryType(
    'sanctuary/List',
    readmeUrl('list'),
    function(x) { return $.String._test(x) || Array.isArray(x); },
    function(list) { return $.String._test(list) ? [] : list; }
  );

  //  maybeTypeIdent :: String
  var maybeTypeIdent = 'sanctuary/Maybe';

  //  $Maybe :: Type -> Type
  var $Maybe = $.UnaryType(
    maybeTypeIdent,
    readmeUrl('MaybeType'),
    typeEq(maybeTypeIdent),
    function(maybe) { return maybe.isJust ? [maybe.value] : []; }
  );

  //  TypeRep :: Type -> Type
  var TypeRep = $.UnaryType(
    'sanctuary/TypeRep',
    readmeUrl('type-representatives'),
    function(x) {
      return $.AnyFunction._test(x) ||
             x != null && $.String._test(x['@@type']);
    },
    function(typeRep) { return []; }
  );

  //  defaultEnv :: Array Type
  var defaultEnv = Z.concat($.env, [
    $.FiniteNumber,
    $.NonZeroFiniteNumber,
    $Either($.Unknown, $.Unknown),
    Fn($.Unknown, $.Unknown),
    $.GlobalRegExp,
    $.NonGlobalRegExp,
    $.Integer,
    $Maybe($.Unknown),
    $.Pair($.Unknown, $.Unknown),
    $.RegexFlags,
    $.ValidDate,
    $.ValidNumber
  ]);

  //  Options :: Type
  var Options = $.RecordType({checkTypes: $.Boolean, env: $.Array($.Any)});

  //  createSanctuary :: Options -> Module
  function createSanctuary(opts) {

  /* eslint-disable indent */

  var S = {};

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
  //. const type = require('sanctuary-type-identifiers');
  //.
  //. //    identityTypeIdent :: String
  //. const identityTypeIdent = 'my-package/Identity';
  //.
  //. //    Identity :: a -> Identity a
  //. function Identity(x) {
  //.   if (!(this instanceof Identity)) return new Identity(x);
  //.   this.value = x;
  //. }
  //.
  //. Identity['@@type'] = identityTypeIdent;
  //.
  //. Identity.prototype['fantasy-land/map'] = function(f) {
  //.   return Identity(f(this.value));
  //. };
  //.
  //. Identity.prototype['fantasy-land/chain'] = function(f) {
  //.   return f(this.value);
  //. };
  //.
  //. //    isIdentity :: a -> Boolean
  //. const isIdentity = x => type(x) === identityTypeIdent;
  //.
  //. //    identityToArray :: Identity a -> Array a
  //. const identityToArray = identity => [identity.value];
  //.
  //. //    IdentityType :: Type
  //. const IdentityType =
  //. $.UnaryType(identityTypeIdent, isIdentity, identityToArray);
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

  //. ### Placeholder
  //.
  //. Sanctuary functions are designed with partial application in mind.
  //. In many cases one can define a more specific function in terms of
  //. a more general one simply by applying the more general function to
  //. some (but not all) of its arguments. For example, one could define
  //. `sum :: Foldable f => f Number -> Number` as `S.reduce(S.add, 0)`.
  //.
  //. In some cases, though, there are multiple orders in which one may
  //. wish to provide a function's arguments. `S.concat('prefix')` is a
  //. function which prefixes its argument, but how would one define a
  //. function which suffixes its argument? It's possible with the help
  //. of [`__`](#__), the special placeholder value.
  //.
  //. The placeholder indicates a hole to be filled at some future time.
  //. The following are all equivalent (`_` represents the placeholder):
  //.
  //.   - `f(x, y, z)`
  //.   - `f(_, y, z)(x)`
  //.   - `f(_, _, z)(x, y)`
  //.   - `f(_, _, z)(_, y)(x)`

  //# __ :: Placeholder
  //.
  //. The special [placeholder](#placeholder) value.
  //.
  //. ```javascript
  //. > S.map(S.concat('@'), ['foo', 'bar', 'baz'])
  //. ['@foo', '@bar', '@baz']
  //.
  //. > S.map(S.concat(S.__, '?'), ['foo', 'bar', 'baz'])
  //. ['foo?', 'bar?', 'baz?']
  //. ```
  S.__ = $.__;

  //. ### Classify

  //# type :: Any -> String
  //.
  //. Returns the [type identifier][] of the given value.
  //.
  //. ```javascript
  //. > S.type(S.Just(42))
  //. 'sanctuary/Maybe'
  //.
  //. > S.type([1, 2, 3])
  //. 'Array'
  //. ```
  S.type = def('type', {}, [$.Any, $.String], type);

  //# is :: TypeRep a -> Any -> Boolean
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
    var xType = type(x);
    if ($.String._test(typeRep['@@type'])) {
      return xType === typeRep['@@type'];
    } else {
      var match = /function (\w*)/.exec(typeRep);
      return match != null && match[1] === xType;
    }
  }
  S.is = def('is', {}, [TypeRep(a), $.Any, $.Boolean], is);

  //. ### Showable

  //# toString :: Any -> String
  //.
  //. Alias of [`Z.toString`][].
  //.
  //. ```javascript
  //. > S.toString(-0)
  //. '-0'
  //.
  //. > S.toString(['foo', 'bar', 'baz'])
  //. '["foo", "bar", "baz"]'
  //.
  //. > S.toString({x: 1, y: 2, z: 3})
  //. '{"x": 1, "y": 2, "z": 3}'
  //.
  //. > S.toString(S.Left(S.Right(S.Just(S.Nothing))))
  //. 'Left(Right(Just(Nothing)))'
  //. ```
  S.toString = def('toString', {}, [$.Any, $.String], Z.toString);

  //. ### Fantasy Land
  //.
  //. Sanctuary is compatible with the [Fantasy Land][] specification.

  //# equals :: Setoid a => a -> a -> Boolean
  //.
  //. Curried version of [`Z.equals`][] which requires two arguments of the
  //. same type.
  //.
  //. To compare values of different types first use [`create`](#create) to
  //. create a Sanctuary module with type checking disabled, then use that
  //. module's `equals` function.
  //.
  //. ```javascript
  //. > S.equals(0, -0)
  //. false
  //.
  //. > S.equals(NaN, NaN)
  //. true
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Just([1, 2, 3]))
  //. true
  //. ```
  S.equals = def('equals', {a: [Z.Setoid]}, [a, a, $.Boolean], Z.equals);

  //# concat :: Semigroup a => a -> a -> a
  //.
  //. Curried version of [`Z.concat`][].
  //.
  //. ```javascript
  //. > S.concat('abc', 'def')
  //. 'abcdef'
  //.
  //. > S.concat([1, 2, 3], [4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > S.concat({x: 1, y: 2}, {y: 3, z: 4})
  //. {x: 1, y: 3, z: 4}
  //.
  //. > S.concat(S.Just([1, 2, 3]), S.Just([4, 5, 6]))
  //. Just([1, 2, 3, 4, 5, 6])
  //. ```
  S.concat = def('concat', {a: [Z.Semigroup]}, [a, a, a], Z.concat);

  //# empty :: Monoid a => TypeRep a -> a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.empty`][].
  //.
  //. ```javascript
  //. > S.empty(String)
  //. ''
  //.
  //. > S.empty(Array)
  //. []
  //.
  //. > S.empty(Object)
  //. {}
  //. ```
  S.empty = def('empty', {a: [Z.Monoid]}, [TypeRep(a), a], Z.empty);

  //# map :: Functor f => (a -> b) -> f a -> f b
  //.
  //. Curried version of [`Z.map`][].
  //.
  //. ```javascript
  //. > S.map(Math.sqrt, [1, 4, 9])
  //. [1, 2, 3]
  //.
  //. > S.map(Math.sqrt, {x: 1, y: 4, z: 9})
  //. {x: 1, y: 2, z: 3}
  //.
  //. > S.map(Math.sqrt, S.Just(9))
  //. Just(3)
  //.
  //. > S.map(Math.sqrt, S.Right(9))
  //. Right(3)
  //. ```
  //.
  //. Replacing `Functor f => f` with `Function x` produces the B combinator
  //. from combinatory logic (i.e. [`compose`](#compose)):
  //.
  //.     Functor f => (a -> b) -> f a -> f b
  //.     (a -> b) -> Function x a -> Function x b
  //.     (a -> c) -> Function x a -> Function x c
  //.     (b -> c) -> Function x b -> Function x c
  //.     (b -> c) -> Function a b -> Function a c
  //.     (b -> c) -> (a -> b) -> (a -> c)
  //.
  //. ```javascript
  //. > S.map(Math.sqrt, S.inc)(99)
  //. 10
  //. ```
  S.map = def('map', {f: [Z.Functor]}, [Fn(a, b), f(a), f(b)], Z.map);

  //# bimap :: Bifunctor f => (a -> b) -> (c -> d) -> f a c -> f b d
  //.
  //. Curried version of [`Z.bimap`][].
  //.
  //. ```javascript
  //. > S.bimap(S.toUpper, Math.sqrt, S.Left('foo'))
  //. Left('FOO')
  //.
  //. > S.bimap(S.toUpper, Math.sqrt, S.Right(64))
  //. Right(8)
  //. ```
  S.bimap =
  def('bimap',
      {p: [Z.Bifunctor]},
      [Fn(a, b), Fn(c, d), p(a, c), p(b, d)],
      Z.bimap);

  //# promap :: Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d
  //.
  //. Curried version of [`Z.promap`][].
  //.
  //. ```javascript
  //. > S.promap(Math.abs, S.inc, Math.sqrt)(-100)
  //. 11
  //. ```
  S.promap =
  def('promap',
      {p: [Z.Profunctor]},
      [Fn(a, b), Fn(c, d), p(b, c), p(a, d)],
      Z.promap);

  //# alt :: Alt f => f a -> f a -> f a
  //.
  //. Curried version of [`Z.alt`][].
  //.
  //. ```javascript
  //. > S.alt(S.Nothing, S.Just(1))
  //. Just(1)
  //.
  //. > S.alt(S.Just(2), S.Just(3))
  //. Just(2)
  //.
  //. > S.alt(S.Left('X'), S.Right(1))
  //. Right(1)
  //.
  //. > S.alt(S.Right(2), S.Right(3))
  //. Right(2)
  //. ```
  S.alt = def('alt', {f: [Z.Alt]}, [f(a), f(a), f(a)], Z.alt);

  //# zero :: Plus f => TypeRep f -> f a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.zero`][].
  //.
  //. ```javascript
  //. > S.zero(Array)
  //. []
  //.
  //. > S.zero(Object)
  //. {}
  //.
  //. > S.zero(S.Maybe)
  //. Nothing
  //. ```
  S.zero =
  def('zero', {f: [Z.Plus]}, [TypeRep($.TypeVariable('f')), f(a)], Z.zero);

  //# reduce :: Foldable f => (b -> a -> b) -> b -> f a -> b
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
    return Z.reduce(uncurry2(f), initial, foldable);
  }
  S.reduce =
  def('reduce', {f: [Z.Foldable]}, [Fn(a, Fn(b, a)), a, f(b), a], reduce);

  //# reduce_ :: Foldable f => ((b, a) -> b) -> b -> f a -> b
  //.
  //. Variant of [`reduce`](#reduce) which takes an uncurried binary function.
  S.reduce_ =
  def('reduce_',
      {f: [Z.Foldable]},
      [$.Function([a, b, a]), a, f(b), a],
      Z.reduce);

  //# traverse :: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f (t b)
  //.
  //. Curried version of [`Z.traverse`][].
  //.
  //. ```javascript
  //. > S.traverse(Array, S.words, S.Just('foo bar baz'))
  //. [Just('foo'), Just('bar'), Just('baz')]
  //.
  //. > S.traverse(Array, S.words, S.Nothing)
  //. [Nothing]
  //.
  //. > S.traverse(S.Maybe, S.parseInt(16), ['A', 'B', 'C'])
  //. Just([10, 11, 12])
  //.
  //. > S.traverse(S.Maybe, S.parseInt(16), ['A', 'B', 'C', 'X'])
  //. Nothing
  //. ```
  S.traverse =
  def('traverse',
      {f: [Z.Applicative], t: [Z.Traversable]},
      [TypeRep($.TypeVariable('f')), Fn(a, f(b)), t(a), f(t(b))],
      Z.traverse);

  //# sequence :: (Applicative f, Traversable t) => TypeRep f -> t (f a) -> f (t a)
  //.
  //. Curried version of [`Z.sequence`][].
  //.
  //. ```javascript
  //. > S.sequence(Array, S.Just([1, 2, 3]))
  //. [Just(1), Just(2), Just(3)]
  //.
  //. > S.sequence(S.Maybe, [S.Just(1), S.Just(2), S.Just(3)])
  //. Just([1, 2, 3])
  //.
  //. > S.sequence(S.Maybe, [S.Just(1), S.Just(2), S.Nothing])
  //. Nothing
  //. ```
  S.sequence =
  def('sequence',
      {f: [Z.Applicative], t: [Z.Traversable]},
      [TypeRep($.TypeVariable('f')), t(f(a)), f(t(a))],
      Z.sequence);

  //# ap :: Apply f => f (a -> b) -> f a -> f b
  //.
  //. Curried version of [`Z.ap`][].
  //.
  //. ```javascript
  //. > S.ap([Math.sqrt, x => x * x], [1, 4, 9, 16, 25])
  //. [1, 2, 3, 4, 5, 1, 16, 81, 256, 625]
  //.
  //. > S.ap({x: Math.sqrt, y: S.inc, z: S.dec}, {w: 4, x: 4, y: 4})
  //. {x: 2, y: 5}
  //.
  //. > S.ap(S.Just(Math.sqrt), S.Just(64))
  //. Just(8)
  //. ```
  //.
  //. Replacing `Apply f => f` with `Function x` produces the S combinator
  //. from combinatory logic:
  //.
  //.     Apply f => f (a -> b) -> f a -> f b
  //.     Function x (a -> b) -> Function x a -> Function x b
  //.     Function x (a -> c) -> Function x a -> Function x c
  //.     Function x (b -> c) -> Function x b -> Function x c
  //.     Function a (b -> c) -> Function a b -> Function a c
  //.     (a -> b -> c) -> (a -> b) -> (a -> c)
  //.
  //. ```javascript
  //. > S.ap(s => n => s.slice(0, n), s => Math.ceil(s.length / 2))('Haskell')
  //. 'Hask'
  //. ```
  S.ap =
  def('ap',
      {f: [Z.Apply]},
      [f(Fn(a, b)), f(a), f(b)],
      Z.ap);

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
  S.lift2 =
  def('lift2', {f: [Z.Apply]}, [Fn(a, Fn(b, c)), f(a), f(b), f(c)], Z.lift2);

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
  S.lift3 =
  def('lift3',
      {f: [Z.Apply]},
      [Fn(a, Fn(b, Fn(c, d))), f(a), f(b), f(c), f(d)],
      Z.lift3);

  //# apFirst :: Apply f => f a -> f b -> f a
  //.
  //. Curried version of [`Z.apFirst`][]. Combines two effectful actions,
  //. keeping only the result of the first. Equivalent to Haskell's `(<*)`
  //. function.
  //.
  //. See also [`apSecond`](#apSecond).
  //.
  //. ```javascript
  //. > S.apFirst([1, 2], [3, 4])
  //. [1, 1, 2, 2]
  //.
  //. > S.apFirst(S.Just(1), S.Just(2))
  //. Just(1)
  //. ```
  S.apFirst = def('apFirst', {f: [Z.Apply]}, [f(a), f(b), f(a)], Z.apFirst);

  //# apSecond :: Apply f => f a -> f b -> f b
  //.
  //. Curried version of [`Z.apSecond`][]. Combines two effectful actions,
  //. keeping only the result of the second. Equivalent to Haskell's `(*>)`
  //. function.
  //.
  //. See also [`apFirst`](#apFirst).
  //.
  //. ```javascript
  //. > S.apSecond([1, 2], [3, 4])
  //. [3, 4, 3, 4]
  //.
  //. > S.apSecond(S.Just(1), S.Just(2))
  //. Just(2)
  //. ```
  S.apSecond = def('apSecond', {f: [Z.Apply]}, [f(a), f(b), f(b)], Z.apSecond);

  //# of :: Applicative f => TypeRep f -> a -> f a
  //.
  //. Curried version of [`Z.of`][].
  //.
  //. ```javascript
  //. > S.of(Array, 42)
  //. [42]
  //.
  //. > S.of(Function, 42)(null)
  //. 42
  //.
  //. > S.of(S.Maybe, 42)
  //. Just(42)
  //.
  //. > S.of(S.Either, 42)
  //. Right(42)
  //. ```
  S.of =
  def('of',
      {f: [Z.Applicative]},
      [TypeRep($.TypeVariable('f')), a, f(a)],
      Z.of);

  //# chain :: Chain m => (a -> m b) -> m a -> m b
  //.
  //. Curried version of [`Z.chain`][].
  //.
  //. ```javascript
  //. > S.chain(x => [x, x], [1, 2, 3])
  //. [1, 1, 2, 2, 3, 3]
  //.
  //. > S.chain(n => s => s.slice(0, n), s => Math.ceil(s.length / 2))('slice')
  //. 'sli'
  //.
  //. > S.chain(S.parseInt(10), S.Just('123'))
  //. Just(123)
  //.
  //. > S.chain(S.parseInt(10), S.Just('XXX'))
  //. Nothing
  //. ```
  S.chain = def('chain', {m: [Z.Chain]}, [Fn(a, m(b)), m(a), m(b)], Z.chain);

  //# join :: Chain m => m (m a) -> m a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.join`][].
  //. Removes one level of nesting from a nested monadic structure.
  //.
  //. ```javascript
  //. > S.join([[1], [2], [3]])
  //. [1, 2, 3]
  //.
  //. > S.join([[[1, 2, 3]]])
  //. [[1, 2, 3]]
  //.
  //. > S.join(S.Just(S.Just(1)))
  //. S.Just(1)
  //. ```
  //.
  //. Replacing `Chain m => m` with `Function x` produces the W combinator
  //. from combinatory logic:
  //.
  //.     Chain m => m (m a) -> m a
  //.     Function x (Function x a) -> Function x a
  //.     (x -> x -> a) -> (x -> a)
  //.
  //. ```javascript
  //. > S.join(S.concat)('abc')
  //. 'abcabc'
  //. ```
  S.join = def('join', {m: [Z.Chain]}, [m(m(a)), m(a)], Z.join);

  //# chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b
  //.
  //. Performs a [`chain`](#chain)-like computation with constant stack usage.
  //. Similar to [`Z.chainRec`][], but curried and more convenient due to the
  //. use of the Either type to indicate completion (via a Right).
  //.
  //. ```javascript
  //. > S.chainRec(Array,
  //. .            s => s.length === 2 ? S.map(S.Right, [s + '!', s + '?'])
  //. .                                : S.map(S.Left, [s + 'o', s + 'n']),
  //. .            '')
  //. ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
  //. ```
  function chainRec(typeRep, f, x) {
    function step(next, done, x) {
      return Z.map(function(e) { return either(next, done, e); }, f(x));
    }
    return Z.chainRec(typeRep, step, x);
  }
  S.chainRec =
  def('chainRec',
      {m: [Z.ChainRec]},
      [TypeRep($.TypeVariable('m')), Fn(a, m($Either(a, b))), a, m(b)],
      chainRec);

  //# extend :: Extend w => (w a -> b) -> w a -> w b
  //.
  //. Curried version of [`Z.extend`][].
  //.
  //. ```javascript
  //. > S.extend(xs => xs.length, ['foo', 'bar', 'baz', 'quux'])
  //. [4]
  //. ```
  S.extend =
  def('extend', {w: [Z.Extend]}, [Fn(w(a), b), w(a), w(b)], Z.extend);

  //# extract :: Comonad w => w a -> a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.extract`][].
  S.extract =
  def('extract', {w: [Z.Comonad]}, [w(a), a], Z.extract);

  //# contramap :: Contravariant f => (b -> a) -> f a -> f b
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.contramap`][].
  //.
  //. ```javascript
  //. > S.contramap(s => s.length, Math.sqrt)('Sanctuary')
  //. 3
  //. ```
  S.contramap =
  def('contramap',
      {f: [Z.Contravariant]},
      [Fn(b, a), f(a), f(b)],
      Z.contramap);

  //# filter :: (Applicative f, Foldable f, Monoid (f a)) => (a -> Boolean) -> f a -> f a
  //.
  //. Curried version of [`Z.filter`][].
  //.
  //. See also [`filterM`](#filterM).
  //.
  //. ```javascript
  //. > S.filter(S.odd, [1, 2, 3, 4, 5])
  //. [1, 3, 5]
  //. ```
  S.filter =
  def('filter',
      {f: [Z.Applicative, Z.Foldable, Z.Monoid]},
      [Fn(a, $.Boolean), f(a), f(a)],
      Z.filter);

  //# filterM :: (Alternative m, Monad m) => (a -> Boolean) -> m a -> m a
  //.
  //. Curried version of [`Z.filterM`][].
  //.
  //. See also [`filter`](#filter).
  //.
  //. ```javascript
  //. > S.filterM(S.odd, [1, 2, 3, 4, 5])
  //. [1, 3, 5]
  //.
  //. > S.filterM(S.odd, S.Just(9))
  //. Just(9)
  //.
  //. > S.filterM(S.odd, S.Just(4))
  //. Nothing
  //. ```
  S.filterM =
  def('filterM',
      {m: [Z.Alternative, Z.Monad]},
      [Fn(a, $.Boolean), m(a), m(a)],
      Z.filterM);

  //# takeWhile :: (Foldable f, Alternative f) => (a -> Boolean) -> f a -> f a
  //.
  //. Discards the first inner value which does not satisfy the predicate, and
  //. all subsequent inner values.
  //.
  //. ```javascript
  //. > S.takeWhile(S.odd, [3, 3, 3, 7, 6, 3, 5, 4])
  //. [3, 3, 3, 7]
  //.
  //. > S.takeWhile(S.even, [3, 3, 3, 7, 6, 3, 5, 4])
  //. []
  //. ```
  function Array$takeWhile(pred, xs) {
    var idx = 0;
    while (idx < xs.length && pred(xs[idx])) idx += 1;
    return xs.slice(0, idx);
  }

  function takeWhile(pred, xs) {
    if (Array.isArray(xs)) return Array$takeWhile(pred, xs);
    var done = false;
    function takeWhileReducer(xs, x) {
      return !done && pred(x) ? append(x, xs) : (done = true, xs);
    }
    return Z.reduce(takeWhileReducer, Z.empty(xs.constructor), xs);
  }
  S.takeWhile =
  def('takeWhile',
      {f: [Z.Foldable, Z.Alternative]},
      [Pred(a), f(a), f(a)],
      takeWhile);

  //# dropWhile :: (Foldable f, Alternative f) => (a -> Boolean) -> f a -> f a
  //.
  //. Retains the first inner value which does not satisfy the predicate, and
  //. all subsequent inner values.
  //.
  //. ```javascript
  //. > S.dropWhile(S.odd, [3, 3, 3, 7, 6, 3, 5, 4])
  //. [6, 3, 5, 4]
  //.
  //. > S.dropWhile(S.even, [3, 3, 3, 7, 6, 3, 5, 4])
  //. [3, 3, 3, 7, 6, 3, 5, 4]
  //. ```
  function Array$dropWhile(pred, xs) {
    var idx = 0;
    while (idx < xs.length && pred(xs[idx])) idx += 1;
    return xs.slice(idx);
  }

  function dropWhile(pred, xs) {
    if (Array.isArray(xs)) return Array$dropWhile(pred, xs);
    var done = false;
    function dropWhileReducer(xs, x) {
      return !done && pred(x) ? xs : (done = true, append(x, xs));
    }
    return Z.reduce(dropWhileReducer, Z.empty(xs.constructor), xs);
  }
  S.dropWhile =
  def('dropWhile',
      {f: [Z.Foldable, Z.Alternative]},
      [Pred(a), f(a), f(a)],
      dropWhile);

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
  //. > S.map(S.K(42), S.range(0, 5))
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
  //. > S.map(S.A(S.__, 100), [S.inc, Math.sqrt])
  //. [101, 10]
  //. ```
  function A(f, x) {
    return f(x);
  }
  S.A = def('A', {}, [Fn(a, b), a, b], A);

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
  //. > S.map(S.T(100), [S.inc, Math.sqrt])
  //. [101, 10]
  //. ```
  function T(x, f) {
    return f(x);
  }
  S.T = def('T', {}, [a, Fn(a, b), b], T);

  //. ### Function

  //# curry2 :: ((a, b) -> c) -> a -> b -> c
  //.
  //. Curries the given binary function.
  //.
  //. ```javascript
  //. > S.map(S.curry2(Math.pow)(10), [1, 2, 3])
  //. [10, 100, 1000]
  //.
  //. > S.map(S.curry2(Math.pow, 10), [1, 2, 3])
  //. [10, 100, 1000]
  //. ```
  function curry2(f, x, y) {
    return f(x, y);
  }
  S.curry2 =
  def('curry2',
      {},
      [$.Function([a, b, c]), a, b, c],
      curry2);

  //# curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d
  //.
  //. Curries the given ternary function.
  //.
  //. ```javascript
  //. > global.replaceString = S.curry3((what, replacement, string) =>
  //. .   string.replace(what, replacement)
  //. . )
  //. replaceString
  //.
  //. > replaceString('banana')('orange')('banana icecream')
  //. 'orange icecream'
  //.
  //. > replaceString('banana', 'orange', 'banana icecream')
  //. 'orange icecream'
  //. ```
  function curry3(f, x, y, z) {
    return f(x, y, z);
  }
  S.curry3 =
  def('curry3',
      {},
      [$.Function([a, b, c, d]), a, b, c, d],
      curry3);

  //# curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e
  //.
  //. Curries the given quaternary function.
  //.
  //. ```javascript
  //. > global.createRect = S.curry4((x, y, width, height) =>
  //. .   ({x, y, width, height})
  //. . )
  //. createRect
  //.
  //. > createRect(0)(0)(10)(10)
  //. {x: 0, y: 0, width: 10, height: 10}
  //.
  //. > createRect(0, 0, 10, 10)
  //. {x: 0, y: 0, width: 10, height: 10}
  //. ```
  function curry4(f, w, x, y, z) {
    return f(w, x, y, z);
  }
  S.curry4 =
  def('curry4',
      {},
      [$.Function([a, b, c, d, e]), a, b, c, d, e],
      curry4);

  //# curry5 :: ((a, b, c, d, e) -> f) -> a -> b -> c -> d -> e -> f
  //.
  //. Curries the given quinary function.
  //.
  //. ```javascript
  //. > global.toUrl = S.curry5((protocol, creds, hostname, port, pathname) =>
  //. .   protocol + '//' +
  //. .   S.maybe('', _ => _.username + ':' + _.password + '@', creds) +
  //. .   hostname +
  //. .   S.maybe('', S.concat(':'), port) +
  //. .   pathname
  //. . )
  //. toUrl
  //.
  //. > toUrl('https:')(S.Nothing)('example.com')(S.Just('443'))('/foo/bar')
  //. 'https://example.com:443/foo/bar'
  //.
  //. > toUrl('https:', S.Nothing, 'example.com', S.Just('443'), '/foo/bar')
  //. 'https://example.com:443/foo/bar'
  //. ```
  function curry5(f, v, w, x, y, z) {
    return f(v, w, x, y, z);
  }
  S.curry5 =
  def('curry5',
      {},
      [$.Function([a, b, c, d, e, r]), a, b, c, d, e, r],
      curry5);

  //# flip :: (a -> b -> c) -> b -> a -> c
  //.
  //. Takes a curried binary function and two values, and returns the
  //. result of applying the function to the values in reverse order.
  //.
  //. This is the C combinator from combinatory logic.
  //.
  //. ```javascript
  //. > S.flip(S.concat, 'foo', 'bar')
  //. 'barfoo'
  //. ```
  function flip(f, x, y) {
    return f(y)(x);
  }
  S.flip = def('flip', {}, [Fn(a, Fn(b, c)), b, a, c], flip);

  //# flip_ :: ((a, b) -> c) -> b -> a -> c
  //.
  //. Variant of [`flip`](#flip) which takes an uncurried binary function.
  function flip_(f, x, y) {
    return f(y, x);
  }
  S.flip_ = def('flip_', {}, [$.Function([a, b, c]), b, a, c], flip_);

  //. ### Composition

  //# compose :: (b -> c) -> (a -> b) -> a -> c
  //.
  //. Composes two unary functions, from right to left. Equivalent to Haskell's
  //. `(.)` function.
  //.
  //. This is the B combinator from combinatory logic.
  //.
  //. See also [`pipe`](#pipe).
  //.
  //. ```javascript
  //. > S.compose(Math.sqrt, S.inc)(99)
  //. 10
  //. ```
  function compose(f, g, x) {
    return f(g(x));
  }
  S.compose = def('compose', {}, [Fn(b, c), Fn(a, b), a, c], compose);

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
    return Z.reduce(function(x, f) { return f(x); }, x, fs);
  }
  S.pipe = def('pipe', {}, [$.Array($.AnyFunction), a, b], pipe);

  //# on :: (b -> b -> c) -> (a -> b) -> a -> a -> c
  //.
  //. Takes a binary function `f`, a unary function `g`, and two
  //. values `x` and `y`. Returns `f(g(x))(g(y))`.
  //.
  //. This is the P combinator from combinatory logic.
  //.
  //. See also [`on_`](#on_).
  //.
  //. ```javascript
  //. > S.on(S.concat, S.reverse, [1, 2, 3], [4, 5, 6])
  //. [3, 2, 1, 6, 5, 4]
  //. ```
  function on(f, g, x, y) {
    return on_(uncurry2(f), g, x, y);
  }
  S.on = def('on', {}, [Fn(b, Fn(b, c)), Fn(a, b), a, a, c], on);

  //# on_ :: ((b, b) -> c) -> (a -> b) -> a -> a -> c
  //.
  //. Variant of [`on`](#on) which takes an uncurried binary function.
  function on_(f, g, x, y) {
    return f(g(x), g(y));
  }
  S.on_ = def('on_', {}, [$.Function([b, b, c]), Fn(a, b), a, a, c], on_);

  //. ### Maybe type
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either a Just whose value is of type `a` or Nothing (with no value).
  //.
  //. The Maybe type satisfies the [Setoid][], [Monoid][], [Monad][],
  //. [Alternative][], [Traversable][], and [Extend][] specifications.

  //# MaybeType :: Type -> Type
  //.
  //. A [`UnaryType`][UnaryType] for use with [sanctuary-def][].
  S.MaybeType = $Maybe;

  //# Maybe :: TypeRep Maybe
  //.
  //. The [type representative](#type-representatives) for the Maybe type.
  var Maybe = S.Maybe = {prototype: _Maybe.prototype};

  Maybe.prototype.constructor = Maybe;

  function _Maybe(tag, value) {
    this.isNothing = tag === 'Nothing';
    this.isJust = tag === 'Just';
    if (this.isJust) this.value = value;

    //  Add "fantasy-land/concat" method conditionally so that Just('abc')
    //  satisfies the requirements of Semigroup but Just(123) does not.
    if (this.isNothing || Z.Semigroup.test(this.value)) {
      this['fantasy-land/concat'] = Maybe$prototype$concat;
    }
  }

  //# Nothing :: Maybe a
  //.
  //. Nothing.
  //.
  //. ```javascript
  //. > S.Nothing
  //. Nothing
  //. ```
  var Nothing = S.Nothing = new _Maybe('Nothing');

  //# Just :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Just(42)
  //. Just(42)
  //. ```
  function Just(x) {
    return new _Maybe('Just', x);
  }
  S.Just = def('Just', {}, [a, $Maybe(a)], Just);

  //# Maybe.@@type :: String
  //.
  //. Maybe type identifier, `'sanctuary/Maybe'`.
  Maybe['@@type'] = maybeTypeIdent;

  //# Maybe.fantasy-land/empty :: () -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > S.empty(S.Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/empty'] = function() { return Nothing; };

  //# Maybe.fantasy-land/of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.of(S.Maybe, 42)
  //. Just(42)
  //. ```
  Maybe['fantasy-land/of'] = Just;

  //# Maybe.fantasy-land/zero :: () -> Maybe a
  //.
  //. Returns Nothing.
  //.
  //. ```javascript
  //. > S.zero(S.Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/zero'] = function() { return Nothing; };

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

  //# Maybe#toString :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe.
  //.
  //. ```javascript
  //. > S.toString(S.Nothing)
  //. 'Nothing'
  //.
  //. > S.toString(S.Just([1, 2, 3]))
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.toString = function() {
    return this.isJust ? 'Just(' + Z.toString(this.value) + ')' : 'Nothing';
  };

  //# Maybe#inspect :: Maybe a ~> () -> String
  //.
  //. Returns the string representation of the Maybe. This method is used by
  //. `util.inspect` and the REPL to format a Maybe for display.
  //.
  //. See also [`Maybe#toString`][].
  //.
  //. ```javascript
  //. > S.Nothing.inspect()
  //. 'Nothing'
  //.
  //. > S.Just([1, 2, 3]).inspect()
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.inspect = function() { return this.toString(); };

  //# Maybe#fantasy-land/equals :: Maybe a ~> Maybe a -> Boolean
  //.
  //. Takes a value of the same type and returns `true` if:
  //.
  //.   - it is Nothing and `this` is Nothing; or
  //.
  //.   - it is a Just and `this` is a Just, and their values are equal
  //.     according to [`equals`](#equals).
  //.
  //. ```javascript
  //. > S.equals(S.Nothing, S.Nothing)
  //. true
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Just([1, 2, 3]))
  //. true
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Just([3, 2, 1]))
  //. false
  //.
  //. > S.equals(S.Just([1, 2, 3]), S.Nothing)
  //. false
  //. ```
  Maybe.prototype['fantasy-land/equals'] = function(other) {
    return this.isNothing ? other.isNothing
                          : other.isJust && Z.equals(other.value, this.value);
  };

  //# Maybe#fantasy-land/concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
  //.
  //. Returns the result of concatenating two Maybe values of the same type.
  //. `a` must have a [Semigroup][].
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
  //. > S.concat(S.Nothing, S.Nothing)
  //. Nothing
  //.
  //. > S.concat(S.Just([1, 2, 3]), S.Just([4, 5, 6]))
  //. Just([1, 2, 3, 4, 5, 6])
  //.
  //. > S.concat(S.Nothing, S.Just([1, 2, 3]))
  //. Just([1, 2, 3])
  //.
  //. > S.concat(S.Just([1, 2, 3]), S.Nothing)
  //. Just([1, 2, 3])
  //. ```
  function Maybe$prototype$concat(other) {
    return this.isNothing ?
      other :
      other.isNothing ? this : Just(Z.concat(this.value, other.value));
  }

  //# Maybe#fantasy-land/map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to this Just's value.
  //.
  //. ```javascript
  //. > S.map(Math.sqrt, S.Nothing)
  //. Nothing
  //.
  //. > S.map(Math.sqrt, S.Just(9))
  //. Just(3)
  //. ```
  Maybe.prototype['fantasy-land/map'] = function(f) {
    return this.isJust ? Just(f(this.value)) : this;
  };

  //# Maybe#fantasy-land/ap :: Maybe a ~> Maybe (a -> b) -> Maybe b
  //.
  //. Takes a Maybe and returns Nothing unless `this` is a Just *and* the
  //. argument is a Just, in which case it returns a Just whose value is
  //. the result of applying the given Just's value to this Just's value.
  //.
  //. ```javascript
  //. > S.ap(S.Nothing, S.Nothing)
  //. Nothing
  //.
  //. > S.ap(S.Nothing, S.Just(9))
  //. Nothing
  //.
  //. > S.ap(S.Just(Math.sqrt), S.Nothing)
  //. Nothing
  //.
  //. > S.ap(S.Just(Math.sqrt), S.Just(9))
  //. Just(3)
  //. ```
  Maybe.prototype['fantasy-land/ap'] = function(other) {
    return other.isJust ? Z.map(other.value, this) : other;
  };

  //# Maybe#fantasy-land/chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns the result of applying the function to this Just's value.
  //.
  //. ```javascript
  //. > S.chain(S.parseFloat, S.Nothing)
  //. Nothing
  //.
  //. > S.chain(S.parseFloat, S.Just('xxx'))
  //. Nothing
  //.
  //. > S.chain(S.parseFloat, S.Just('12.34'))
  //. Just(12.34)
  //. ```
  Maybe.prototype['fantasy-land/chain'] = function(f) {
    return this.isJust ? f(this.value) : this;
  };

  //# Maybe#fantasy-land/alt :: Maybe a ~> Maybe a -> Maybe a
  //.
  //. Chooses between `this` and the other Maybe provided as an argument.
  //. Returns `this` if `this` is a Just; the other Maybe otherwise.
  //.
  //. ```javascript
  //. > S.alt(S.Nothing, S.Nothing)
  //. Nothing
  //.
  //. > S.alt(S.Nothing, S.Just(1))
  //. Just(1)
  //.
  //. > S.alt(S.Just(2), S.Nothing)
  //. Just(2)
  //.
  //. > S.alt(S.Just(3), S.Just(4))
  //. Just(3)
  //. ```
  Maybe.prototype['fantasy-land/alt'] = function(other) {
    return this.isJust ? this : other;
  };

  //# Maybe#fantasy-land/reduce :: Maybe a ~> ((b, a) -> b, b) -> b
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is Nothing; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Just's value.
  //.
  //. ```javascript
  //. > S.reduce_(Math.pow, 10, S.Nothing)
  //. 10
  //.
  //. > S.reduce_(Math.pow, 10, S.Just(3))
  //. 1000
  //. ```
  Maybe.prototype['fantasy-land/reduce'] = function(f, x) {
    return this.isJust ? f(x, this.value) : x;
  };

  //# Maybe#fantasy-land/traverse :: Applicative f => Maybe a ~> (TypeRep f, a -> f b) -> f (Maybe b)
  //.
  //. Takes the type representative of some [Applicative][] and a function
  //. which returns a value of that Applicative, and returns:
  //.
  //.   - the result of applying the type representative's [`of`][] function to
  //.     `this` if `this` is Nothing; otherwise
  //.
  //.   - the result of mapping [`Just`](#Just) over the result of applying the
  //.     first function to this Just's value.
  //.
  //. ```javascript
  //. > S.traverse(Array, S.words, S.Nothing)
  //. [Nothing]
  //.
  //. > S.traverse(Array, S.words, S.Just('foo bar baz'))
  //. [Just('foo'), Just('bar'), Just('baz')]
  //. ```
  Maybe.prototype['fantasy-land/traverse'] = function(typeRep, f) {
    return this.isJust ? Z.map(Just, f(this.value)) : Z.of(typeRep, this);
  };

  //# Maybe#fantasy-land/extend :: Maybe a ~> (Maybe a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function
  //. to `this`.
  //.
  //. ```javascript
  //. > S.extend(x => x.value + 1, S.Nothing)
  //. Nothing
  //.
  //. > S.extend(x => x.value + 1, S.Just(42))
  //. Just(43)
  //. ```
  Maybe.prototype['fantasy-land/extend'] = function(f) {
    return this.isJust ? Just(f(this)) : this;
  };

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
  //. See also [`fromMaybe_`](#fromMaybe_) and
  //. [`maybeToNullable`](#maybeToNullable).
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

  //# fromMaybe_ :: (() -> a) -> Maybe a -> a
  //.
  //. Variant of [`fromMaybe`](#fromMaybe) which takes a thunk so the default
  //. value is only computed if required.
  //.
  //. ```javascript
  //. > function fib(n) { return n <= 1 ? n : fib(n - 2) + fib(n - 1); }
  //.
  //. > S.fromMaybe_(() => fib(30), S.Just(1000000))
  //. 1000000
  //.
  //. > S.fromMaybe_(() => fib(30), S.Nothing)
  //. 832040
  //. ```
  function fromMaybe_(thunk, maybe) {
    return maybe.isJust ? maybe.value : thunk();
  }
  S.fromMaybe_ = def('fromMaybe_', {}, [Thunk(a), $Maybe(a), a], fromMaybe_);

  //# maybeToNullable :: Maybe a -> Nullable a
  //.
  //. Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
  //. [Nullable][] is defined in [sanctuary-def][].
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
  //. See also [`maybe_`](#maybe_).
  //.
  //. ```javascript
  //. > S.maybe(0, S.prop('length'), S.Just('refuge'))
  //. 6
  //.
  //. > S.maybe(0, S.prop('length'), S.Nothing)
  //. 0
  //. ```
  function maybe(x, f, maybe) {
    return fromMaybe(x, Z.map(f, maybe));
  }
  S.maybe = def('maybe', {}, [b, Fn(a, b), $Maybe(a), b], maybe);

  //# maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b
  //.
  //. Variant of [`maybe`](#maybe) which takes a thunk so the default value
  //. is only computed if required.
  //.
  //. ```javascript
  //. > function fib(n) { return n <= 1 ? n : fib(n - 2) + fib(n - 1); }
  //.
  //. > S.maybe_(() => fib(30), Math.sqrt, S.Just(1000000))
  //. 1000
  //.
  //. > S.maybe_(() => fib(30), Math.sqrt, S.Nothing)
  //. 832040
  //. ```
  function maybe_(thunk, f, maybe) {
    return maybe.isJust ? f(maybe.value) : thunk();
  }
  S.maybe_ = def('maybe_', {}, [Thunk(b), Fn(a, b), $Maybe(a), b], maybe_);

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
    return Z.reduce(function(xs, maybe) {
      if (maybe.isJust) xs.push(maybe.value);
      return xs;
    }, [], maybes);
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
    return justs(Z.map(f, xs));
  }
  S.mapMaybe =
  def('mapMaybe', {}, [Fn(a, $Maybe(b)), $.Array(a), $.Array(b)], mapMaybe);

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
  S.encase = def('encase', {}, [Fn(a, b), a, $Maybe(b)], encase);

  //# encase2 :: (a -> b -> c) -> a -> b -> Maybe c
  //.
  //. Binary version of [`encase`](#encase).
  //.
  //. See also [`encase2_`](#encase2_).
  function encase2(f, x, y) {
    return encase2_(uncurry2(f), x, y);
  }
  S.encase2 = def('encase2', {}, [Fn(a, Fn(b, c)), a, b, $Maybe(c)], encase2);

  //# encase2_ :: ((a, b) -> c) -> a -> b -> Maybe c
  //.
  //. Variant of [`encase2`](#encase2) which takes an uncurried binary
  //. function.
  function encase2_(f, x, y) {
    try {
      return Just(f(x, y));
    } catch (err) {
      return Nothing;
    }
  }
  S.encase2_ =
  def('encase2_', {}, [$.Function([a, b, c]), a, b, $Maybe(c)], encase2_);

  //# encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d
  //.
  //. Ternary version of [`encase`](#encase).
  //.
  //. See also [`encase3_`](#encase3_).
  function encase3(f, x, y, z) {
    return encase3_(uncurry3(f), x, y, z);
  }
  S.encase3 =
  def('encase3', {}, [Fn(a, Fn(b, Fn(c, d))), a, b, c, $Maybe(d)], encase3);

  //# encase3_ :: ((a, b, c) -> d) -> a -> b -> c -> Maybe d
  //.
  //. Variant of [`encase3`](#encase3) which takes an uncurried ternary
  //. function.
  function encase3_(f, x, y, z) {
    try {
      return Just(f(x, y, z));
    } catch (err) {
      return Nothing;
    }
  }
  S.encase3_ =
  def('encase3_',
      {},
      [$.Function([a, b, c, d]), a, b, c, $Maybe(d)],
      encase3_);

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
  //. The Either type satisfies the [Setoid][], [Semigroup][], [Monad][],
  //. [Alt][], [Traversable][], [Extend][], and [Bifunctor][] specifications.

  //# EitherType :: Type -> Type -> Type
  //.
  //. A [`BinaryType`][BinaryType] for use with [sanctuary-def][].
  S.EitherType = $Either;

  //# Either :: TypeRep Either
  //.
  //. The [type representative](#type-representatives) for the Either type.
  var Either = S.Either = {prototype: _Either.prototype};

  Either.prototype.constructor = Either;

  function _Either(tag, value) {
    this.isLeft = tag === 'Left';
    this.isRight = tag === 'Right';
    this.value = value;

    //  Add "fantasy-land/concat" method conditionally so that Left('abc')
    //  and Right('abc') satisfy the requirements of Semigroup but Left(123)
    //  and Right(123) do not.
    if (Z.Semigroup.test(this.value)) {
      this['fantasy-land/concat'] = Either$prototype$concat;
    }
  }

  //# Left :: a -> Either a b
  //.
  //. Takes a value of any type and returns a Left with the given value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero')
  //. Left('Cannot divide by zero')
  //. ```
  function Left(x) {
    return new _Either('Left', x);
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
    return new _Either('Right', x);
  }
  S.Right = def('Right', {}, [b, $Either(a, b)], Right);

  //# Either.@@type :: String
  //.
  //. Either type identifier, `'sanctuary/Either'`.
  Either['@@type'] = eitherTypeIdent;

  //# Either.fantasy-land/of :: b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.of(S.Either, 42)
  //. Right(42)
  //. ```
  Either['fantasy-land/of'] = Right;

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

  //# Either#toString :: Either a b ~> () -> String
  //.
  //. Returns the string representation of the Either.
  //.
  //. ```javascript
  //. > S.toString(S.Left('Cannot divide by zero'))
  //. 'Left("Cannot divide by zero")'
  //.
  //. > S.toString(S.Right([1, 2, 3]))
  //. 'Right([1, 2, 3])'
  //. ```
  Either.prototype.toString = function() {
    return (this.isLeft ? 'Left' : 'Right') +
           '(' + Z.toString(this.value) + ')';
  };

  //# Either#inspect :: Either a b ~> () -> String
  //.
  //. Returns the string representation of the Either. This method is used by
  //. `util.inspect` and the REPL to format a Either for display.
  //.
  //. See also [`Either#toString`][].
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').inspect()
  //. 'Left("Cannot divide by zero")'
  //.
  //. > S.Right([1, 2, 3]).inspect()
  //. 'Right([1, 2, 3])'
  //. ```
  Either.prototype.inspect = function() { return this.toString(); };

  //# Either#fantasy-land/equals :: Either a b ~> Either a b -> Boolean
  //.
  //. Takes a value of the same type and returns `true` if:
  //.
  //.   - it is a Left and `this` is a Left, and their values are equal
  //.     according to [`equals`](#equals); or
  //.
  //.   - it is a Right and `this` is a Right, and their values are equal
  //.     according to [`equals`](#equals).
  //.
  //. ```javascript
  //. > S.equals(S.Right([1, 2, 3]), S.Right([1, 2, 3]))
  //. true
  //.
  //. > S.equals(S.Right([1, 2, 3]), S.Left([1, 2, 3]))
  //. false
  //. ```
  Either.prototype['fantasy-land/equals'] = function(other) {
    return other.isLeft === this.isLeft && Z.equals(other.value, this.value);
  };

  //# Either#fantasy-land/concat :: (Semigroup a, Semigroup b) => Either a b ~> Either a b -> Either a b
  //.
  //. Returns the result of concatenating two Either values of the same type.
  //. `a` must have a [Semigroup][], as must `b`.
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
  //. > S.concat(S.Left('abc'), S.Left('def'))
  //. Left('abcdef')
  //.
  //. > S.concat(S.Right([1, 2, 3]), S.Right([4, 5, 6]))
  //. Right([1, 2, 3, 4, 5, 6])
  //.
  //. > S.concat(S.Left('abc'), S.Right([1, 2, 3]))
  //. Right([1, 2, 3])
  //.
  //. > S.concat(S.Right([1, 2, 3]), S.Left('abc'))
  //. Right([1, 2, 3])
  //. ```
  function Either$prototype$concat(other) {
    return this.isLeft ?
      other.isLeft ? Left(Z.concat(this.value, other.value)) : other :
      other.isLeft ? this : Right(Z.concat(this.value, other.value));
  }

  //# Either#fantasy-land/map :: Either a b ~> (b -> c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise it
  //. returns a Right whose value is the result of applying the function to
  //. this Right's value.
  //.
  //. See also [`Either#fantasy-land/bimap`][].
  //.
  //. ```javascript
  //. > S.map(Math.sqrt, S.Left('Cannot divide by zero'))
  //. Left('Cannot divide by zero')
  //.
  //. > S.map(Math.sqrt, S.Right(9))
  //. Right(3)
  //. ```
  Either.prototype['fantasy-land/map'] = function(f) {
    return this.isRight ? Right(f(this.value)) : this;
  };

  //# Either#fantasy-land/bimap :: Either a b ~> (a -> c, b -> d) -> Either c d
  //.
  //. Takes two functions and returns:
  //.
  //.   - a Left whose value is the result of applying the first function
  //.     to this Left's value if `this` is a Left; otherwise
  //.
  //.   - a Right whose value is the result of applying the second function
  //.     to this Right's value.
  //.
  //. Similar to [`Either#fantasy-land/map`][], but supports mapping over the
  //. left side as well as the right side.
  //.
  //. ```javascript
  //. > S.bimap(S.toUpper, S.inc, S.Left('abc'))
  //. Left('ABC')
  //.
  //. > S.bimap(S.toUpper, S.inc, S.Right(42))
  //. Right(43)
  //. ```
  Either.prototype['fantasy-land/bimap'] = function(f, g) {
    return this.isLeft ? Left(f(this.value)) : Right(g(this.value));
  };

  //# Either#fantasy-land/ap :: Either a b ~> Either a (b -> c) -> Either a c
  //.
  //. Takes an Either and returns a Left unless `this` is a Right *and* the
  //. argument is a Right, in which case it returns a Right whose value is
  //. the result of applying the given Right's value to this Right's value.
  //.
  //. ```javascript
  //. > S.ap(S.Left('No such function'), S.Left('Cannot divide by zero'))
  //. Left('No such function')
  //.
  //. > S.ap(S.Left('No such function'), S.Right(9))
  //. Left('No such function')
  //.
  //. > S.ap(S.Right(Math.sqrt), S.Left('Cannot divide by zero'))
  //. Left('Cannot divide by zero')
  //.
  //. > S.ap(S.Right(Math.sqrt), S.Right(9))
  //. Right(3)
  //. ```
  Either.prototype['fantasy-land/ap'] = function(other) {
    return other.isRight ? Z.map(other.value, this) : other;
  };

  //# Either#fantasy-land/chain :: Either a b ~> (b -> Either a c) -> Either a c
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
  //. > S.chain(sqrt, S.Left('Cannot divide by zero'))
  //. Left('Cannot divide by zero')
  //.
  //. > S.chain(sqrt, S.Right(-1))
  //. Left('Cannot represent square root of negative number')
  //.
  //. > S.chain(sqrt, S.Right(25))
  //. Right(5)
  //. ```
  Either.prototype['fantasy-land/chain'] = function(f) {
    return this.isRight ? f(this.value) : this;
  };

  //# Either#fantasy-land/alt :: Either a b ~> Either a b -> Either a b
  //.
  //. Chooses between `this` and the other Either provided as an argument.
  //. Returns `this` if `this` is a Right; the other Either otherwise.
  //.
  //. ```javascript
  //. > S.alt(S.Left('A'), S.Left('B'))
  //. Left('B')
  //.
  //. > S.alt(S.Left('C'), S.Right(1))
  //. Right(1)
  //.
  //. > S.alt(S.Right(2), S.Left('D'))
  //. Right(2)
  //.
  //. > S.alt(S.Right(3), S.Right(4))
  //. Right(3)
  //. ```
  Either.prototype['fantasy-land/alt'] = function(other) {
    return this.isRight ? this : other;
  };

  //# Either#fantasy-land/reduce :: Either a b ~> ((c, b) -> c, c) -> c
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is a Left; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Right's value.
  //.
  //. ```javascript
  //. > S.reduce_(Math.pow, 10, S.Left('Cannot divide by zero'))
  //. 10
  //.
  //. > S.reduce_(Math.pow, 10, S.Right(3))
  //. 1000
  //. ```
  Either.prototype['fantasy-land/reduce'] = function(f, x) {
    return this.isRight ? f(x, this.value) : x;
  };

  //# Either#fantasy-land/traverse :: Applicative f => Either a b ~> (TypeRep f, b -> f c) -> f (Either a c)
  //.
  //. Takes the type representative of some [Applicative][] and a function
  //. which returns a value of that Applicative, and returns:
  //.
  //.   - the result of applying the type representative's [`of`][] function to
  //.     `this` if `this` is a Left; otherwise
  //.
  //.   - the result of mapping [`Right`](#Right) over the result of applying
  //.     the first function to this Right's value.
  //.
  //. ```javascript
  //. > S.traverse(Array, S.words, S.Left('Request failed'))
  //. [Left('Request failed')]
  //.
  //. > S.traverse(Array, S.words, S.Right('foo bar baz'))
  //. [Right('foo'), Right('bar'), Right('baz')]
  //. ```
  Either.prototype['fantasy-land/traverse'] = function(typeRep, f) {
    return this.isRight ? Z.map(Right, f(this.value)) : Z.of(typeRep, this);
  };

  //# Either#fantasy-land/extend :: Either a b ~> (Either a b -> c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise it
  //. returns a Right whose value is the result of applying the function to
  //. `this`.
  //.
  //. ```javascript
  //. > S.extend(x => x.value + 1, S.Left('Cannot divide by zero'))
  //. Left('Cannot divide by zero')
  //.
  //. > S.extend(x => x.value + 1, S.Right(42))
  //. Right(43)
  //. ```
  Either.prototype['fantasy-land/extend'] = function(f) {
    return this.isLeft ? this : Right(f(this));
  };

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
  //. > S.map(S.prop('0'), S.toEither('Invalid protocol', 'ftp://example.com/'.match(/^https?:/)))
  //. Left('Invalid protocol')
  //.
  //. > S.map(S.prop('0'), S.toEither('Invalid protocol', 'https://example.com/'.match(/^https?:/)))
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
  //. > S.either(S.toUpper, S.toString, S.Left('Cannot divide by zero'))
  //. 'CANNOT DIVIDE BY ZERO'
  //.
  //. > S.either(S.toUpper, S.toString, S.Right(42))
  //. '42'
  //. ```
  function either(l, r, either) {
    return either.isLeft ? l(either.value) : r(either.value);
  }
  S.either = def('either', {}, [Fn(a, c), Fn(b, c), $Either(a, b), c], either);

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
    return Z.reduce(function(xs, either) {
      if (either.isLeft) xs.push(either.value);
      return xs;
    }, [], eithers);
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
    return Z.reduce(function(xs, either) {
      if (either.isRight) xs.push(either.value);
      return xs;
    }, [], eithers);
  }
  S.rights = def('rights', {}, [$.Array($Either(a, b)), $.Array(b)], rights);

  //# tagBy :: (a -> Boolean) -> a -> Either a a
  //.
  //. Takes a predicate and a value, and returns a Right of the value if it
  //. satisfies the predicate; a Left of the value otherwise.
  //.
  //. ```javascript
  //. > S.tagBy(S.odd, 0)
  //. Left(0)
  //
  //. > S.tagBy(S.odd, 1)
  //. Right(1)
  //
  //. > S.compose(S.bimap(S.dec, S.inc), S.tagBy(S.odd))(5)
  //. Right(6)
  //. ```
  function tagBy(pred, a) {
    return pred(a) ? Right(a) : Left(a);
  }
  S.tagBy = def('tagBy', {}, [Fn(a, $.Boolean), a, $Either(a, a)], tagBy);

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
      [Fn($.Error, l), Fn(a, r), a, $Either(l, r)],
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
      [Fn($.Error, l), Fn(a, Fn(b, r)), a, b, $Either(l, r)],
      encaseEither2);

  //# encaseEither2_ :: (Error -> l) -> ((a, b) -> r) -> a -> b -> Either l r
  //.
  //. Variant of [`encaseEither2`](#encaseEither2) which takes an uncurried
  //. binary function.
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
      [Fn($.Error, l), $.Function([a, b, r]), a, b, $Either(l, r)],
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
      [Fn($.Error, l), Fn(a, Fn(b, Fn(c, r))), a, b, c, $Either(l, r)],
      encaseEither3);

  //# encaseEither3_ :: (Error -> l) -> ((a, b, c) -> r) -> a -> b -> c -> Either l r
  //.
  //. Variant of [`encaseEither3`](#encaseEither3) which takes an uncurried
  //. ternary function.
  function encaseEither3_(f, g, x, y, z) {
    try {
      return Right(g(x, y, z));
    } catch (err) {
      return Left(f(err));
    }
  }
  S.encaseEither3_ =
  def('encaseEither3_',
      {},
      [Fn($.Error, l), $.Function([a, b, c, r]), a, b, c, $Either(l, r)],
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
  //. See also [`complement`](#complement).
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

  //# complement :: (a -> Boolean) -> a -> Boolean
  //.
  //. Takes a unary predicate and a value of any type, and returns the logical
  //. negation of applying the predicate to the value.
  //.
  //. See also [`not`](#not).
  //.
  //. ```javascript
  //. > Number.isInteger(42)
  //. true
  //.
  //. > S.complement(Number.isInteger, 42)
  //. false
  //. ```
  function complement(pred, x) {
    return !pred(x);
  }
  S.complement = def('complement', {}, [Pred(a), a, $.Boolean], complement);

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
  S.ifElse = def('ifElse', {}, [Pred(a), Fn(a, b), Fn(a, b), a, b], ifElse);

  //# when :: (a -> Boolean) -> (a -> a) -> a -> a
  //.
  //. Takes a unary predicate, a unary function, and a value of any type, and
  //. returns the result of applying the function to the value if the value
  //. satisfies the predicate; the value otherwise.
  //.
  //. ```javascript
  //. > S.when(x => x >= 0, Math.sqrt, 16)
  //. 4
  //.
  //. > S.when(x => x >= 0, Math.sqrt, -1)
  //. -1
  //. ```
  function when(pred, f, x) {
    return ifElse(pred, f, I, x);
  }
  S.when = def('when', {}, [Pred(a), Fn(a, a), a, a], when);

  //# unless :: (a -> Boolean) -> (a -> a) -> a -> a
  //.
  //. Takes a unary predicate, a unary function, and a value of any type, and
  //. returns the result of applying the function to the value if the value
  //. does not satisfy the predicate; the value otherwise.
  //.
  //. ```javascript
  //. > S.unless(x => x < 0, Math.sqrt, 16)
  //. 4
  //.
  //. > S.unless(x => x < 0, Math.sqrt, -1)
  //. -1
  //. ```
  function unless(pred, f, x) {
    return ifElse(pred, I, f, x);
  }
  S.unless = def('unless', {}, [Pred(a), Fn(a, a), a, a], unless);

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
  S.allPass = def('allPass', {}, [$.Array(Pred(a)), a, $.Boolean], allPass);

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
  S.anyPass = def('anyPass', {}, [$.Array(Pred(a)), a, $.Boolean], anyPass);

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
    var fromIdx = Z.equals(start, -0) ? len : start < 0 ? start + len : start;
    var toIdx = Z.equals(end, -0) ? len : end < 0 ? end + len : end;

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
    return Z.map(unsafeHead, slice(n, n === -1 ? -0 : n + 1, xs));
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
    return n < 0 || 1 / n < 0 ? Nothing : slice(0, n, xs);
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
    return n < 0 || 1 / n < 0 ? Nothing : slice(-n, -0, xs);
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
    return n < 0 || 1 / n < 0 ? Nothing : slice(n, -0, xs);
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
    return n < 0 || 1 / n < 0 ? Nothing : slice(0, -n, xs);
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
    return $.String._test(xs) ? xs.split('').reverse().join('')
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

  //# append :: (Applicative f, Semigroup (f a)) => a -> f a -> f a
  //.
  //. Returns the result of appending the first argument to the second.
  //.
  //. See also [`prepend`](#prepend).
  //.
  //. ```javascript
  //. > S.append(3, [1, 2])
  //. [1, 2, 3]
  //.
  //. > S.append([1], S.Nothing)
  //. Just([1])
  //.
  //. > S.append([3], S.Just([1, 2]))
  //. Just([1, 2, 3])
  //. ```
  function append(x, xs) {
    return Z.concat(xs, Z.of(xs.constructor, x));
  }
  S.append =
    def('append',
        {f: [Z.Applicative, Z.Semigroup]},
        [a, f(a), f(a)],
        append);

  //# prepend :: (Applicative f, Semigroup (f a)) => a -> f a -> f a
  //.
  //. Returns the result of prepending the first argument to the second.
  //.
  //. See also [`append`](#append).
  //.
  //. ```javascript
  //. > S.prepend(1, [2, 3])
  //. [1, 2, 3]
  //.
  //. > S.prepend([1], S.Nothing)
  //. Just([1])
  //.
  //. > S.prepend([1], S.Just([2, 3]))
  //. Just([1, 2, 3])
  //. ```
  function prepend(x, xs) {
    return Z.concat(Z.of(xs.constructor, x), xs);
  }
  S.prepend =
  def('prepend',
      {f: [Z.Applicative, Z.Semigroup]},
      [a, f(a), f(a)],
      prepend);

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
  S.find = def('find', {}, [Pred(a), $.Array(a), $Maybe(a)], find);

  //# pluck :: (Accessible a, Functor f) => String -> f a -> f b
  //.
  //. Combines [`map`](#map) and [`prop`](#prop). `pluck(k, xs)` is equivalent
  //. to `map(prop(k), xs)`.
  //.
  //. ```javascript
  //. > S.pluck('x', [{x: 1}, {x: 2}, {x: 3}])
  //. [1, 2, 3]
  //.
  //. > S.pluck('x', S.Just({x: 1, y: 2, z: 3}))
  //. Just(1)
  //. ```
  function pluck(key, xs) {
    return Z.map(function(x) {
      if (key in Object(x)) return x[key];
      throw new TypeError('‘pluck’ expected object to have a property named ' +
                          '‘' + key + '’; ' + Z.toString(x) + ' does not');
    }, xs);
  }
  S.pluck =
  def('pluck',
      {a: [Accessible], f: [Z.Functor]},
      [$.String, f(a), f(b)],
      pluck);

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
  S.unfoldr =
  def('unfoldr', {}, [Fn(b, $Maybe($.Pair(a, b))), b, $.Array(a)], unfoldr);

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
  //. See also [`pluck`](#pluck).
  //.
  //. ```javascript
  //. > S.prop('a', {a: 1, b: 2})
  //. 1
  //. ```
  function prop(key, obj) {
    if (key in Object(obj)) return obj[key];
    throw new TypeError('‘prop’ expected object to have a property named ‘' +
                        key + '’; ' + Z.toString(obj) + ' does not');
  }
  S.prop = def('prop', {a: [Accessible]}, [$.String, a, b], prop);

  //# props :: Accessible a => Array String -> a -> b
  //.
  //. Takes a property path (an array of property names) and an object with
  //. known structure and returns the value at the given path. If for some
  //. reason the path does not exist, a type error is thrown.
  //.
  //. For accessing property paths of uncertain objects, use [`gets`](#gets)
  //. instead.
  //.
  //. ```javascript
  //. > S.props(['a', 'b', 'c'], {a: {b: {c: 1}}})
  //. 1
  //. ```
  function props(path, obj) {
    return path.reduce(function(memo, key) {
      if (key in memo) return memo[key];
      throw new TypeError('‘props’ expected object to have a property at ' +
                          Z.toString(path) + '; ' +
                          Z.toString(obj) + ' does not');
    }, Object(obj));
  }
  S.props = def('props', {a: [Accessible]}, [$.Array($.String), a, b], props);

  //# get :: Accessible a => (b -> Boolean) -> String -> a -> Maybe c
  //.
  //. Takes a predicate, a property name, and an object and returns Just the
  //. value of the specified object property if it exists and the value
  //. satisfies the given predicate; Nothing otherwise.
  //.
  //. See also [`gets`](#gets) and [`prop`](#prop).
  //.
  //. ```javascript
  //. > S.get(S.is(Number), 'x', {x: 1, y: 2})
  //. Just(1)
  //.
  //. > S.get(S.is(Number), 'x', {x: '1', y: '2'})
  //. Nothing
  //.
  //. > S.get(S.is(Number), 'x', {})
  //. Nothing
  //. ```
  function get(pred, key, obj) {
    var x = null;
    return key in obj && pred(x = obj[key]) ? Just(x) : Nothing;
  }
  S.get =
  def('get', {a: [Accessible]}, [Pred(b), $.String, a, $Maybe(c)], get);

  //# gets :: Accessible a => (b -> Boolean) -> Array String -> a -> Maybe c
  //.
  //. Takes a predicate, a property path (an array of property names), and
  //. an object and returns Just the value at the given path if such a path
  //. exists and the value satisfies the given predicate; Nothing otherwise.
  //.
  //. See also [`get`](#get).
  //.
  //. ```javascript
  //. > S.gets(S.is(Number), ['a', 'b', 'c'], {a: {b: {c: 42}}})
  //. Just(42)
  //.
  //. > S.gets(S.is(Number), ['a', 'b', 'c'], {a: {b: {c: '42'}}})
  //. Nothing
  //.
  //. > S.gets(S.is(Number), ['a', 'b', 'c'], {})
  //. Nothing
  //. ```
  function gets(pred, keys, obj) {
    return Z.filter(pred, Z.reduce(function(m, k) {
      return Z.chain(function(x) {
        return x != null && k in x ? Just(x[k]) : Nothing;
      }, m);
    }, Just(obj), keys));
  }
  S.gets =
  def('gets',
      {a: [Accessible]},
      [Pred(b), $.Array($.String), a, $Maybe(c)],
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
    return Z.map(function(k) { return strMap[k]; }, Object.keys(strMap));
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
    return Z.map(function(k) { return [k, strMap[k]]; }, Object.keys(strMap));
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
    return Z.reduce(add, 0, foldable);
  }
  S.sum =
  def('sum', {f: [Z.Foldable]}, [f($.FiniteNumber), $.FiniteNumber], sum);

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
    return Z.reduce(mult, 1, foldable);
  }
  S.product =
  def('product',
      {f: [Z.Foldable]},
      [f($.FiniteNumber), $.FiniteNumber],
      product);

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
  //. Just(3)
  //.
  //. > S.mean([])
  //. Nothing
  //.
  //. > S.mean(S.Just(42))
  //. Just(42)
  //.
  //. > S.mean(S.Nothing)
  //. Nothing
  //. ```
  function mean(foldable) {
    var result = Z.reduce(
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
  S.mean =
  def('mean',
      {f: [Z.Foldable]},
      [f($.FiniteNumber), $Maybe($.FiniteNumber)],
      mean);

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
  function requiredNonCapturingGroup(xs) {
    return '(?:' + xs.join('|') + ')';
  }

  //  optionalNonCapturingGroup :: Array String -> String
  function optionalNonCapturingGroup(xs) {
    return requiredNonCapturingGroup(xs) + '?';
  }

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

  //# parseJson :: (a -> Boolean) -> String -> Maybe b
  //.
  //. Takes a predicate and a string which may or may not be valid JSON, and
  //. returns Just the result of applying `JSON.parse` to the string *if* the
  //. result satisfies the predicate; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseJson(S.is(Array), '["foo","bar","baz"]')
  //. Just(['foo', 'bar', 'baz'])
  //.
  //. > S.parseJson(S.is(Array), '[')
  //. Nothing
  //.
  //. > S.parseJson(S.is(Object), '["foo","bar","baz"]')
  //. Nothing
  //. ```
  function parseJson(pred, s) {
    return Z.filter(pred, encase(JSON.parse, s));
  }
  S.parseJson =
  def('parseJson', {}, [Pred(a), $.String, $Maybe(b)], parseJson);

  //. ### RegExp

  //  Match :: Type
  var Match = $.RecordType({
    match: $.String,
    groups: $.Array($Maybe($.String))
  });

  //  toMatch :: Array String? -> Match
  function toMatch(ss) {
    return {match: ss[0], groups: ss.slice(1).map(toMaybe)};
  }

  //  withRegex :: (RegExp, () -> a) -> a
  function withRegex(pattern, thunk) {
    var lastIndex = pattern.lastIndex;
    var result = thunk();
    pattern.lastIndex = lastIndex;
    return result;
  }

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
    return withRegex(pattern, function() { return pattern.test(s); });
  }
  S.test = def('test', {}, [$.RegExp, $.String, $.Boolean], test);

  //# match :: NonGlobalRegExp -> String -> Maybe { match :: String, groups :: Array (Maybe String) }
  //.
  //. Takes a pattern and a string, and returns Just a match record if the
  //. pattern matches the string; Nothing otherwise.
  //.
  //. `groups :: Array (Maybe String)` acknowledges the existence of optional
  //. capturing groups.
  //.
  //. Properties:
  //.
  //.   - `forall p :: Pattern, s :: String.
  //.      S.head(S.matchAll(S.regex("g", p), s)) = S.match(S.regex("", p), s)`
  //.
  //. See also [`matchAll`](#matchAll).
  //.
  //. ```javascript
  //. > S.match(/(good)?bye/, 'goodbye')
  //. Just({match: 'goodbye', groups: [Just('good')]})
  //.
  //. > S.match(/(good)?bye/, 'bye')
  //. Just({match: 'bye', groups: [Nothing]})
  //. ```
  function match(pattern, s) {
    return Z.map(toMatch, toMaybe(s.match(pattern)));
  }
  S.match =
  def('match', {}, [$.NonGlobalRegExp, $.String, $Maybe(Match)], match);

  //# matchAll :: GlobalRegExp -> String -> Array { match :: String, groups :: Array (Maybe String) }
  //.
  //. Takes a pattern and a string, and returns an array of match records.
  //.
  //. `groups :: Array (Maybe String)` acknowledges the existence of optional
  //. capturing groups.
  //.
  //. See also [`match`](#match).
  //.
  //. ```javascript
  //. > S.matchAll(/@([a-z]+)/g, 'Hello, world!')
  //. []
  //.
  //. > S.matchAll(/@([a-z]+)/g, 'Hello, @foo! Hello, @bar! Hello, @baz!')
  //. [ {match: '@foo', groups: [Just('foo')]},
  //. . {match: '@bar', groups: [Just('bar')]},
  //. . {match: '@baz', groups: [Just('baz')]} ]
  //. ```
  function matchAll(pattern, s) {
    return withRegex(pattern, function() {
      return unfoldr(function(_) {
        return Z.map(function(ss) {
          return [toMatch(ss), null];
        }, toMaybe(pattern.exec(s)));
      }, []);
    });
  }
  S.matchAll =
  def('matchAll', {}, [$.GlobalRegExp, $.String, $.Array(Match)], matchAll);

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
    return Z.reduce(function(s, x) { return s + x + '\n'; }, '', xs);
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

  }

  return createSanctuary({checkTypes: true, env: defaultEnv});

}));

//. [$.Array]:          v:sanctuary-js/sanctuary-def#Array
//. [$.String]:         v:sanctuary-js/sanctuary-def#String
//. [Alt]:              v:fantasyland/fantasy-land#alt
//. [Alternative]:      v:fantasyland/fantasy-land#alternative
//. [Applicative]:      v:fantasyland/fantasy-land#applicative
//. [Apply]:            v:fantasyland/fantasy-land#apply
//. [Bifunctor]:        v:fantasyland/fantasy-land#bifunctor
//. [BinaryType]:       v:sanctuary-js/sanctuary-def#BinaryType
//. [Either]:           #either-type
//. [Extend]:           v:fantasyland/fantasy-land#extend
//. [Fantasy Land]:     v:fantasyland/fantasy-land
//. [Foldable]:         v:fantasyland/fantasy-land#foldable
//. [Maybe]:            #maybe-type
//. [Monad]:            v:fantasyland/fantasy-land#monad
//. [Monoid]:           v:fantasyland/fantasy-land#monoid
//. [Nullable]:         v:sanctuary-js/sanctuary-def#Nullable
//. [Ramda]:            http://ramdajs.com/
//. [RegexFlags]:       v:sanctuary-js/sanctuary-def#RegexFlags
//. [Semigroup]:        v:fantasyland/fantasy-land#semigroup
//. [Setoid]:           v:fantasyland/fantasy-land#setoid
//. [Traversable]:      v:fantasyland/fantasy-land#traversable
//. [UnaryType]:        v:sanctuary-js/sanctuary-def#UnaryType
//. [`Z.alt`]:          v:sanctuary-js/sanctuary-type-classes#alt
//. [`Z.ap`]:           v:sanctuary-js/sanctuary-type-classes#ap
//. [`Z.apFirst`]:      v:sanctuary-js/sanctuary-type-classes#apFirst
//. [`Z.apSecond`]:     v:sanctuary-js/sanctuary-type-classes#apSecond
//. [`Z.bimap`]:        v:sanctuary-js/sanctuary-type-classes#bimap
//. [`Z.chain`]:        v:sanctuary-js/sanctuary-type-classes#chain
//. [`Z.chainRec`]:     v:sanctuary-js/sanctuary-type-classes#chainRec
//. [`Z.concat`]:       v:sanctuary-js/sanctuary-type-classes#concat
//. [`Z.contramap`]:    v:sanctuary-js/sanctuary-type-classes#contramap
//. [`Z.empty`]:        v:sanctuary-js/sanctuary-type-classes#empty
//. [`Z.equals`]:       v:sanctuary-js/sanctuary-type-classes#equals
//. [`Z.extend`]:       v:sanctuary-js/sanctuary-type-classes#extend
//. [`Z.extract`]:      v:sanctuary-js/sanctuary-type-classes#extract
//. [`Z.filter`]:       v:sanctuary-js/sanctuary-type-classes#filter
//. [`Z.filterM`]:      v:sanctuary-js/sanctuary-type-classes#filterM
//. [`Z.join`]:         v:sanctuary-js/sanctuary-type-classes#join
//. [`Z.map`]:          v:sanctuary-js/sanctuary-type-classes#map
//. [`Z.of`]:           v:sanctuary-js/sanctuary-type-classes#of
//. [`Z.promap`]:       v:sanctuary-js/sanctuary-type-classes#promap
//. [`Z.sequence`]:     v:sanctuary-js/sanctuary-type-classes#sequence
//. [`Z.toString`]:     v:sanctuary-js/sanctuary-type-classes#toString
//. [`Z.traverse`]:     v:sanctuary-js/sanctuary-type-classes#traverse
//. [`Z.zero`]:         v:sanctuary-js/sanctuary-type-classes#zero
//. [`of`]:             v:fantasyland/fantasy-land#of-method
//. [parseInt]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
//. [sanctuary-def]:    v:sanctuary-js/sanctuary-def
//. [thrush]:           https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
//. [type identifier]:  v:sanctuary-js/sanctuary-type-identifiers
//.
//. [`Either#fantasy-land/bimap`]:      #Either.prototype.fantasy-land/bimap
//. [`Either#fantasy-land/map`]:        #Either.prototype.fantasy-land/map
//. [`Either#toString`]:                #Either.prototype.toString
//. [`Maybe#toString`]:                 #Maybe.prototype.toString
