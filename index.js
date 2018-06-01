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
//. [Haskell][] and [PureScript][]. It's stricter than [Ramda][], and
//. provides a similar suite of functions.
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
//.     S.map (S.toUpper) (S.head (words))
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
//. value by a squiggly arrow (`~>`). The type of the `fantasy-land/map` method
//. of the Maybe type is written `Maybe a ~> (a -> b) -> Maybe b`. One could
//. read this as:
//.
//. _When the `fantasy-land/map` method is invoked on a value of type `Maybe a`
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
//. ## Type checking
//.
//. Sanctuary functions are defined via [sanctuary-def][] to provide run-time
//. type checking. This is tremendously useful during development: type errors
//. are reported immediately, avoiding circuitous stack traces (at best) and
//. silent failures due to type coercion (at worst). For example:
//.
//. ```javascript
//. S.add (2) (true);
//. // ! TypeError: Invalid value
//. //
//. //   add :: FiniteNumber -> FiniteNumber -> FiniteNumber
//. //                          ^^^^^^^^^^^^
//. //                               1
//. //
//. //   1)  true :: Boolean
//. //
//. //   The value at position 1 is not a member of ‘FiniteNumber’.
//. //
//. //   See v:sanctuary-js/sanctuary-def#FiniteNumber for information about the sanctuary-def/FiniteNumber type.
//. ```
//.
//. Compare this to the behaviour of Ramda's unchecked equivalent:
//.
//. ```javascript
//. R.add (2) (true);
//. // => 3
//. ```
//.
//. There is a performance cost to run-time type checking. Type checking is
//. disabled by default if `process.env.NODE_ENV` is `'production'`. If this
//. rule is unsuitable for a given program, one may use [`create`](#create)
//. to create a Sanctuary module based on a different rule. For example:
//.
//. ```javascript
//. const S = sanctuary.create ({
//.   checkTypes: localStorage.getItem ('SANCTUARY_CHECK_TYPES') === 'true',
//.   env: sanctuary.env,
//. });
//. ```
//.
//. Occasionally one may wish to perform an operation which is not type safe,
//. such as mapping over an object with heterogeneous values. This is possible
//. via selective use of [`unchecked`](#unchecked) functions.
//.
//. ## API

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f (require ('sanctuary-def'),
                        require ('sanctuary-either'),
                        require ('sanctuary-maybe'),
                        require ('sanctuary-pair'),
                        require ('sanctuary-show'),
                        require ('sanctuary-type-classes'),
                        require ('sanctuary-type-identifiers'));
  } else if (typeof define === 'function' && define.amd != null) {
    define (['sanctuary-def',
             'sanctuary-either',
             'sanctuary-maybe',
             'sanctuary-pair',
             'sanctuary-show',
             'sanctuary-type-classes',
             'sanctuary-type-identifiers'],
            f);
  } else {
    self.sanctuary = f (self.sanctuaryDef,
                        self.sanctuaryEither,
                        self.sanctuaryMaybe,
                        self.sanctuaryPair,
                        self.sanctuaryShow,
                        self.sanctuaryTypeClasses,
                        self.sanctuaryTypeIdentifiers);
  }

} (function($, Either, Maybe, Pair, show, Z, type) {

  'use strict';

  /* global __doctest:false */
  /* istanbul ignore if */
  if (typeof __doctest !== 'undefined') {
    /* eslint-disable no-unused-vars */
    var Nil = (__doctest.require ('./test/internal/List')).Nil;
    var Cons = (__doctest.require ('./test/internal/List')).Cons;
    var Sum = __doctest.require ('./test/internal/Sum');
    var S = (function(S) {
      var S_ = S.create ({
        checkTypes: true,
        env: S.env.concat ([
          (__doctest.require ('./test/internal/List')).Type ($.Unknown),
          Sum.Type
        ])
      });
      S_.env = S.env;  // see S.env doctest
      return S_;
    } (require ('.')));
    /* eslint-enable no-unused-vars */
  }

  //  Left :: a -> Either a b
  var Left = Either.Left;

  //  Right :: b -> Either a b
  var Right = Either.Right;

  //  Nothing :: Maybe a
  var Nothing = Maybe.Nothing;

  //  Just :: a -> Maybe a
  var Just = Maybe.Just;

  //  B :: (b -> c) -> (a -> b) -> a -> c
  function B(f) {
    return function(g) {
      return function(x) {
        return f (g (x));
      };
    };
  }

  //  C :: (a -> b -> c) -> b -> a -> c
  function C(f) {
    return function(y) {
      return function(x) {
        return f (x) (y);
      };
    };
  }

  //  Fn :: Type -> Type -> Type
  function Fn(x) {
    return function(y) {
      return $.Function ([x, y]);
    };
  }

  //  get_ :: String -> a -> Maybe b
  function get_(key) {
    return B (function(obj) { return key in obj ? Just (obj[key]) : Nothing; })
             (toObject);
  }

  //  invoke0 :: String -> a -> b
  function invoke0(name) {
    return function(target) {
      return target[name] ();
    };
  }

  //  invoke1 :: String -> a -> b -> c
  function invoke1(name) {
    return function(x) {
      return function(target) {
        return target[name] (x);
      };
    };
  }

  //  toObject :: a -> Object
  function toObject(x) {
    return x == null ? Object.create (null) : Object (x);
  }

  //  typeEq :: String -> a -> Boolean
  function typeEq(typeIdent) {
    return function(x) {
      return type (x) === typeIdent;
    };
  }

  //  value :: { value :: a } -> a
  function value(r) {
    return r.value;
  }

  //  :: Type
  var a = $.TypeVariable ('a');
  var b = $.TypeVariable ('b');
  var c = $.TypeVariable ('c');
  var d = $.TypeVariable ('d');
  var e = $.TypeVariable ('e');
  var g = $.TypeVariable ('g');
  var l = $.TypeVariable ('l');
  var r = $.TypeVariable ('r');

  //  :: Type -> Type
  var f = $.UnaryTypeVariable ('f');
  var m = $.UnaryTypeVariable ('m');
  var t = $.UnaryTypeVariable ('t');
  var w = $.UnaryTypeVariable ('w');

  //  :: Type -> Type -> Type
  var p = $.BinaryTypeVariable ('p');
  var s = $.BinaryTypeVariable ('s');

  //  $Either :: Type -> Type -> Type
  var $Either = $.BinaryType
    ('sanctuary/Either')
    ('https://github.com/sanctuary-js/sanctuary-either')
    (typeEq ('sanctuary-either/Either@1'))
    (either (of (Array)) (K ([])))
    (either (K ([])) (of (Array)));

  //  $Maybe :: Type -> Type
  var $Maybe = $.UnaryType
    ('sanctuary/Maybe')
    ('https://github.com/sanctuary-js/sanctuary-maybe')
    (typeEq ('sanctuary-maybe/Maybe@1'))
    (maybe ([]) (of (Array)));

  //  $Pair :: Type -> Type -> Type
  var $Pair = $.BinaryType
    ('sanctuary/Pair')
    ('https://github.com/sanctuary-js/sanctuary-pair')
    (typeEq ('sanctuary-pair/Pair@1'))
    (function(pair) { return [pair.fst]; })
    (function(pair) { return [pair.snd]; });

  //  TypeRep :: Type -> Type
  var TypeRep = $.UnaryType
    ('sanctuary/TypeRep')
    ('https://github.com/fantasyland/fantasy-land#type-representatives')
    (function(x) {
       return $.AnyFunction._test (x) ||
              x != null && $.String._test (x['@@type']);
     })
    (K ([]));

  //  Options :: Type
  var Options = $.RecordType ({checkTypes: $.Boolean, env: $.Array ($.Any)});

  var _ = {};

  //. ### Configure

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
  //. const {create, env} = require ('sanctuary');
  //. const $ = require ('sanctuary-def');
  //. const type = require ('sanctuary-type-identifiers');
  //.
  //. //    Identity :: a -> Identity a
  //. const Identity = x => {
  //.   const identity = Object.create (Identity$prototype);
  //.   identity.value = x;
  //.   return identity;
  //. };
  //.
  //. Identity['@@type'] = 'my-package/Identity@1';
  //.
  //. const Identity$prototype = {
  //.   'constructor': Identity,
  //.   '@@show': function() { return `Identity (${S.show (this.value)})`; },
  //.   'fantasy-land/map': function(f) { return Identity (f (this.value)); },
  //. };
  //.
  //. //    IdentityType :: Type -> Type
  //. const IdentityType = $.UnaryType
  //.   (Identity['@@type'])
  //.   ('http://example.com/my-package#Identity')
  //.   (x => type (x) === Identity['@@type'])
  //.   (identity => [identity.value]);
  //.
  //. const S = create ({
  //.   checkTypes: process.env.NODE_ENV !== 'production',
  //.   env: env.concat ([IdentityType ($.Unknown)]),
  //. });
  //.
  //. S.map (S.sub (1)) (Identity (43));
  //. // => Identity (42)
  //. ```
  //.
  //. See also [`env`](#env).
  function create(opts) {
    var def = $.create (opts);
    var S = {
      env: opts.env,
      is: def ('is') ({}) ([$.Type, $.Any, $.Boolean]) ($.test (opts.env)),
      MaybeType: $Maybe,
      Maybe: Maybe,
      Nothing: Nothing,
      EitherType: $Either,
      Either: Either,
      PairType: $Pair
    };
    (Object.keys (_)).forEach (function(name) {
      S[name] = def (name) (_[name].consts) (_[name].types) (_[name].impl);
    });
    S.unchecked = opts.checkTypes ? create ({checkTypes: false, env: opts.env})
                                  : S;
    return S;
  }
  _.create = {
    consts: {},
    types: [Options, $.Object],
    impl: create
  };

  //# env :: Array Type
  //.
  //. The Sanctuary module's environment (`(S.create ({checkTypes, env})).env`
  //. is a reference to `env`). Useful in conjunction with [`create`](#create).
  //.
  //. ```javascript
  //. > S.env
  //. [ $.AnyFunction,
  //. . $.Arguments,
  //. . $.Array ($.Unknown),
  //. . $.Boolean,
  //. . $.Date,
  //. . $.Error,
  //. . $.Null,
  //. . $.Number,
  //. . $.Object,
  //. . $.RegExp,
  //. . $.StrMap ($.Unknown),
  //. . $.String,
  //. . $.Symbol,
  //. . $.Undefined,
  //. . $.FiniteNumber,
  //. . $.NonZeroFiniteNumber,
  //. . S.EitherType ($.Unknown) ($.Unknown),
  //. . $.Function ([$.Unknown, $.Unknown]),
  //. . $.GlobalRegExp,
  //. . $.NonGlobalRegExp,
  //. . $.Integer,
  //. . $.NonNegativeInteger,
  //. . S.MaybeType ($.Unknown),
  //. . $.Array2 ($.Unknown) ($.Unknown),
  //. . S.PairType ($.Unknown) ($.Unknown),
  //. . $.RegexFlags,
  //. . $.Type,
  //. . $.TypeClass,
  //. . $.ValidDate,
  //. . $.ValidNumber ]
  //. ```

  //# unchecked :: Module
  //.
  //. A complete Sanctuary module which performs no type checking. This is
  //. useful as it permits operations which Sanctuary's type checking would
  //. disallow, such as mapping over an object with heterogeneous values.
  //.
  //. See also [`create`](#create).
  //.
  //. ```javascript
  //. > S.unchecked.map (S.show) ({x: 'foo', y: true, z: 42})
  //. {x: '"foo"', y: 'true', z: '42'}
  //. ```
  //.
  //. Opting out of type checking may cause type errors to go unnoticed.
  //.
  //. ```javascript
  //. > S.unchecked.add (2) ('2')
  //. '22'
  //. ```

  //. ### Classify

  //# type :: Any -> { namespace :: Maybe String, name :: String, version :: NonNegativeInteger }
  //.
  //. Returns the result of parsing the [type identifier][] of the given value.
  //.
  //. ```javascript
  //. > S.type (S.Just (42))
  //. {namespace: Just ('sanctuary-maybe'), name: 'Maybe', version: 1}
  //.
  //. > S.type ([1, 2, 3])
  //. {namespace: Nothing, name: 'Array', version: 0}
  //. ```
  function type_(x) {
    var r = type.parse (type (x));
    r.namespace = toMaybe (r.namespace);
    return r;
  }
  _.type = {
    consts: {},
    types: [$.Any,
            $.RecordType ({namespace: $Maybe ($.String),
                           name: $.String,
                           version: $.NonNegativeInteger})],
    impl: type_
  };

  //# is :: Type -> Any -> Boolean
  //.
  //. Returns `true` [iff][] the given value is a member of the specified type.
  //. See [`$.test`][] for details.
  //.
  //. ```javascript
  //. > S.is ($.Array ($.Integer)) ([1, 2, 3])
  //. true
  //.
  //. > S.is ($.Array ($.Integer)) ([1, 2, 3.14])
  //. false
  //. ```

  //. ### Showable

  //# show :: Any -> String
  //.
  //. Alias of [`show`][].
  //.
  //. ```javascript
  //. > S.show (-0)
  //. '-0'
  //.
  //. > S.show (['foo', 'bar', 'baz'])
  //. '["foo", "bar", "baz"]'
  //.
  //. > S.show ({x: 1, y: 2, z: 3})
  //. '{"x": 1, "y": 2, "z": 3}'
  //.
  //. > S.show (S.Left (S.Right (S.Just (S.Nothing))))
  //. 'Left (Right (Just (Nothing)))'
  //. ```
  _.show = {
    consts: {},
    types: [$.Any, $.String],
    impl: show
  };

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
  //. > S.equals (0) (-0)
  //. true
  //.
  //. > S.equals (NaN) (NaN)
  //. true
  //.
  //. > S.equals (S.Just ([1, 2, 3])) (S.Just ([1, 2, 3]))
  //. true
  //.
  //. > S.equals (S.Just ([1, 2, 3])) (S.Just ([1, 2, 4]))
  //. false
  //. ```
  _.equals = {
    consts: {a: [Z.Setoid]},
    types: [a, a, $.Boolean],
    impl: curry2 (Z.equals)
  };

  //# lt :: Ord a => a -> a -> Boolean
  //.
  //. Returns `true` [iff][] the *second* argument is less than the first
  //. according to [`Z.lt`][].
  //.
  //. ```javascript
  //. > S.filter (S.lt (3)) ([1, 2, 3, 4, 5])
  //. [1, 2]
  //. ```
  function lt(y) {
    return function(x) {
      return Z.lt (x, y);
    };
  }
  _.lt = {
    consts: {a: [Z.Ord]},
    types: [a, a, $.Boolean],
    impl: lt
  };

  //# lte :: Ord a => a -> a -> Boolean
  //.
  //. Returns `true` [iff][] the *second* argument is less than or equal to
  //. the first according to [`Z.lte`][].
  //.
  //. ```javascript
  //. > S.filter (S.lte (3)) ([1, 2, 3, 4, 5])
  //. [1, 2, 3]
  //. ```
  function lte(y) {
    return function(x) {
      return Z.lte (x, y);
    };
  }
  _.lte = {
    consts: {a: [Z.Ord]},
    types: [a, a, $.Boolean],
    impl: lte
  };

  //# gt :: Ord a => a -> a -> Boolean
  //.
  //. Returns `true` [iff][] the *second* argument is greater than the first
  //. according to [`Z.gt`][].
  //.
  //. ```javascript
  //. > S.filter (S.gt (3)) ([1, 2, 3, 4, 5])
  //. [4, 5]
  //. ```
  function gt(y) {
    return function(x) {
      return Z.gt (x, y);
    };
  }
  _.gt = {
    consts: {a: [Z.Ord]},
    types: [a, a, $.Boolean],
    impl: gt
  };

  //# gte :: Ord a => a -> a -> Boolean
  //.
  //. Returns `true` [iff][] the *second* argument is greater than or equal
  //. to the first according to [`Z.gte`][].
  //.
  //. ```javascript
  //. > S.filter (S.gte (3)) ([1, 2, 3, 4, 5])
  //. [3, 4, 5]
  //. ```
  function gte(y) {
    return function(x) {
      return Z.gte (x, y);
    };
  }
  _.gte = {
    consts: {a: [Z.Ord]},
    types: [a, a, $.Boolean],
    impl: gte
  };

  //# min :: Ord a => a -> a -> a
  //.
  //. Returns the smaller of its two arguments (according to [`Z.lte`][]).
  //.
  //. See also [`max`](#max).
  //.
  //. ```javascript
  //. > S.min (10) (2)
  //. 2
  //.
  //. > S.min (new Date ('1999-12-31')) (new Date ('2000-01-01'))
  //. new Date ('1999-12-31')
  //.
  //. > S.min ('10') ('2')
  //. '10'
  //. ```
  _.min = {
    consts: {a: [Z.Ord]},
    types: [a, a, a],
    impl: curry2 (Z.min)
  };

  //# max :: Ord a => a -> a -> a
  //.
  //. Returns the larger of its two arguments (according to [`Z.lte`][]).
  //.
  //. See also [`min`](#min).
  //.
  //. ```javascript
  //. > S.max (10) (2)
  //. 10
  //.
  //. > S.max (new Date ('1999-12-31')) (new Date ('2000-01-01'))
  //. new Date ('2000-01-01')
  //.
  //. > S.max ('10') ('2')
  //. '2'
  //. ```
  _.max = {
    consts: {a: [Z.Ord]},
    types: [a, a, a],
    impl: curry2 (Z.max)
  };

  //# id :: Category c => TypeRep c -> c
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.id`][].
  //.
  //. ```javascript
  //. > S.id (Function) (42)
  //. 42
  //. ```
  _.id = {
    consts: {c: [Z.Category]},
    types: [TypeRep (c), c],
    impl: Z.id
  };

  //# concat :: Semigroup a => a -> a -> a
  //.
  //. Curried version of [`Z.concat`][].
  //.
  //. ```javascript
  //. > S.concat ('abc') ('def')
  //. 'abcdef'
  //.
  //. > S.concat ([1, 2, 3]) ([4, 5, 6])
  //. [1, 2, 3, 4, 5, 6]
  //.
  //. > S.concat ({x: 1, y: 2}) ({y: 3, z: 4})
  //. {x: 1, y: 3, z: 4}
  //.
  //. > S.concat (S.Just ([1, 2, 3])) (S.Just ([4, 5, 6]))
  //. Just ([1, 2, 3, 4, 5, 6])
  //.
  //. > S.concat (Sum (18)) (Sum (24))
  //. Sum (42)
  //. ```
  _.concat = {
    consts: {a: [Z.Semigroup]},
    types: [a, a, a],
    impl: curry2 (Z.concat)
  };

  //# empty :: Monoid a => TypeRep a -> a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.empty`][].
  //.
  //. ```javascript
  //. > S.empty (String)
  //. ''
  //.
  //. > S.empty (Array)
  //. []
  //.
  //. > S.empty (Object)
  //. {}
  //.
  //. > S.empty (Sum)
  //. Sum (0)
  //. ```
  _.empty = {
    consts: {a: [Z.Monoid]},
    types: [TypeRep (a), a],
    impl: Z.empty
  };

  //# invert :: Group g => g -> g
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.invert`][].
  //.
  //. ```javascript
  //. > S.invert (Sum (5))
  //. Sum (-5)
  //. ```
  _.invert = {
    consts: {g: [Z.Group]},
    types: [g, g],
    impl: Z.invert
  };

  //# filter :: Filterable f => (a -> Boolean) -> f a -> f a
  //.
  //. Curried version of [`Z.filter`][]. Discards every element which does not
  //. satisfy the predicate.
  //.
  //. See also [`reject`](#reject).
  //.
  //. ```javascript
  //. > S.filter (S.odd) ([1, 2, 3])
  //. [1, 3]
  //.
  //. > S.filter (S.odd) ({x: 1, y: 2, z: 3})
  //. {x: 1, z: 3}
  //.
  //. > S.filter (S.odd) (S.Nothing)
  //. Nothing
  //.
  //. > S.filter (S.odd) (S.Just (0))
  //. Nothing
  //.
  //. > S.filter (S.odd) (S.Just (1))
  //. Just (1)
  //. ```
  function filter(pred) {
    return function(filterable) {
      return Z.filter (pred, filterable);
    };
  }
  _.filter = {
    consts: {f: [Z.Filterable]},
    types: [$.Predicate (a), f (a), f (a)],
    impl: filter
  };

  //# reject :: Filterable f => (a -> Boolean) -> f a -> f a
  //.
  //. Curried version of [`Z.reject`][]. Discards every element which satisfies
  //. the predicate.
  //.
  //. See also [`filter`](#filter).
  //.
  //. ```javascript
  //. > S.reject (S.odd) ([1, 2, 3])
  //. [2]
  //.
  //. > S.reject (S.odd) ({x: 1, y: 2, z: 3})
  //. {y: 2}
  //.
  //. > S.reject (S.odd) (S.Nothing)
  //. Nothing
  //.
  //. > S.reject (S.odd) (S.Just (0))
  //. Just (0)
  //.
  //. > S.reject (S.odd) (S.Just (1))
  //. Nothing
  //. ```
  _.reject = {
    consts: {f: [Z.Filterable]},
    types: [$.Predicate (a), f (a), f (a)],
    impl: curry2 (Z.reject)
  };

  //# takeWhile :: Filterable f => (a -> Boolean) -> f a -> f a
  //.
  //. Curried version of [`Z.takeWhile`][]. Discards the first element which
  //. does not satisfy the predicate, and all subsequent elements.
  //.
  //. See also [`dropWhile`](#dropWhile).
  //.
  //. ```javascript
  //. > S.takeWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])
  //. [3, 3, 3, 7]
  //.
  //. > S.takeWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])
  //. []
  //. ```
  _.takeWhile = {
    consts: {f: [Z.Filterable]},
    types: [$.Predicate (a), f (a), f (a)],
    impl: curry2 (Z.takeWhile)
  };

  //# dropWhile :: Filterable f => (a -> Boolean) -> f a -> f a
  //.
  //. Curried version of [`Z.dropWhile`][]. Retains the first element which
  //. does not satisfy the predicate, and all subsequent elements.
  //.
  //. See also [`takeWhile`](#takeWhile).
  //.
  //. ```javascript
  //. > S.dropWhile (S.odd) ([3, 3, 3, 7, 6, 3, 5, 4])
  //. [6, 3, 5, 4]
  //.
  //. > S.dropWhile (S.even) ([3, 3, 3, 7, 6, 3, 5, 4])
  //. [3, 3, 3, 7, 6, 3, 5, 4]
  //. ```
  _.dropWhile = {
    consts: {f: [Z.Filterable]},
    types: [$.Predicate (a), f (a), f (a)],
    impl: curry2 (Z.dropWhile)
  };

  //# map :: Functor f => (a -> b) -> f a -> f b
  //.
  //. Curried version of [`Z.map`][].
  //.
  //. ```javascript
  //. > S.map (Math.sqrt) ([1, 4, 9])
  //. [1, 2, 3]
  //.
  //. > S.map (Math.sqrt) ({x: 1, y: 4, z: 9})
  //. {x: 1, y: 2, z: 3}
  //.
  //. > S.map (Math.sqrt) (S.Just (9))
  //. Just (3)
  //.
  //. > S.map (Math.sqrt) (S.Right (9))
  //. Right (3)
  //.
  //. > S.map (Math.sqrt) (S.Pair (99980001) (99980001))
  //. Pair (99980001) (9999)
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
  //. > S.map (Math.sqrt) (S.add (1)) (99)
  //. 10
  //. ```
  function map(f) {
    return function(functor) {
      return Z.map (f, functor);
    };
  }
  _.map = {
    consts: {f: [Z.Functor]},
    types: [Fn (a) (b), f (a), f (b)],
    impl: map
  };

  //# flip :: Functor f => f (a -> b) -> a -> f b
  //.
  //. Curried version of [`Z.flip`][]. Maps over the given functions, applying
  //. each to the given value.
  //.
  //. Replacing `Functor f => f` with `Function x` produces the C combinator
  //. from combinatory logic:
  //.
  //.     Functor f => f (a -> b) -> a -> f b
  //.     Function x (a -> b) -> a -> Function x b
  //.     Function x (a -> c) -> a -> Function x c
  //.     Function x (b -> c) -> b -> Function x c
  //.     Function a (b -> c) -> b -> Function a c
  //.     (a -> b -> c) -> b -> a -> c
  //.
  //. ```javascript
  //. > S.flip (S.concat) ('!') ('foo')
  //. 'foo!'
  //.
  //. > S.flip ([Math.floor, Math.ceil]) (1.5)
  //. [1, 2]
  //.
  //. > S.flip ({floor: Math.floor, ceil: Math.ceil}) (1.5)
  //. {floor: 1, ceil: 2}
  //.
  //. > S.flip (Cons (Math.floor) (Cons (Math.ceil) (Nil))) (1.5)
  //. Cons (1) (Cons (2) (Nil))
  //. ```
  _.flip = {
    consts: {f: [Z.Functor]},
    types: [f (Fn (a) (b)), a, f (b)],
    impl: curry2 (Z.flip)
  };

  //# bimap :: Bifunctor f => (a -> b) -> (c -> d) -> f a c -> f b d
  //.
  //. Curried version of [`Z.bimap`][].
  //.
  //. ```javascript
  //. > S.bimap (S.toUpper) (Math.sqrt) (S.Pair ('foo') (64))
  //. Pair ('FOO') (8)
  //.
  //. > S.bimap (S.toUpper) (Math.sqrt) (S.Left ('foo'))
  //. Left ('FOO')
  //.
  //. > S.bimap (S.toUpper) (Math.sqrt) (S.Right (64))
  //. Right (8)
  //. ```
  _.bimap = {
    consts: {p: [Z.Bifunctor]},
    types: [Fn (a) (b), Fn (c) (d), p (a) (c), p (b) (d)],
    impl: curry3 (Z.bimap)
  };

  //# mapLeft :: Bifunctor f => (a -> b) -> f a c -> f b c
  //.
  //. Curried version of [`Z.mapLeft`][]. Maps the given function over the left
  //. side of a Bifunctor.
  //.
  //. ```javascript
  //. > S.mapLeft (S.toUpper) (S.Pair ('foo') (64))
  //. Pair ('FOO') (64)
  //.
  //. > S.mapLeft (S.toUpper) (S.Left ('foo'))
  //. Left ('FOO')
  //.
  //. > S.mapLeft (S.toUpper) (S.Right (64))
  //. Right (64)
  //. ```
  _.mapLeft = {
    consts: {p: [Z.Bifunctor]},
    types: [Fn (a) (b), p (a) (c), p (b) (c)],
    impl: curry2 (Z.mapLeft)
  };

  //# promap :: Profunctor p => (a -> b) -> (c -> d) -> p b c -> p a d
  //.
  //. Curried version of [`Z.promap`][].
  //.
  //. ```javascript
  //. > S.promap (Math.abs) (S.add (1)) (Math.sqrt) (-100)
  //. 11
  //. ```
  _.promap = {
    consts: {p: [Z.Profunctor]},
    types: [Fn (a) (b), Fn (c) (d), p (b) (c), p (a) (d)],
    impl: curry3 (Z.promap)
  };

  //# alt :: Alt f => f a -> f a -> f a
  //.
  //. Curried version of [`Z.alt`][].
  //.
  //. ```javascript
  //. > S.alt (S.Nothing) (S.Just (1))
  //. Just (1)
  //.
  //. > S.alt (S.Just (2)) (S.Just (3))
  //. Just (2)
  //.
  //. > S.alt (S.Left ('X')) (S.Right (1))
  //. Right (1)
  //.
  //. > S.alt (S.Right (2)) (S.Right (3))
  //. Right (2)
  //. ```
  _.alt = {
    consts: {f: [Z.Alt]},
    types: [f (a), f (a), f (a)],
    impl: curry2 (Z.alt)
  };

  //# zero :: Plus f => TypeRep f -> f a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.zero`][].
  //.
  //. ```javascript
  //. > S.zero (Array)
  //. []
  //.
  //. > S.zero (Object)
  //. {}
  //.
  //. > S.zero (S.Maybe)
  //. Nothing
  //. ```
  _.zero = {
    consts: {f: [Z.Plus]},
    types: [TypeRep ($.TypeVariable ('f')), f (a)],
    impl: Z.zero
  };

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
  //. ```javascript
  //. > S.reduce (S.add) (0) ([1, 2, 3, 4, 5])
  //. 15
  //.
  //. > S.reduce (xs => x => S.prepend (x) (xs)) ([]) ([1, 2, 3, 4, 5])
  //. [5, 4, 3, 2, 1]
  //. ```
  function reduce(f) {
    return function(initial) {
      return function(foldable) {
        return Z.reduce (function(y, x) { return f (y) (x); },
                         initial,
                         foldable);
      };
    };
  }
  _.reduce = {
    consts: {f: [Z.Foldable]},
    types: [Fn (a) (Fn (b) (a)), a, f (b), a],
    impl: reduce
  };

  //# traverse :: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f (t b)
  //.
  //. Curried version of [`Z.traverse`][].
  //.
  //. ```javascript
  //. > S.traverse (Array) (S.words) (S.Just ('foo bar baz'))
  //. [Just ('foo'), Just ('bar'), Just ('baz')]
  //.
  //. > S.traverse (Array) (S.words) (S.Nothing)
  //. [Nothing]
  //.
  //. > S.traverse (S.Maybe) (S.parseInt (16)) (['A', 'B', 'C'])
  //. Just ([10, 11, 12])
  //.
  //. > S.traverse (S.Maybe) (S.parseInt (16)) (['A', 'B', 'C', 'X'])
  //. Nothing
  //.
  //. > S.traverse (S.Maybe) (S.parseInt (16)) ({a: 'A', b: 'B', c: 'C'})
  //. Just ({a: 10, b: 11, c: 12})
  //.
  //. > S.traverse (S.Maybe) (S.parseInt (16)) ({a: 'A', b: 'B', c: 'C', x: 'X'})
  //. Nothing
  //. ```
  _.traverse = {
    consts: {f: [Z.Applicative], t: [Z.Traversable]},
    types: [TypeRep ($.TypeVariable ('f')), Fn (a) (f (b)), t (a), f (t (b))],
    impl: curry3 (Z.traverse)
  };

  //# sequence :: (Applicative f, Traversable t) => TypeRep f -> t (f a) -> f (t a)
  //.
  //. Curried version of [`Z.sequence`][]. Inverts the given `t (f a)`
  //. to produce an `f (t a)`.
  //.
  //. ```javascript
  //. > S.sequence (Array) (S.Just ([1, 2, 3]))
  //. [Just (1), Just (2), Just (3)]
  //.
  //. > S.sequence (S.Maybe) ([S.Just (1), S.Just (2), S.Just (3)])
  //. Just ([1, 2, 3])
  //.
  //. > S.sequence (S.Maybe) ([S.Just (1), S.Just (2), S.Nothing])
  //. Nothing
  //.
  //. > S.sequence (S.Maybe) ({a: S.Just (1), b: S.Just (2), c: S.Just (3)})
  //. Just ({a: 1, b: 2, c: 3})
  //.
  //. > S.sequence (S.Maybe) ({a: S.Just (1), b: S.Just (2), c: S.Nothing})
  //. Nothing
  //. ```
  _.sequence = {
    consts: {f: [Z.Applicative], t: [Z.Traversable]},
    types: [TypeRep ($.TypeVariable ('f')), t (f (a)), f (t (a))],
    impl: curry2 (Z.sequence)
  };

  //# ap :: Apply f => f (a -> b) -> f a -> f b
  //.
  //. Curried version of [`Z.ap`][].
  //.
  //. ```javascript
  //. > S.ap ([Math.sqrt, x => x * x]) ([1, 4, 9, 16, 25])
  //. [1, 2, 3, 4, 5, 1, 16, 81, 256, 625]
  //.
  //. > S.ap ({x: Math.sqrt, y: S.add (1), z: S.sub (1)}) ({w: 4, x: 4, y: 4})
  //. {x: 2, y: 5}
  //.
  //. > S.ap (S.Just (Math.sqrt)) (S.Just (64))
  //. Just (8)
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
  //. > S.ap (s => n => s.slice (0, n)) (s => Math.ceil (s.length / 2)) ('Haskell')
  //. 'Hask'
  //. ```
  _.ap = {
    consts: {f: [Z.Apply]},
    types: [f (Fn (a) (b)), f (a), f (b)],
    impl: curry2 (Z.ap)
  };

  //# lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
  //.
  //. Promotes a curried binary function to a function which operates on two
  //. [Apply][]s.
  //.
  //. ```javascript
  //. > S.lift2 (S.add) (S.Just (2)) (S.Just (3))
  //. Just (5)
  //.
  //. > S.lift2 (S.add) (S.Just (2)) (S.Nothing)
  //. Nothing
  //.
  //. > S.lift2 (S.and) (S.Just (true)) (S.Just (true))
  //. Just (true)
  //.
  //. > S.lift2 (S.and) (S.Just (true)) (S.Just (false))
  //. Just (false)
  //. ```
  _.lift2 = {
    consts: {f: [Z.Apply]},
    types: [Fn (a) (Fn (b) (c)), f (a), f (b), f (c)],
    impl: curry3 (Z.lift2)
  };

  //# lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
  //.
  //. Promotes a curried ternary function to a function which operates on three
  //. [Apply][]s.
  //.
  //. ```javascript
  //. > S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Just ([1, 2, 3]))
  //. Just (6)
  //.
  //. > S.lift3 (S.reduce) (S.Just (S.add)) (S.Just (0)) (S.Nothing)
  //. Nothing
  //. ```
  _.lift3 = {
    consts: {f: [Z.Apply]},
    types: [Fn (a) (Fn (b) (Fn (c) (d))), f (a), f (b), f (c), f (d)],
    impl: curry4 (Z.lift3)
  };

  //# apFirst :: Apply f => f a -> f b -> f a
  //.
  //. Curried version of [`Z.apFirst`][]. Combines two effectful actions,
  //. keeping only the result of the first. Equivalent to Haskell's `(<*)`
  //. function.
  //.
  //. See also [`apSecond`](#apSecond).
  //.
  //. ```javascript
  //. > S.apFirst ([1, 2]) ([3, 4])
  //. [1, 1, 2, 2]
  //.
  //. > S.apFirst (S.Just (1)) (S.Just (2))
  //. Just (1)
  //. ```
  _.apFirst = {
    consts: {f: [Z.Apply]},
    types: [f (a), f (b), f (a)],
    impl: curry2 (Z.apFirst)
  };

  //# apSecond :: Apply f => f a -> f b -> f b
  //.
  //. Curried version of [`Z.apSecond`][]. Combines two effectful actions,
  //. keeping only the result of the second. Equivalent to Haskell's `(*>)`
  //. function.
  //.
  //. See also [`apFirst`](#apFirst).
  //.
  //. ```javascript
  //. > S.apSecond ([1, 2]) ([3, 4])
  //. [3, 4, 3, 4]
  //.
  //. > S.apSecond (S.Just (1)) (S.Just (2))
  //. Just (2)
  //. ```
  _.apSecond = {
    consts: {f: [Z.Apply]},
    types: [f (a), f (b), f (b)],
    impl: curry2 (Z.apSecond)
  };

  //# of :: Applicative f => TypeRep f -> a -> f a
  //.
  //. Curried version of [`Z.of`][].
  //.
  //. ```javascript
  //. > S.of (Array) (42)
  //. [42]
  //.
  //. > S.of (Function) (42) (null)
  //. 42
  //.
  //. > S.of (S.Maybe) (42)
  //. Just (42)
  //.
  //. > S.of (S.Either) (42)
  //. Right (42)
  //. ```
  function of(typeRep) {
    return function(x) {
      return Z.of (typeRep, x);
    };
  }
  _.of = {
    consts: {f: [Z.Applicative]},
    types: [TypeRep ($.TypeVariable ('f')), a, f (a)],
    impl: of
  };

  //# chain :: Chain m => (a -> m b) -> m a -> m b
  //.
  //. Curried version of [`Z.chain`][].
  //.
  //. ```javascript
  //. > S.chain (x => [x, x]) ([1, 2, 3])
  //. [1, 1, 2, 2, 3, 3]
  //.
  //. > S.chain (n => s => s.slice (0, n)) (s => Math.ceil (s.length / 2)) ('slice')
  //. 'sli'
  //.
  //. > S.chain (S.parseInt (10)) (S.Just ('123'))
  //. Just (123)
  //.
  //. > S.chain (S.parseInt (10)) (S.Just ('XXX'))
  //. Nothing
  //. ```
  _.chain = {
    consts: {m: [Z.Chain]},
    types: [Fn (a) (m (b)), m (a), m (b)],
    impl: curry2 (Z.chain)
  };

  //# join :: Chain m => m (m a) -> m a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.join`][].
  //. Removes one level of nesting from a nested monadic structure.
  //.
  //. ```javascript
  //. > S.join ([[1], [2], [3]])
  //. [1, 2, 3]
  //.
  //. > S.join ([[[1, 2, 3]]])
  //. [[1, 2, 3]]
  //.
  //. > S.join (S.Just (S.Just (1)))
  //. Just (1)
  //.
  //. > S.join (S.Pair ('foo') (S.Pair ('bar') ('baz')))
  //. Pair ('foobar') ('baz')
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
  //. > S.join (S.concat) ('abc')
  //. 'abcabc'
  //. ```
  _.join = {
    consts: {m: [Z.Chain]},
    types: [m (m (a)), m (a)],
    impl: Z.join
  };

  //# chainRec :: ChainRec m => TypeRep m -> (a -> m (Either a b)) -> a -> m b
  //.
  //. Performs a [`chain`](#chain)-like computation with constant stack usage.
  //. Similar to [`Z.chainRec`][], but curried and more convenient due to the
  //. use of the Either type to indicate completion (via a Right).
  //.
  //. ```javascript
  //. > S.chainRec (Array)
  //. .            (s => s.length === 2 ? S.map (S.Right) ([s + '!', s + '?'])
  //. .                                 : S.map (S.Left) ([s + 'o', s + 'n']))
  //. .            ('')
  //. ['oo!', 'oo?', 'on!', 'on?', 'no!', 'no?', 'nn!', 'nn?']
  //. ```
  function chainRec(typeRep) {
    return function(f) {
      return function(x) {
        return Z.chainRec (typeRep, step, x);
      };
      function step(next, done, x) {
        return Z.map (either (next) (done), f (x));
      }
    };
  }
  _.chainRec = {
    consts: {m: [Z.ChainRec]},
    types: [TypeRep ($.TypeVariable ('m')),
            Fn (a) (m ($Either (a) (b))),
            a,
            m (b)],
    impl: chainRec
  };

  //# extend :: Extend w => (w a -> b) -> w a -> w b
  //.
  //. Curried version of [`Z.extend`][].
  //.
  //. ```javascript
  //. > S.extend (S.joinWith ('')) (['x', 'y', 'z'])
  //. ['xyz', 'yz', 'z']
  //.
  //. > S.extend (f => f ([3, 4])) (S.reverse) ([1, 2])
  //. [4, 3, 2, 1]
  //. ```
  _.extend = {
    consts: {w: [Z.Extend]},
    types: [Fn (w (a)) (b), w (a), w (b)],
    impl: curry2 (Z.extend)
  };

  //# duplicate :: Extend w => w a -> w (w a)
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.duplicate`][].
  //. Adds one level of nesting to a comonadic structure.
  //.
  //. ```javascript
  //. > S.duplicate (S.Just (1))
  //. Just (Just (1))
  //.
  //. > S.duplicate ([1])
  //. [[1]]
  //.
  //. > S.duplicate ([1, 2, 3])
  //. [[1, 2, 3], [2, 3], [3]]
  //.
  //. > S.duplicate (S.reverse) ([1, 2]) ([3, 4])
  //. [4, 3, 2, 1]
  //. ```
  _.duplicate = {
    consts: {w: [Z.Extend]},
    types: [w (a), w (w (a))],
    impl: Z.duplicate
  };

  //# extract :: Comonad w => w a -> a
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.extract`][].
  //.
  //. ```javascript
  //. > S.extract (S.Pair ('foo') ('bar'))
  //. 'bar'
  //. ```
  _.extract = {
    consts: {w: [Z.Comonad]},
    types: [w (a), a],
    impl: Z.extract
  };

  //# contramap :: Contravariant f => (b -> a) -> f a -> f b
  //.
  //. [Type-safe][sanctuary-def] version of [`Z.contramap`][].
  //.
  //. ```javascript
  //. > S.contramap (s => s.length) (Math.sqrt) ('Sanctuary')
  //. 3
  //. ```
  _.contramap = {
    consts: {f: [Z.Contravariant]},
    types: [Fn (b) (a), f (a), f (b)],
    impl: curry2 (Z.contramap)
  };

  //. ### Combinator

  //# I :: a -> a
  //.
  //. The I combinator. Returns its argument. Equivalent to Haskell's `id`
  //. function.
  //.
  //. ```javascript
  //. > S.I ('foo')
  //. 'foo'
  //. ```
  function I(x) {
    return x;
  }
  _.I = {
    consts: {},
    types: [a, a],
    impl: I
  };

  //# K :: a -> b -> a
  //.
  //. The K combinator. Takes two values and returns the first. Equivalent to
  //. Haskell's `const` function.
  //.
  //. ```javascript
  //. > S.K ('foo') ('bar')
  //. 'foo'
  //.
  //. > S.map (S.K (42)) (S.range (0) (5))
  //. [42, 42, 42, 42, 42]
  //. ```
  function K(x) {
    return function(y) {
      return x;
    };
  }
  _.K = {
    consts: {},
    types: [a, b, a],
    impl: K
  };

  //# T :: a -> (a -> b) -> b
  //.
  //. The T ([thrush][]) combinator. Takes a value and a function, and returns
  //. the result of applying the function to the value. Equivalent to Haskell's
  //. `(&)` function.
  //.
  //. ```javascript
  //. > S.T (42) (S.add (1))
  //. 43
  //.
  //. > S.map (S.T (100)) ([S.add (1), Math.sqrt])
  //. [101, 10]
  //. ```
  function T(x) {
    return function(f) {
      return f (x);
    };
  }
  _.T = {
    consts: {},
    types: [a, Fn (a) (b), b],
    impl: T
  };

  //. ### Function

  //# curry2 :: ((a, b) -> c) -> a -> b -> c
  //.
  //. Curries the given binary function.
  //.
  //. ```javascript
  //. > S.map (S.curry2 (Math.pow) (10)) ([1, 2, 3])
  //. [10, 100, 1000]
  //. ```
  function curry2(f) {
    return function(x) {
      return function(y) {
        return f (x, y);
      };
    };
  }
  _.curry2 = {
    consts: {},
    types: [$.Function ([a, b, c]), a, b, c],
    impl: curry2
  };

  //# curry3 :: ((a, b, c) -> d) -> a -> b -> c -> d
  //.
  //. Curries the given ternary function.
  //.
  //. ```javascript
  //. > const replaceString = S.curry3 ((what, replacement, string) =>
  //. .   string.replace (what, replacement)
  //. . )
  //.
  //. > replaceString ('banana') ('orange') ('banana icecream')
  //. 'orange icecream'
  //. ```
  function curry3(f) {
    return function(x) {
      return function(y) {
        return function(z) {
          return f (x, y, z);
        };
      };
    };
  }
  _.curry3 = {
    consts: {},
    types: [$.Function ([a, b, c, d]), a, b, c, d],
    impl: curry3
  };

  //# curry4 :: ((a, b, c, d) -> e) -> a -> b -> c -> d -> e
  //.
  //. Curries the given quaternary function.
  //.
  //. ```javascript
  //. > const createRect = S.curry4 ((x, y, width, height) =>
  //. .   ({x, y, width, height})
  //. . )
  //.
  //. > createRect (0) (0) (10) (10)
  //. {x: 0, y: 0, width: 10, height: 10}
  //. ```
  function curry4(f) {
    return function(w) {
      return function(x) {
        return function(y) {
          return function(z) {
            return f (w, x, y, z);
          };
        };
      };
    };
  }
  _.curry4 = {
    consts: {},
    types: [$.Function ([a, b, c, d, e]), a, b, c, d, e],
    impl: curry4
  };

  //# curry5 :: ((a, b, c, d, e) -> f) -> a -> b -> c -> d -> e -> f
  //.
  //. Curries the given quinary function.
  //.
  //. ```javascript
  //. > const toUrl = S.curry5 ((protocol, creds, hostname, port, pathname) =>
  //. .   protocol + '//' +
  //. .   S.maybe ('') (S.flip (S.concat) ('@')) (creds) +
  //. .   hostname +
  //. .   S.maybe ('') (S.concat (':')) (port) +
  //. .   pathname
  //. . )
  //.
  //. > toUrl ('https:') (S.Nothing) ('example.com') (S.Just ('443')) ('/foo/bar')
  //. 'https://example.com:443/foo/bar'
  //. ```
  function curry5(f) {
    return function(v) {
      return function(w) {
        return function(x) {
          return function(y) {
            return function(z) {
              return f (v, w, x, y, z);
            };
          };
        };
      };
    };
  }
  _.curry5 = {
    consts: {},
    types: [$.Function ([a, b, c, d, e, r]), a, b, c, d, e, r],
    impl: curry5
  };

  //. ### Composition

  //# compose :: Semigroupoid s => s b c -> s a b -> s a c
  //.
  //. Curried version of [`Z.compose`][].
  //.
  //. When specialized to Function, `compose` composes two unary functions,
  //. from right to left (this is the B combinator from combinatory logic).
  //.
  //. The generalized type signature indicates that `compose` is compatible
  //. with any [Semigroupoid][].
  //.
  //. See also [`pipe`](#pipe).
  //.
  //. ```javascript
  //. > S.compose (Math.sqrt) (S.add (1)) (99)
  //. 10
  //. ```
  _.compose = {
    consts: {s: [Z.Semigroupoid]},
    types: [s (b) (c), s (a) (b), s (a) (c)],
    impl: curry2 (Z.compose)
  };

  //# pipe :: Foldable f => f (Any -> Any) -> a -> b
  //.
  //. Takes a sequence of functions assumed to be unary and a value of any
  //. type, and returns the result of applying the sequence of transformations
  //. to the initial value.
  //.
  //. In general terms, `pipe` performs left-to-right composition of a sequence
  //. of functions. `pipe ([f, g, h]) (x)` is equivalent to `h (g (f (x)))`.
  //.
  //. ```javascript
  //. > S.pipe ([S.add (1), Math.sqrt, S.sub (1)]) (99)
  //. 9
  //. ```
  function pipe(fs) {
    return function(x) {
      return reduce (T) (x) (fs);
    };
  }
  _.pipe = {
    consts: {f: [Z.Foldable]},
    types: [f (Fn ($.Any) ($.Any)), a, b],
    impl: pipe
  };

  //# pipeK :: (Foldable f, Chain m) => f (Any -> m Any) -> m a -> m b
  //.
  //. Takes a sequence of functions assumed to be unary which return values
  //. with a [Chain][], and a value of that Chain, and returns the result
  //. of applying the sequence of transformations to the initial value.
  //.
  //. In general terms, `pipeK` performs left-to-right [Kleisli][] composition
  //. of an sequence of functions. `pipeK ([f, g, h]) (x)` is equivalent to
  //. `chain (h) (chain (g) (chain (f) (x)))`.
  //.
  //. ```javascript
  //. > S.pipeK ([S.tail, S.tail, S.head]) (S.Just ([1, 2, 3, 4]))
  //. Just (3)
  //. ```
  function pipeK(fs) {
    return function(x) {
      return Z.reduce (function(x, f) { return Z.chain (f, x); }, x, fs);
    };
  }
  _.pipeK = {
    consts: {f: [Z.Foldable], m: [Z.Chain]},
    types: [f (Fn ($.Any) (m ($.Any))), m (a), m (b)],
    impl: pipeK
  };

  //# on :: (b -> b -> c) -> (a -> b) -> a -> a -> c
  //.
  //. Takes a binary function `f`, a unary function `g`, and two
  //. values `x` and `y`. Returns `f (g (x)) (g (y))`.
  //.
  //. This is the P combinator from combinatory logic.
  //.
  //. ```javascript
  //. > S.on (S.concat) (S.reverse) ([1, 2, 3]) ([4, 5, 6])
  //. [3, 2, 1, 6, 5, 4]
  //. ```
  function on(f) {
    return function(g) {
      return function(x) {
        return function(y) {
          return f (g (x)) (g (y));
        };
      };
    };
  }
  _.on = {
    consts: {},
    types: [Fn (b) (Fn (b) (c)), Fn (a) (b), a, a, c],
    impl: on
  };

  //. ### Pair type
  //.
  //. Pair is the canonical product type: a value of type `Pair a b` always
  //. contains exactly two values: one of type `a`; one of type `b`.
  //.
  //. The implementation is provided by [sanctuary-pair][].

  //# PairType :: Type -> Type -> Type
  //.
  //. A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

  //# Pair :: a -> b -> Pair a b
  //.
  //. Pair's sole data constructor. Additionally, it serves as the
  //. Pair [type representative][].
  //.
  //. ```javascript
  //. > S.Pair ('foo') (42)
  //. Pair ('foo') (42)
  //. ```
  _.Pair = {
    consts: {},
    types: [a, b, $Pair (a) (b)],
    impl: Pair
  };

  //# fst :: Pair a b -> a
  //.
  //. `fst (Pair (x) (y))` is equivalent to `x`.
  //.
  //. ```javascript
  //. > S.fst (S.Pair ('foo') (42))
  //. 'foo'
  //. ```
  _.fst = {
    consts: {},
    types: [$Pair (a) (b), a],
    impl: Pair.fst
  };

  //# snd :: Pair a b -> b
  //.
  //. `snd (Pair (x) (y))` is equivalent to `y`.
  //.
  //. ```javascript
  //. > S.snd (S.Pair ('foo') (42))
  //. 42
  //. ```
  _.snd = {
    consts: {},
    types: [$Pair (a) (b), b],
    impl: Pair.snd
  };

  //# swap :: Pair a b -> Pair b a
  //.
  //. `swap (Pair (x) (y))` is equivalent to `Pair (y) (x)`.
  //.
  //. ```javascript
  //. > S.swap (S.Pair ('foo') (42))
  //. Pair (42) ('foo')
  //. ```
  _.swap = {
    consts: {},
    types: [$Pair (a) (b), $Pair (b) (a)],
    impl: Pair.swap
  };

  //. ### Maybe type
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either Nothing (the empty value) or a Just whose value is of type `a`.
  //.
  //. The implementation is provided by [sanctuary-maybe][].

  //# MaybeType :: Type -> Type
  //.
  //. A [`UnaryType`][UnaryType] for use with [sanctuary-def][].

  //# Maybe :: TypeRep Maybe
  //.
  //. Maybe [type representative][].

  //# Nothing :: Maybe a
  //.
  //. The empty value of type `Maybe a`.
  //.
  //. ```javascript
  //. > S.Nothing
  //. Nothing
  //. ```

  //# Just :: a -> Maybe a
  //.
  //. Constructs a value of type `Maybe a` from a value of type `a`.
  //.
  //. ```javascript
  //. > S.Just (42)
  //. Just (42)
  //. ```
  _.Just = {
    consts: {},
    types: [a, $Maybe (a)],
    impl: Just
  };

  //# isNothing :: Maybe a -> Boolean
  //.
  //. Returns `true` if the given Maybe is Nothing; `false` if it is a Just.
  //.
  //. ```javascript
  //. > S.isNothing (S.Nothing)
  //. true
  //.
  //. > S.isNothing (S.Just (42))
  //. false
  //. ```
  function isNothing(maybe) {
    return maybe.isNothing;
  }
  _.isNothing = {
    consts: {},
    types: [$Maybe (a), $.Boolean],
    impl: isNothing
  };

  //# isJust :: Maybe a -> Boolean
  //.
  //. Returns `true` if the given Maybe is a Just; `false` if it is Nothing.
  //.
  //. ```javascript
  //. > S.isJust (S.Just (42))
  //. true
  //.
  //. > S.isJust (S.Nothing)
  //. false
  //. ```
  function isJust(maybe) {
    return maybe.isJust;
  }
  _.isJust = {
    consts: {},
    types: [$Maybe (a), $.Boolean],
    impl: isJust
  };

  //# fromMaybe :: a -> Maybe a -> a
  //.
  //. Takes a default value and a Maybe, and returns the Maybe's value
  //. if the Maybe is a Just; the default value otherwise.
  //.
  //. See also [`fromMaybe_`](#fromMaybe_) and
  //. [`maybeToNullable`](#maybeToNullable).
  //.
  //. ```javascript
  //. > S.fromMaybe (0) (S.Just (42))
  //. 42
  //.
  //. > S.fromMaybe (0) (S.Nothing)
  //. 0
  //. ```
  _.fromMaybe = {
    consts: {},
    types: [a, $Maybe (a), a],
    impl: C (maybe) (I)
  };

  //# fromMaybe_ :: (() -> a) -> Maybe a -> a
  //.
  //. Variant of [`fromMaybe`](#fromMaybe) which takes a thunk so the default
  //. value is only computed if required.
  //.
  //. ```javascript
  //. > function fib(n) { return n <= 1 ? n : fib (n - 2) + fib (n - 1); }
  //.
  //. > S.fromMaybe_ (() => fib (30)) (S.Just (1000000))
  //. 1000000
  //.
  //. > S.fromMaybe_ (() => fib (30)) (S.Nothing)
  //. 832040
  //. ```
  _.fromMaybe_ = {
    consts: {},
    types: [$.Thunk (a), $Maybe (a), a],
    impl: C (maybe_) (I)
  };

  //# maybeToNullable :: Maybe a -> Nullable a
  //.
  //. Returns the given Maybe's value if the Maybe is a Just; `null` otherwise.
  //. [Nullable][] is defined in [sanctuary-def][].
  //.
  //. See also [`fromMaybe`](#fromMaybe).
  //.
  //. ```javascript
  //. > S.maybeToNullable (S.Just (42))
  //. 42
  //.
  //. > S.maybeToNullable (S.Nothing)
  //. null
  //. ```
  function maybeToNullable(maybe) {
    return maybe.isJust ? maybe.value : null;
  }
  _.maybeToNullable = {
    consts: {},
    types: [$Maybe (a), $.Nullable (a)],
    impl: maybeToNullable
  };

  //# toMaybe :: a? -> Maybe a
  //.
  //. Takes a value and returns Nothing if the value is `null` or `undefined`;
  //. Just the value otherwise.
  //.
  //. ```javascript
  //. > S.toMaybe (null)
  //. Nothing
  //.
  //. > S.toMaybe (42)
  //. Just (42)
  //. ```
  function toMaybe(x) {
    return x == null ? Nothing : Just (x);
  }
  _.toMaybe = {
    consts: {},
    types: [a, $Maybe (a)],
    impl: toMaybe
  };

  //# maybe :: b -> (a -> b) -> Maybe a -> b
  //.
  //. Takes a value of any type, a function, and a Maybe. If the Maybe is
  //. a Just, the return value is the result of applying the function to
  //. the Just's value. Otherwise, the first argument is returned.
  //.
  //. See also [`maybe_`](#maybe_).
  //.
  //. ```javascript
  //. > S.maybe (0) (S.prop ('length')) (S.Just ('refuge'))
  //. 6
  //.
  //. > S.maybe (0) (S.prop ('length')) (S.Nothing)
  //. 0
  //. ```
  function maybe(x) {
    return function(f) {
      return function(maybe) {
        return maybe.isJust ? f (maybe.value) : x;
      };
    };
  }
  _.maybe = {
    consts: {},
    types: [b, Fn (a) (b), $Maybe (a), b],
    impl: maybe
  };

  //# maybe_ :: (() -> b) -> (a -> b) -> Maybe a -> b
  //.
  //. Variant of [`maybe`](#maybe) which takes a thunk so the default value
  //. is only computed if required.
  //.
  //. ```javascript
  //. > function fib(n) { return n <= 1 ? n : fib (n - 2) + fib (n - 1); }
  //.
  //. > S.maybe_ (() => fib (30)) (Math.sqrt) (S.Just (1000000))
  //. 1000
  //.
  //. > S.maybe_ (() => fib (30)) (Math.sqrt) (S.Nothing)
  //. 832040
  //. ```
  function maybe_(thunk) {
    return function(f) {
      return function(maybe) {
        return maybe.isJust ? f (maybe.value) : thunk ();
      };
    };
  }
  _.maybe_ = {
    consts: {},
    types: [$.Thunk (b), Fn (a) (b), $Maybe (a), b],
    impl: maybe_
  };

  //# justs :: (Filterable f, Functor f) => f (Maybe a) -> f a
  //.
  //. Discards each element which is Nothing, and unwraps each element which is
  //. a Just. Related to Haskell's `catMaybes` function.
  //.
  //. See also [`lefts`](#lefts) and [`rights`](#rights).
  //.
  //. ```javascript
  //. > S.justs ([S.Just ('foo'), S.Nothing, S.Just ('baz')])
  //. ['foo', 'baz']
  //. ```
  function justs(maybes) {
    return map (value) (filter (isJust) (maybes));
  }
  _.justs = {
    consts: {f: [Z.Filterable, Z.Functor]},
    types: [f ($Maybe (a)), f (a)],
    impl: justs
  };

  //# mapMaybe :: (Filterable f, Functor f) => (a -> Maybe b) -> f a -> f b
  //.
  //. Takes a function and a structure, applies the function to each element
  //. of the structure, and returns the "successful" results. If the result of
  //. applying the function to an element is Nothing, the result is discarded;
  //. if the result is a Just, the Just's value is included.
  //.
  //. ```javascript
  //. > S.mapMaybe (S.head) ([[], [1, 2, 3], [], [4, 5, 6], []])
  //. [1, 4]
  //.
  //. > S.mapMaybe (S.head) ({x: [1, 2, 3], y: [], z: [4, 5, 6]})
  //. {x: 1, z: 4}
  //. ```
  _.mapMaybe = {
    consts: {f: [Z.Filterable, Z.Functor]},
    types: [Fn (a) ($Maybe (b)), f (a), f (b)],
    impl: B (B (justs)) (map)
  };

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
  //. > S.encase (eval) ('1 + 1')
  //. Just (2)
  //.
  //. > S.encase (eval) ('1 +')
  //. Nothing
  //. ```
  function encase(f) {
    return B (eitherToMaybe) (encaseEither (I) (f));
  }
  _.encase = {
    consts: {},
    types: [Fn (a) (b), a, $Maybe (b)],
    impl: encase
  };

  //# encase2 :: (a -> b -> c) -> a -> b -> Maybe c
  //.
  //. Binary version of [`encase`](#encase).
  _.encase2 = {
    consts: {},
    types: [Fn (a) (Fn (b) (c)), a, b, $Maybe (c)],
    impl: B (B (B (eitherToMaybe))) (encaseEither2 (I))
  };

  //# encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d
  //.
  //. Ternary version of [`encase`](#encase).
  _.encase3 = {
    consts: {},
    types: [Fn (a) (Fn (b) (Fn (c) (d))), a, b, c, $Maybe (d)],
    impl: B (B (B (B (eitherToMaybe)))) (encaseEither3 (I))
  };

  //# maybeToEither :: a -> Maybe b -> Either a b
  //.
  //. Converts a Maybe to an Either. Nothing becomes a Left (containing the
  //. first argument); a Just becomes a Right.
  //.
  //. See also [`eitherToMaybe`](#eitherToMaybe).
  //.
  //. ```javascript
  //. > S.maybeToEither ('Expecting an integer') (S.parseInt (10) ('xyz'))
  //. Left ('Expecting an integer')
  //.
  //. > S.maybeToEither ('Expecting an integer') (S.parseInt (10) ('42'))
  //. Right (42)
  //. ```
  function maybeToEither(x) {
    return maybe (Left (x)) (Right);
  }
  _.maybeToEither = {
    consts: {},
    types: [a, $Maybe (b), $Either (a) (b)],
    impl: maybeToEither
  };

  //. ### Either type
  //.
  //. The Either type represents values with two possibilities: a value of type
  //. `Either a b` is either a Left whose value is of type `a` or a Right whose
  //. value is of type `b`.
  //.
  //. The implementation is provided by [sanctuary-either][].

  //# EitherType :: Type -> Type -> Type
  //.
  //. A [`BinaryType`][BinaryType] for use with [sanctuary-def][].

  //# Either :: TypeRep Either
  //.
  //. Either [type representative][].

  //# Left :: a -> Either a b
  //.
  //. Constructs a value of type `Either a b` from a value of type `a`.
  //.
  //. ```javascript
  //. > S.Left ('Cannot divide by zero')
  //. Left ('Cannot divide by zero')
  //. ```
  _.Left = {
    consts: {},
    types: [a, $Either (a) (b)],
    impl: Left
  };

  //# Right :: b -> Either a b
  //.
  //. Constructs a value of type `Either a b` from a value of type `b`.
  //.
  //. ```javascript
  //. > S.Right (42)
  //. Right (42)
  //. ```
  _.Right = {
    consts: {},
    types: [b, $Either (a) (b)],
    impl: Right
  };

  //# isLeft :: Either a b -> Boolean
  //.
  //. Returns `true` if the given Either is a Left; `false` if it is a Right.
  //.
  //. ```javascript
  //. > S.isLeft (S.Left ('Cannot divide by zero'))
  //. true
  //.
  //. > S.isLeft (S.Right (42))
  //. false
  //. ```
  function isLeft(either) {
    return either.isLeft;
  }
  _.isLeft = {
    consts: {},
    types: [$Either (a) (b), $.Boolean],
    impl: isLeft
  };

  //# isRight :: Either a b -> Boolean
  //.
  //. Returns `true` if the given Either is a Right; `false` if it is a Left.
  //.
  //. ```javascript
  //. > S.isRight (S.Right (42))
  //. true
  //.
  //. > S.isRight (S.Left ('Cannot divide by zero'))
  //. false
  //. ```
  function isRight(either) {
    return either.isRight;
  }
  _.isRight = {
    consts: {},
    types: [$Either (a) (b), $.Boolean],
    impl: isRight
  };

  //# fromEither :: b -> Either a b -> b
  //.
  //. Takes a default value and an Either, and returns the Right value
  //. if the Either is a Right; the default value otherwise.
  //.
  //. ```javascript
  //. > S.fromEither (0) (S.Right (42))
  //. 42
  //.
  //. > S.fromEither (0) (S.Left (42))
  //. 0
  //. ```
  function fromEither(x) {
    return either (K (x)) (I);
  }
  _.fromEither = {
    consts: {},
    types: [b, $Either (a) (b), b],
    impl: fromEither
  };

  //# toEither :: a -> b? -> Either a b
  //.
  //. Converts an arbitrary value to an Either: a Left if the value is `null`
  //. or `undefined`; a Right otherwise. The first argument specifies the
  //. value of the Left in the "failure" case.
  //.
  //. ```javascript
  //. > S.toEither ('XYZ') (null)
  //. Left ('XYZ')
  //.
  //. > S.toEither ('XYZ') ('ABC')
  //. Right ('ABC')
  //.
  //. > S.map (S.prop ('0'))
  //. .       (S.toEither ('Invalid protocol')
  //. .                   ('ftp://example.com/'.match (/^https?:/)))
  //. Left ('Invalid protocol')
  //.
  //. > S.map (S.prop ('0'))
  //. .       (S.toEither ('Invalid protocol')
  //. .                   ('https://example.com/'.match (/^https?:/)))
  //. Right ('https:')
  //. ```
  function toEither(x) {
    return function(y) {
      return y == null ? Left (x) : Right (y);
    };
  }
  _.toEither = {
    consts: {},
    types: [a, b, $Either (a) (b)],
    impl: toEither
  };

  //# either :: (a -> c) -> (b -> c) -> Either a b -> c
  //.
  //. Takes two functions and an Either, and returns the result of
  //. applying the first function to the Left's value, if the Either
  //. is a Left, or the result of applying the second function to the
  //. Right's value, if the Either is a Right.
  //.
  //. ```javascript
  //. > S.either (S.toUpper) (S.show) (S.Left ('Cannot divide by zero'))
  //. 'CANNOT DIVIDE BY ZERO'
  //.
  //. > S.either (S.toUpper) (S.show) (S.Right (42))
  //. '42'
  //. ```
  function either(l) {
    return function(r) {
      return function(either) {
        return (either.isLeft ? l : r) (either.value);
      };
    };
  }
  _.either = {
    consts: {},
    types: [Fn (a) (c), Fn (b) (c), $Either (a) (b), c],
    impl: either
  };

  //# lefts :: (Filterable f, Functor f) => f (Either a b) -> f a
  //.
  //. Discards each element which is a Right, and unwraps each element which is
  //. a Left.
  //.
  //. See also [`rights`](#rights).
  //.
  //. ```javascript
  //. > S.lefts ([S.Right (20), S.Left ('foo'), S.Right (10), S.Left ('bar')])
  //. ['foo', 'bar']
  //. ```
  _.lefts = {
    consts: {f: [Z.Filterable, Z.Functor]},
    types: [f ($Either (a) (b)), f (a)],
    impl: B (map (value)) (filter (isLeft))
  };

  //# rights :: (Filterable f, Functor f) => f (Either a b) -> f b
  //.
  //. Discards each element which is a Left, and unwraps each element which is
  //. a Right.
  //.
  //. See also [`lefts`](#lefts).
  //.
  //. ```javascript
  //. > S.rights ([S.Right (20), S.Left ('foo'), S.Right (10), S.Left ('bar')])
  //. [20, 10]
  //. ```
  _.rights = {
    consts: {f: [Z.Filterable, Z.Functor]},
    types: [f ($Either (a) (b)), f (b)],
    impl: B (map (value)) (filter (isRight))
  };

  //# tagBy :: (a -> Boolean) -> a -> Either a a
  //.
  //. Takes a predicate and a value, and returns a Right of the value if it
  //. satisfies the predicate; a Left of the value otherwise.
  //.
  //. ```javascript
  //. > S.tagBy (S.odd) (0)
  //. Left (0)
  //
  //. > S.tagBy (S.odd) (1)
  //. Right (1)
  //. ```
  function tagBy(pred) {
    return ifElse (pred) (Right) (Left);
  }
  _.tagBy = {
    consts: {},
    types: [$.Predicate (a), a, $Either (a) (a)],
    impl: tagBy
  };

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
  //. > S.encaseEither (S.I) (JSON.parse) ('["foo","bar","baz"]')
  //. Right (['foo', 'bar', 'baz'])
  //.
  //. > S.encaseEither (S.I) (JSON.parse) ('[')
  //. Left (new SyntaxError ('Unexpected end of JSON input'))
  //.
  //. > S.encaseEither (S.prop ('message')) (JSON.parse) ('[')
  //. Left ('Unexpected end of JSON input')
  //. ```
  function encaseEither(f) {
    return function(g) {
      return function(x) {
        try {
          return Right (g (x));
        } catch (err) {
          return Left (f (err));
        }
      };
    };
  }
  _.encaseEither = {
    consts: {},
    types: [Fn ($.Error) (l), Fn (a) (r), a, $Either (l) (r)],
    impl: encaseEither
  };

  //# encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r
  //.
  //. Binary version of [`encaseEither`](#encaseEither).
  function encaseEither2(f) {
    return function(g) {
      return function(x) {
        return function(y) {
          try {
            return Right (g (x) (y));
          } catch (err) {
            return Left (f (err));
          }
        };
      };
    };
  }
  _.encaseEither2 = {
    consts: {},
    types: [Fn ($.Error) (l), Fn (a) (Fn (b) (r)), a, b, $Either (l) (r)],
    impl: encaseEither2
  };

  //# encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r
  //.
  //. Ternary version of [`encaseEither`](#encaseEither).
  function encaseEither3(f) {
    return function(g) {
      return function(x) {
        return function(y) {
          return function(z) {
            try {
              return Right (g (x) (y) (z));
            } catch (err) {
              return Left (f (err));
            }
          };
        };
      };
    };
  }
  _.encaseEither3 = {
    consts: {},
    types: [Fn ($.Error) (l),
            Fn (a) (Fn (b) (Fn (c) (r))),
            a,
            b,
            c,
            $Either (l) (r)],
    impl: encaseEither3
  };

  //# eitherToMaybe :: Either a b -> Maybe b
  //.
  //. Converts an Either to a Maybe. A Left becomes Nothing; a Right becomes
  //. a Just.
  //.
  //. See also [`maybeToEither`](#maybeToEither).
  //.
  //. ```javascript
  //. > S.eitherToMaybe (S.Left ('Cannot divide by zero'))
  //. Nothing
  //.
  //. > S.eitherToMaybe (S.Right (42))
  //. Just (42)
  //. ```
  function eitherToMaybe(either) {
    return either.isLeft ? Nothing : Just (either.value);
  }
  _.eitherToMaybe = {
    consts: {},
    types: [$Either (a) (b), $Maybe (b)],
    impl: eitherToMaybe
  };

  //. ### Logic

  //# and :: Boolean -> Boolean -> Boolean
  //.
  //. Boolean "and".
  //.
  //. ```javascript
  //. > S.and (false) (false)
  //. false
  //.
  //. > S.and (false) (true)
  //. false
  //.
  //. > S.and (true) (false)
  //. false
  //.
  //. > S.and (true) (true)
  //. true
  //. ```
  function and(x) {
    return function(y) {
      return x && y;
    };
  }
  _.and = {
    consts: {},
    types: [$.Boolean, $.Boolean, $.Boolean],
    impl: and
  };

  //# or :: Boolean -> Boolean -> Boolean
  //.
  //. Boolean "or".
  //.
  //. ```javascript
  //. > S.or (false) (false)
  //. false
  //.
  //. > S.or (false) (true)
  //. true
  //.
  //. > S.or (true) (false)
  //. true
  //.
  //. > S.or (true) (true)
  //. true
  //. ```
  function or(x) {
    return function(y) {
      return x || y;
    };
  }
  _.or = {
    consts: {},
    types: [$.Boolean, $.Boolean, $.Boolean],
    impl: or
  };

  //# not :: Boolean -> Boolean
  //.
  //. Boolean "not".
  //.
  //. See also [`complement`](#complement).
  //.
  //. ```javascript
  //. > S.not (false)
  //. true
  //.
  //. > S.not (true)
  //. false
  //. ```
  function not(x) {
    return !x;
  }
  _.not = {
    consts: {},
    types: [$.Boolean, $.Boolean],
    impl: not
  };

  //# complement :: (a -> Boolean) -> a -> Boolean
  //.
  //. Takes a unary predicate and a value of any type, and returns the logical
  //. negation of applying the predicate to the value.
  //.
  //. See also [`not`](#not).
  //.
  //. ```javascript
  //. > Number.isInteger (42)
  //. true
  //.
  //. > S.complement (Number.isInteger) (42)
  //. false
  //. ```
  _.complement = {
    consts: {},
    types: [$.Predicate (a), a, $.Boolean],
    impl: B (not)
  };

  //# ifElse :: (a -> Boolean) -> (a -> b) -> (a -> b) -> a -> b
  //.
  //. Takes a unary predicate, a unary "if" function, a unary "else"
  //. function, and a value of any type, and returns the result of
  //. applying the "if" function to the value if the value satisfies
  //. the predicate; the result of applying the "else" function to the
  //. value otherwise.
  //.
  //. See also [`when`](#when) and [`unless`](#unless).
  //.
  //. ```javascript
  //. > S.ifElse (x => x < 0) (Math.abs) (Math.sqrt) (-1)
  //. 1
  //.
  //. > S.ifElse (x => x < 0) (Math.abs) (Math.sqrt) (16)
  //. 4
  //. ```
  function ifElse(pred) {
    return function(f) {
      return function(g) {
        return function(x) {
          return (pred (x) ? f : g) (x);
        };
      };
    };
  }
  _.ifElse = {
    consts: {},
    types: [$.Predicate (a), Fn (a) (b), Fn (a) (b), a, b],
    impl: ifElse
  };

  //# when :: (a -> Boolean) -> (a -> a) -> a -> a
  //.
  //. Takes a unary predicate, a unary function, and a value of any type, and
  //. returns the result of applying the function to the value if the value
  //. satisfies the predicate; the value otherwise.
  //.
  //. See also [`unless`](#unless) and [`ifElse`](#ifElse).
  //.
  //. ```javascript
  //. > S.when (x => x >= 0) (Math.sqrt) (16)
  //. 4
  //.
  //. > S.when (x => x >= 0) (Math.sqrt) (-1)
  //. -1
  //. ```
  function when(pred) {
    return C (ifElse (pred)) (I);
  }
  _.when = {
    consts: {},
    types: [$.Predicate (a), Fn (a) (a), a, a],
    impl: when
  };

  //# unless :: (a -> Boolean) -> (a -> a) -> a -> a
  //.
  //. Takes a unary predicate, a unary function, and a value of any type, and
  //. returns the result of applying the function to the value if the value
  //. does not satisfy the predicate; the value otherwise.
  //.
  //. See also [`when`](#when) and [`ifElse`](#ifElse).
  //.
  //. ```javascript
  //. > S.unless (x => x < 0) (Math.sqrt) (16)
  //. 4
  //.
  //. > S.unless (x => x < 0) (Math.sqrt) (-1)
  //. -1
  //. ```
  function unless(pred) {
    return ifElse (pred) (I);
  }
  _.unless = {
    consts: {},
    types: [$.Predicate (a), Fn (a) (a), a, a],
    impl: unless
  };

  //# allPass :: Foldable f => f (a -> Boolean) -> a -> Boolean
  //.
  //. Takes a structure containing zero or more predicates, and a value
  //. of any type. Returns `true` [iff][] the value satisfies all of the
  //. predicates. None of the subsequent predicates will be applied after
  //. the first predicate not satisfied.
  //.
  //. ```javascript
  //. > S.allPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('quiessence')
  //. true
  //.
  //. > S.allPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('fissiparous')
  //. false
  //. ```
  function allPass(preds) {
    return function(x) {
      return Z.reduce (function(b, p) { return b && p (x); }, true, preds);
    };
  }
  _.allPass = {
    consts: {f: [Z.Foldable]},
    types: [f ($.Predicate (a)), a, $.Boolean],
    impl: allPass
  };

  //# anyPass :: Foldable f => f (a -> Boolean) -> a -> Boolean
  //.
  //. Takes a structure containing zero or more predicates, and a value
  //. of any type. Returns `true` [iff][] the value satisfies any of the
  //. predicates. None of the subsequent predicates will be applied after
  //. the first predicate satisfied.
  //.
  //. ```javascript
  //. > S.anyPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('incandescent')
  //. true
  //.
  //. > S.anyPass ([S.test (/q/), S.test (/u/), S.test (/i/)]) ('empathy')
  //. false
  //. ```
  function anyPass(preds) {
    return function(x) {
      return Z.reduce (function(b, p) { return b || p (x); }, false, preds);
    };
  }
  _.anyPass = {
    consts: {f: [Z.Foldable]},
    types: [f ($.Predicate (a)), a, $.Boolean],
    impl: anyPass
  };

  //. ### Array

  //# slice :: Integer -> Integer -> Array a -> Maybe (Array a)
  //.
  //. Takes a start index `i`, an end index `j`, and an array, and returns
  //. Just the `[i,j)` slice of the array if possible; Nothing otherwise.
  //. A negative index represents an offset from the length of the array.
  //.
  //. See also [`take`](#take), [`drop`](#drop), [`takeLast`](#takeLast),
  //. and [`dropLast`](#dropLast).
  //.
  //. ```javascript
  //. > S.slice (1) (3) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['b', 'c'])
  //.
  //. > S.slice (-3) (-1) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['c', 'd'])
  //.
  //. > S.slice (1) (6) (['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //. ```
  function slice(start) {
    return function(end) {
      return function(xs) {
        var fromIdx = start < 0 ? start + xs.length : start;
        var toIdx = end < 0 ? end + xs.length : end;

        return Math.abs (start) <= xs.length &&
               Math.abs (end) <= xs.length &&
               fromIdx <= toIdx ?
                 Just (xs.slice (fromIdx, toIdx)) :
                 Nothing;
      };
    };
  }
  _.slice = {
    consts: {},
    types: [$.Integer, $.Integer, $.Array (a), $Maybe ($.Array (a))],
    impl: slice
  };

  //# at :: Integer -> Array a -> Maybe a
  //.
  //. Returns Just the element of the given array at the specified index if
  //. the index is within the array's bounds; Nothing otherwise. A negative
  //. index represents an offset from the length of the array.
  //.
  //. ```javascript
  //. > S.at (2) (['a', 'b', 'c', 'd', 'e'])
  //. Just ('c')
  //.
  //. > S.at (5) (['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //.
  //. > S.at (-2) (['a', 'b', 'c', 'd', 'e'])
  //. Just ('d')
  //. ```
  function at(n) {
    return function(xs) {
      var idx = n < 0 ? xs.length + n : n;
      return idx < 0 || idx >= xs.length ? Nothing : Just (xs[idx]);
    };
  }
  _.at = {
    consts: {},
    types: [$.Integer, $.Array (a), $Maybe (a)],
    impl: at
  };

  //# head :: Array a -> Maybe a
  //.
  //. Returns Just the first element of the given array if the array contains
  //. at least one element; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.head ([1, 2, 3])
  //. Just (1)
  //.
  //. > S.head ([])
  //. Nothing
  //. ```
  function head(xs) {
    return xs.length > 0 ? Just (xs[0]) : Nothing;
  }
  _.head = {
    consts: {},
    types: [$.Array (a), $Maybe (a)],
    impl: head
  };

  //# last :: Array a -> Maybe a
  //.
  //. Returns Just the last element of the given array if the array contains
  //. at least one element; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.last ([1, 2, 3])
  //. Just (3)
  //.
  //. > S.last ([])
  //. Nothing
  //. ```
  function last(xs) {
    return xs.length > 0 ? Just (xs[xs.length - 1]) : Nothing;
  }
  _.last = {
    consts: {},
    types: [$.Array (a), $Maybe (a)],
    impl: last
  };

  //# tail :: Array a -> Maybe (Array a)
  //.
  //. Returns Just all but the first of the given array's elements if the
  //. array contains at least one element; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.tail ([1, 2, 3])
  //. Just ([2, 3])
  //.
  //. > S.tail ([])
  //. Nothing
  //. ```
  function tail(xs) {
    return xs.length > 0 ? Just (xs.slice (1)) : Nothing;
  }
  _.tail = {
    consts: {},
    types: [$.Array (a), $Maybe ($.Array (a))],
    impl: tail
  };

  //# init :: Array a -> Maybe (Array a)
  //.
  //. Returns Just all but the last of the given array's elements if the
  //. array contains at least one element; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.init ([1, 2, 3])
  //. Just ([1, 2])
  //.
  //. > S.init ([])
  //. Nothing
  //. ```
  function init(xs) {
    return xs.length > 0 ? Just (xs.slice (0, -1)) : Nothing;
  }
  _.init = {
    consts: {},
    types: [$.Array (a), $Maybe ($.Array (a))],
    impl: init
  };

  //# take :: Integer -> Array a -> Maybe (Array a)
  //.
  //. Returns Just the first N elements of the given array if N is greater
  //. than or equal to zero and less than or equal to the length of the array;
  //. Nothing otherwise.
  //.
  //. ```javascript
  //. > S.take (2) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['a', 'b'])
  //.
  //. > S.take (5) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['a', 'b', 'c', 'd', 'e'])
  //.
  //. > S.take (6) (['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //. ```
  function take(n) {
    return function(xs) {
      return n >= 0 && n <= xs.length ? Just (xs.slice (0, n)) : Nothing;
    };
  }
  _.take = {
    consts: {},
    types: [$.Integer, $.Array (a), $Maybe ($.Array (a))],
    impl: take
  };

  //# takeLast :: Integer -> Array a -> Maybe (Array a)
  //.
  //. Returns Just the last N elements of the given array if N is greater
  //. than or equal to zero and less than or equal to the length of the array;
  //. Nothing otherwise.
  //.
  //. ```javascript
  //. > S.takeLast (2) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['d', 'e'])
  //.
  //. > S.takeLast (5) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['a', 'b', 'c', 'd', 'e'])
  //.
  //. > S.takeLast (6) (['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //. ```
  function takeLast(n) {
    return function(xs) {
      return n >= 0 && n <= xs.length ? Just (xs.slice (xs.length - n))
                                      : Nothing;
    };
  }
  _.takeLast = {
    consts: {},
    types: [$.Integer, $.Array (a), $Maybe ($.Array (a))],
    impl: takeLast
  };

  //# drop :: Integer -> Array a -> Maybe (Array a)
  //.
  //. Returns Just all but the first N elements of the given array if N is
  //. greater than or equal to zero and less than or equal to the length of
  //. the array; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.drop (2) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['c', 'd', 'e'])
  //.
  //. > S.drop (5) (['a', 'b', 'c', 'd', 'e'])
  //. Just ([])
  //.
  //. > S.drop (6) (['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //. ```
  function drop(n) {
    return function(xs) {
      return n >= 0 && n <= xs.length ? Just (xs.slice (n)) : Nothing;
    };
  }
  _.drop = {
    consts: {},
    types: [$.Integer, $.Array (a), $Maybe ($.Array (a))],
    impl: drop
  };

  //# dropLast :: Integer -> Array a -> Maybe (Array a)
  //.
  //. Returns Just all but the last N elements of the given array if N is
  //. greater than or equal to zero and less than or equal to the length of
  //. the array; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.dropLast (2) (['a', 'b', 'c', 'd', 'e'])
  //. Just (['a', 'b', 'c'])
  //.
  //. > S.dropLast (5) (['a', 'b', 'c', 'd', 'e'])
  //. Just ([])
  //.
  //. > S.dropLast (6) (['a', 'b', 'c', 'd', 'e'])
  //. Nothing
  //. ```
  function dropLast(n) {
    return function(xs) {
      return n >= 0 && n <= xs.length ? Just (xs.slice (0, xs.length - n))
                                      : Nothing;
    };
  }
  _.dropLast = {
    consts: {},
    types: [$.Integer, $.Array (a), $Maybe ($.Array (a))],
    impl: dropLast
  };

  //# size :: Foldable f => f a -> Integer
  //.
  //. Returns the number of elements of the given structure.
  //.
  //. ```javascript
  //. > S.size ([])
  //. 0
  //.
  //. > S.size (['foo', 'bar', 'baz'])
  //. 3
  //.
  //. > S.size (Nil)
  //. 0
  //.
  //. > S.size (Cons ('foo') (Cons ('bar') (Cons ('baz') (Nil))))
  //. 3
  //.
  //. > S.size (S.Nothing)
  //. 0
  //.
  //. > S.size (S.Just ('quux'))
  //. 1
  //.
  //. > S.size (S.Pair ('ignored!') ('counted!'))
  //. 1
  //. ```
  _.size = {
    consts: {f: [Z.Foldable]},
    types: [f (a), $.Integer],
    impl: Z.size
  };

  //# append :: (Applicative f, Semigroup (f a)) => a -> f a -> f a
  //.
  //. Returns the result of appending the first argument to the second.
  //.
  //. See also [`prepend`](#prepend).
  //.
  //. ```javascript
  //. > S.append (3) ([1, 2])
  //. [1, 2, 3]
  //.
  //. > S.append (3) (Cons (1) (Cons (2) (Nil)))
  //. Cons (1) (Cons (2) (Cons (3) (Nil)))
  //.
  //. > S.append ([1]) (S.Nothing)
  //. Just ([1])
  //.
  //. > S.append ([3]) (S.Just ([1, 2]))
  //. Just ([1, 2, 3])
  //. ```
  _.append = {
    consts: {f: [Z.Applicative, Z.Semigroup]},
    types: [a, f (a), f (a)],
    impl: curry2 (Z.append)
  };

  //# prepend :: (Applicative f, Semigroup (f a)) => a -> f a -> f a
  //.
  //. Returns the result of prepending the first argument to the second.
  //.
  //. See also [`append`](#append).
  //.
  //. ```javascript
  //. > S.prepend (1) ([2, 3])
  //. [1, 2, 3]
  //.
  //. > S.prepend (1) (Cons (2) (Cons (3) (Nil)))
  //. Cons (1) (Cons (2) (Cons (3) (Nil)))
  //.
  //. > S.prepend ([1]) (S.Nothing)
  //. Just ([1])
  //.
  //. > S.prepend ([1]) (S.Just ([2, 3]))
  //. Just ([1, 2, 3])
  //. ```
  _.prepend = {
    consts: {f: [Z.Applicative, Z.Semigroup]},
    types: [a, f (a), f (a)],
    impl: curry2 (Z.prepend)
  };

  //# joinWith :: String -> Array String -> String
  //.
  //. Joins the strings of the second argument separated by the first argument.
  //.
  //. Properties:
  //.
  //.   - `forall s :: String, t :: String.
  //.      S.joinWith (s) (S.splitOn (s) (t)) = t`
  //.
  //. See also [`splitOn`](#splitOn).
  //.
  //. ```javascript
  //. > S.joinWith (':') (['foo', 'bar', 'baz'])
  //. 'foo:bar:baz'
  //. ```
  _.joinWith = {
    consts: {},
    types: [$.String, $.Array ($.String), $.String],
    impl: invoke1 ('join')
  };

  //# elem :: (Setoid a, Foldable f) => a -> f a -> Boolean
  //.
  //. Takes a value and a structure and returns `true` [iff][] the value is an
  //. element of the structure.
  //.
  //. See also [`find`](#find).
  //.
  //. ```javascript
  //. > S.elem ('c') (['a', 'b', 'c'])
  //. true
  //.
  //. > S.elem ('x') (['a', 'b', 'c'])
  //. false
  //.
  //. > S.elem (3) ({x: 1, y: 2, z: 3})
  //. true
  //.
  //. > S.elem (8) ({x: 1, y: 2, z: 3})
  //. false
  //.
  //. > S.elem (0) (S.Just (0))
  //. true
  //.
  //. > S.elem (0) (S.Just (1))
  //. false
  //.
  //. > S.elem (0) (S.Nothing)
  //. false
  //. ```
  _.elem = {
    consts: {a: [Z.Setoid], f: [Z.Foldable]},
    types: [a, f (a), $.Boolean],
    impl: curry2 (Z.elem)
  };

  //# find :: Foldable f => (a -> Boolean) -> f a -> Maybe a
  //.
  //. Takes a predicate and a structure and returns Just the leftmost element
  //. of the structure which satisfies the predicate; Nothing if there is no
  //. such element.
  //.
  //. See also [`elem`](#elem).
  //.
  //. ```javascript
  //. > S.find (S.lt (0)) ([1, -2, 3, -4, 5])
  //. Just (-2)
  //.
  //. > S.find (S.lt (0)) ([1, 2, 3, 4, 5])
  //. Nothing
  //. ```
  function find(pred) {
    return function(xs) {
      return Z.reduce (
        function(m, x) {
          return m.isJust ? m : pred (x) ? Just (x) : Nothing;
        },
        Nothing,
        xs
      );
    };
  }
  _.find = {
    consts: {f: [Z.Foldable]},
    types: [$.Predicate (a), f (a), $Maybe (a)],
    impl: find
  };

  //# foldMap :: (Monoid m, Foldable f) => TypeRep m -> (a -> m) -> f a -> m
  //.
  //. Curried version of [`Z.foldMap`][]. Deconstructs a foldable by mapping
  //. every element to a monoid and concatenating the results.
  //.
  //. ```javascript
  //. > S.foldMap (String) (f => f.name) ([Math.sin, Math.cos, Math.tan])
  //. 'sincostan'
  //. ```
  _.foldMap = {
    consts: {b: [Z.Monoid], f: [Z.Foldable]},
    types: [TypeRep (b), Fn (a) (b), f (a), b],
    impl: curry3 (Z.foldMap)
  };

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
  //. > S.unfoldr (n => n < 5 ? S.Just (S.Pair (n) (n + 1)) : S.Nothing) (1)
  //. [1, 2, 3, 4]
  //. ```
  function unfoldr(f) {
    return function(x) {
      var result = [];
      for (var m = f (x); m.isJust; m = f (m.value.snd)) {
        result.push (m.value.fst);
      }
      return result;
    };
  }
  _.unfoldr = {
    consts: {},
    types: [Fn (b) ($Maybe ($Pair (a) (b))), b, $.Array (a)],
    impl: unfoldr
  };

  //# range :: Integer -> Integer -> Array Integer
  //.
  //. Returns an array of consecutive integers starting with the first argument
  //. and ending with the second argument minus one. Returns `[]` if the second
  //. argument is less than or equal to the first argument.
  //.
  //. ```javascript
  //. > S.range (0) (10)
  //. [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  //.
  //. > S.range (-5) (0)
  //. [-5, -4, -3, -2, -1]
  //.
  //. > S.range (0) (-5)
  //. []
  //. ```
  function range(from) {
    return function(to) {
      var result = [];
      for (var n = from; n < to; n += 1) result.push (n);
      return result;
    };
  }
  _.range = {
    consts: {},
    types: [$.Integer, $.Integer, $.Array ($.Integer)],
    impl: range
  };

  //# groupBy :: (a -> a -> Boolean) -> Array a -> Array (Array a)
  //.
  //. Splits its array argument into an array of arrays of equal,
  //. adjacent elements. Equality is determined by the function
  //. provided as the first argument. Its behaviour can be surprising
  //. for functions that aren't reflexive, transitive, and symmetric
  //. (see [equivalence][] relation).
  //.
  //. Properties:
  //.
  //.   - `forall f :: a -> a -> Boolean, xs :: Array a.
  //.      S.join (S.groupBy (f) (xs)) = xs`
  //.
  //. ```javascript
  //. > S.groupBy (S.equals) ([1, 1, 2, 1, 1])
  //. [[1, 1], [2], [1, 1]]
  //.
  //. > S.groupBy (x => y => x + y === 0) ([2, -3, 3, 3, 3, 4, -4, 4])
  //. [[2], [-3, 3, 3, 3], [4, -4], [4]]
  //. ```
  function groupBy(f) {
    return function(xs) {
      if (xs.length === 0) return [];
      var x0 = xs[0];         // :: a
      var active = [x0];      // :: Array a
      var result = [active];  // :: Array (Array a)
      for (var idx = 1; idx < xs.length; idx += 1) {
        var x = xs[idx];
        if (f (x0) (x)) active.push (x); else result.push (active = [x0 = x]);
      }
      return result;
    };
  }
  _.groupBy = {
    consts: {},
    types: [Fn (a) ($.Predicate (a)), $.Array (a), $.Array ($.Array (a))],
    impl: groupBy
  };

  //# reverse :: (Applicative f, Foldable f, Monoid (f a)) => f a -> f a
  //.
  //. Reverses the elements of the given structure.
  //.
  //. ```javascript
  //. > S.reverse ([1, 2, 3])
  //. [3, 2, 1]
  //.
  //. > S.reverse (Cons (1) (Cons (2) (Cons (3) (Nil))))
  //. Cons (3) (Cons (2) (Cons (1) (Nil)))
  //.
  //. > S.pipe ([S.splitOn (''), S.reverse, S.joinWith ('')]) ('abc')
  //. 'cba'
  //. ```
  _.reverse = {
    consts: {f: [Z.Applicative, Z.Foldable, Z.Monoid]},
    types: [f (a), f (a)],
    impl: Z.reverse
  };

  //# sort :: (Ord a, Applicative m, Foldable m, Monoid (m a)) => m a -> m a
  //.
  //. Performs a [stable sort][] of the elements of the given structure, using
  //. [`Z.lte`][] for comparisons.
  //.
  //. Properties:
  //.
  //.   - `S.sort (S.sort (m)) = S.sort (m)` (idempotence)
  //.
  //. See also [`sortBy`](#sortBy).
  //.
  //. ```javascript
  //. > S.sort (['foo', 'bar', 'baz'])
  //. ['bar', 'baz', 'foo']
  //.
  //. > S.sort ([S.Left (4), S.Right (3), S.Left (2), S.Right (1)])
  //. [Left (2), Left (4), Right (1), Right (3)]
  //. ```
  _.sort = {
    consts: {a: [Z.Ord], m: [Z.Applicative, Z.Foldable, Z.Monoid]},
    types: [m (a), m (a)],
    impl: Z.sort
  };

  //# sortBy :: (Ord b, Applicative m, Foldable m, Monoid (m a)) => (a -> b) -> m a -> m a
  //.
  //. Performs a [stable sort][] of the elements of the given structure, using
  //. [`Z.lte`][] to compare the values produced by applying the given function
  //. to each element of the structure.
  //.
  //. Properties:
  //.
  //.   - `S.sortBy (f) (S.sortBy (f) (m)) = S.sortBy (f) (m)` (idempotence)
  //.
  //. See also [`sort`](#sort).
  //.
  //. ```javascript
  //. > S.sortBy (S.prop ('rank')) ([
  //. .   {rank: 7, suit: 'spades'},
  //. .   {rank: 5, suit: 'hearts'},
  //. .   {rank: 2, suit: 'hearts'},
  //. .   {rank: 5, suit: 'spades'},
  //. . ])
  //. [ {rank: 2, suit: 'hearts'},
  //. . {rank: 5, suit: 'hearts'},
  //. . {rank: 5, suit: 'spades'},
  //. . {rank: 7, suit: 'spades'} ]
  //.
  //. > S.sortBy (S.prop ('suit')) ([
  //. .   {rank: 7, suit: 'spades'},
  //. .   {rank: 5, suit: 'hearts'},
  //. .   {rank: 2, suit: 'hearts'},
  //. .   {rank: 5, suit: 'spades'},
  //. . ])
  //. [ {rank: 5, suit: 'hearts'},
  //. . {rank: 2, suit: 'hearts'},
  //. . {rank: 7, suit: 'spades'},
  //. . {rank: 5, suit: 'spades'} ]
  //. ```
  _.sortBy = {
    consts: {b: [Z.Ord], m: [Z.Applicative, Z.Foldable, Z.Monoid]},
    types: [Fn (a) (b), m (a), m (a)],
    impl: curry2 (Z.sortBy)
  };

  //# zip :: Array a -> Array b -> Array (Pair a b)
  //.
  //. Returns an array of pairs of corresponding elements from the given
  //. arrays. The length of the resulting array is equal to the length of
  //. the shorter input array.
  //.
  //. See also [`zipWith`](#zipWith).
  //.
  //. ```javascript
  //. > S.zip (['a', 'b']) (['x', 'y', 'z'])
  //. [Pair ('a') ('x'), Pair ('b') ('y')]
  //.
  //. > S.zip ([1, 3, 5]) ([2, 4])
  //. [Pair (1) (2), Pair (3) (4)]
  //. ```
  _.zip = {
    consts: {},
    types: [$.Array (a), $.Array (b), $.Array ($Pair (a) (b))],
    impl: zipWith (Pair)
  };

  //# zipWith :: (a -> b -> c) -> Array a -> Array b -> Array c
  //.
  //. Returns the result of combining, pairwise, the given arrays using the
  //. given binary function. The length of the resulting array is equal to the
  //. length of the shorter input array.
  //.
  //. See also [`zip`](#zip).
  //.
  //. ```javascript
  //. > S.zipWith (a => b => a + b) (['a', 'b']) (['x', 'y', 'z'])
  //. ['ax', 'by']
  //.
  //. > S.zipWith (a => b => [a, b]) ([1, 3, 5]) ([2, 4])
  //. [[1, 2], [3, 4]]
  //. ```
  function zipWith(f) {
    return function(xs) {
      return function(ys) {
        var result = [];
        var len = Math.min (xs.length, ys.length);
        for (var idx = 0; idx < len; idx += 1) {
          result.push (f (xs[idx]) (ys[idx]));
        }
        return result;
      };
    };
  }
  _.zipWith = {
    consts: {},
    types: [Fn (a) (Fn (b) (c)), $.Array (a), $.Array (b), $.Array (c)],
    impl: zipWith
  };

  //. ### Object

  //# prop :: String -> a -> b
  //.
  //. Takes a property name and an object with known properties and returns
  //. the value of the specified property. If for some reason the object
  //. lacks the specified property, a type error is thrown.
  //.
  //. For accessing properties of uncertain objects, use [`get`](#get) instead.
  //.
  //. ```javascript
  //. > S.prop ('a') ({a: 1, b: 2})
  //. 1
  //. ```
  function prop(key) {
    return function(x) {
      var obj = toObject (x);
      if (key in obj) return obj[key];
      throw new TypeError ('‘prop’ expected object to have a property named ' +
                           '‘' + key + '’; ' + show (x) + ' does not');
    };
  }
  _.prop = {
    consts: {},
    types: [$.String, a, b],
    impl: prop
  };

  //# props :: Array String -> a -> b
  //.
  //. Takes a property path (an array of property names) and an object with
  //. known structure and returns the value at the given path. If for some
  //. reason the path does not exist, a type error is thrown.
  //.
  //. For accessing property paths of uncertain objects, use [`gets`](#gets)
  //. instead.
  //.
  //. ```javascript
  //. > S.props (['a', 'b', 'c']) ({a: {b: {c: 1}}})
  //. 1
  //. ```
  function props(path) {
    return function(x) {
      return path.reduce (function(x, key) {
        var obj = toObject (x);
        if (key in obj) return obj[key];
        throw new TypeError ('‘props’ expected object to have a property at ' +
                             show (path) + '; ' + show (x) + ' does not');
      }, x);
    };
  }
  _.props = {
    consts: {},
    types: [$.Array ($.String), a, b],
    impl: props
  };

  //# get :: (Any -> Boolean) -> String -> a -> Maybe b
  //.
  //. Takes a predicate, a property name, and an object and returns Just the
  //. value of the specified object property if it exists and the value
  //. satisfies the given predicate; Nothing otherwise.
  //.
  //. See also [`gets`](#gets) and [`prop`](#prop).
  //.
  //. ```javascript
  //. > S.get (S.is ($.Number)) ('x') ({x: 1, y: 2})
  //. Just (1)
  //.
  //. > S.get (S.is ($.Number)) ('x') ({x: '1', y: '2'})
  //. Nothing
  //.
  //. > S.get (S.is ($.Number)) ('x') ({})
  //. Nothing
  //.
  //. > S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, 3]})
  //. Just ([1, 2, 3])
  //.
  //. > S.get (S.is ($.Array ($.Number))) ('x') ({x: [1, 2, 3, null]})
  //. Nothing
  //. ```
  function get(pred) {
    return B (B (filter (pred))) (get_);
  }
  _.get = {
    consts: {},
    types: [$.Predicate ($.Any), $.String, a, $Maybe (b)],
    impl: get
  };

  //# gets :: (Any -> Boolean) -> Array String -> a -> Maybe b
  //.
  //. Takes a predicate, a property path (an array of property names), and
  //. an object and returns Just the value at the given path if such a path
  //. exists and the value satisfies the given predicate; Nothing otherwise.
  //.
  //. See also [`get`](#get).
  //.
  //. ```javascript
  //. > S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({a: {b: {c: 42}}})
  //. Just (42)
  //.
  //. > S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({a: {b: {c: '42'}}})
  //. Nothing
  //.
  //. > S.gets (S.is ($.Number)) (['a', 'b', 'c']) ({})
  //. Nothing
  //. ```
  function gets(pred) {
    return function(keys) {
      return function(x) {
        return Z.filter (pred, keys.reduce (function(maybe, key) {
          return Z.chain (get_ (key), maybe);
        }, Just (x)));
      };
    };
  }
  _.gets = {
    consts: {},
    types: [$.Predicate ($.Any), $.Array ($.String), a, $Maybe (b)],
    impl: gets
  };

  //. ### StrMap
  //.
  //. StrMap is an abbreviation of _string map_. A string map is an object,
  //. such as `{foo: 1, bar: 2, baz: 3}`, whose values are all members of
  //. the same type. Formally, a value is a member of type `StrMap a` if its
  //. [type identifier][] is `'Object'` and the values of its enumerable own
  //. properties are all members of type `a`.

  //# singleton :: String -> a -> StrMap a
  //.
  //. Takes a string and a value of any type, and returns a string map with
  //. a single entry (mapping the key to the value).
  //.
  //. ```javascript
  //. > S.singleton ('foo') (42)
  //. {foo: 42}
  //. ```
  function singleton(key) {
    return function(val) {
      var strMap = {};
      strMap[key] = val;
      return strMap;
    };
  }
  _.singleton = {
    consts: {},
    types: [$.String, a, $.StrMap (a)],
    impl: singleton
  };

  //# insert :: String -> a -> StrMap a -> StrMap a
  //.
  //. Takes a string, a value of any type, and a string map, and returns a
  //. string map comprising all the entries of the given string map plus the
  //. entry specified by the first two arguments (which takes precedence).
  //.
  //. Equivalent to Haskell's `insert` function. Similar to Clojure's `assoc`
  //. function.
  //.
  //. ```javascript
  //. > S.insert ('c') (3) ({a: 1, b: 2})
  //. {a: 1, b: 2, c: 3}
  //.
  //. > S.insert ('a') (4) ({a: 1, b: 2})
  //. {a: 4, b: 2}
  //. ```
  function insert(key) {
    return function(val) {
      return function(strMap) {
        return Z.concat (strMap, singleton (key) (val));
      };
    };
  }
  _.insert = {
    consts: {},
    types: [$.String, a, $.StrMap (a), $.StrMap (a)],
    impl: insert
  };

  //# remove :: String -> StrMap a -> StrMap a
  //.
  //. Takes a string and a string map, and returns a string map comprising all
  //. the entries of the given string map except the one whose key matches the
  //. given string (if such a key exists).
  //.
  //. Equivalent to Haskell's `delete` function. Similar to Clojure's `dissoc`
  //. function.
  //.
  //. ```javascript
  //. > S.remove ('c') ({a: 1, b: 2, c: 3})
  //. {a: 1, b: 2}
  //.
  //. > S.remove ('c') ({})
  //. {}
  //. ```
  function remove(key) {
    return function(strMap) {
      var result = Z.concat (strMap, {});
      delete result[key];
      return result;
    };
  }
  _.remove = {
    consts: {},
    types: [$.String, $.StrMap (a), $.StrMap (a)],
    impl: remove
  };

  //# keys :: StrMap a -> Array String
  //.
  //. Returns the keys of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.sort (S.keys ({b: 2, c: 3, a: 1}))
  //. ['a', 'b', 'c']
  //. ```
  _.keys = {
    consts: {},
    types: [$.StrMap (a), $.Array ($.String)],
    impl: Object.keys
  };

  //# values :: StrMap a -> Array a
  //.
  //. Returns the values of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.sort (S.values ({a: 1, c: 3, b: 2}))
  //. [1, 2, 3]
  //. ```
  function values(strMap) {
    return Z.map (function(k) { return strMap[k]; }, Object.keys (strMap));
  }
  _.values = {
    consts: {},
    types: [$.StrMap (a), $.Array (a)],
    impl: values
  };

  //# pairs :: StrMap a -> Array (Pair String a)
  //.
  //. Returns the key–value pairs of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.sort (S.pairs ({b: 2, a: 1, c: 3}))
  //. [Pair ('a') (1), Pair ('b') (2), Pair ('c') (3)]
  //. ```
  function pairs(strMap) {
    return Z.map (function(k) { return Pair (k) (strMap[k]); },
                  Object.keys (strMap));
  }
  _.pairs = {
    consts: {},
    types: [$.StrMap (a), $.Array ($Pair ($.String) (a))],
    impl: pairs
  };

  //# fromPairs :: Foldable f => f (Pair String a) -> StrMap a
  //.
  //. Returns a string map containing the key–value pairs specified by the
  //. given [Foldable][]. If a key appears in multiple pairs, the rightmost
  //. pair takes precedence.
  //.
  //. ```javascript
  //. > S.fromPairs ([S.Pair ('a') (1), S.Pair ('b') (2), S.Pair ('c') (3)])
  //. {a: 1, b: 2, c: 3}
  //.
  //. > S.fromPairs ([S.Pair ('x') (1), S.Pair ('x') (2)])
  //. {x: 2}
  //. ```
  function fromPairs(pairs) {
    return Z.reduce (function(strMap, pair) {
      strMap[pair.fst] = pair.snd;
      return strMap;
    }, {}, pairs);
  }
  _.fromPairs = {
    consts: {f: [Z.Foldable]},
    types: [f ($Pair ($.String) (a)), $.StrMap (a)],
    impl: fromPairs
  };

  //. ### Number

  //# negate :: ValidNumber -> ValidNumber
  //.
  //. Negates its argument.
  //.
  //. ```javascript
  //. > S.negate (12.5)
  //. -12.5
  //.
  //. > S.negate (-42)
  //. 42
  //. ```
  function negate(n) {
    return -n;
  }
  _.negate = {
    consts: {},
    types: [$.ValidNumber, $.ValidNumber],
    impl: negate
  };

  //# add :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the sum of two (finite) numbers.
  //.
  //. ```javascript
  //. > S.add (1) (1)
  //. 2
  //. ```
  function add(x) {
    return function(y) {
      return x + y;
    };
  }
  _.add = {
    consts: {},
    types: [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    impl: add
  };

  //# sum :: Foldable f => f FiniteNumber -> FiniteNumber
  //.
  //. Returns the sum of the given array of (finite) numbers.
  //.
  //. ```javascript
  //. > S.sum ([1, 2, 3, 4, 5])
  //. 15
  //.
  //. > S.sum ([])
  //. 0
  //.
  //. > S.sum (S.Just (42))
  //. 42
  //.
  //. > S.sum (S.Nothing)
  //. 0
  //. ```
  _.sum = {
    consts: {f: [Z.Foldable]},
    types: [f ($.FiniteNumber), $.FiniteNumber],
    impl: reduce (add) (0)
  };

  //# sub :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Takes a finite number `n` and returns the _subtract `n`_ function.
  //.
  //. ```javascript
  //. > S.map (S.sub (1)) ([1, 2, 3])
  //. [0, 1, 2]
  //. ```
  function sub(y) {
    return function(x) {
      return x - y;
    };
  }
  _.sub = {
    consts: {},
    types: [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    impl: sub
  };

  //# mult :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the product of two (finite) numbers.
  //.
  //. ```javascript
  //. > S.mult (4) (2)
  //. 8
  //. ```
  function mult(x) {
    return function(y) {
      return x * y;
    };
  }
  _.mult = {
    consts: {},
    types: [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    impl: mult
  };

  //# product :: Foldable f => f FiniteNumber -> FiniteNumber
  //.
  //. Returns the product of the given array of (finite) numbers.
  //.
  //. ```javascript
  //. > S.product ([1, 2, 3, 4, 5])
  //. 120
  //.
  //. > S.product ([])
  //. 1
  //.
  //. > S.product (S.Just (42))
  //. 42
  //.
  //. > S.product (S.Nothing)
  //. 1
  //. ```
  _.product = {
    consts: {f: [Z.Foldable]},
    types: [f ($.FiniteNumber), $.FiniteNumber],
    impl: reduce (mult) (1)
  };

  //# div :: NonZeroFiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Takes a non-zero finite number `n` and returns the _divide by `n`_
  //. function.
  //.
  //. ```javascript
  //. > S.map (S.div (2)) ([0, 1, 2, 3])
  //. [0, 0.5, 1, 1.5]
  //. ```
  function div(y) {
    return function(x) {
      return x / y;
    };
  }
  _.div = {
    consts: {},
    types: [$.NonZeroFiniteNumber, $.FiniteNumber, $.FiniteNumber],
    impl: div
  };

  //# pow :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Takes a finite number `n` and returns the _power of `n`_ function.
  //.
  //. ```javascript
  //. > S.map (S.pow (2)) ([-3, -2, -1, 0, 1, 2, 3])
  //. [9, 4, 1, 0, 1, 4, 9]
  //.
  //. > S.map (S.pow (0.5)) ([1, 4, 9, 16, 25])
  //. [1, 2, 3, 4, 5]
  //. ```
  function pow(exp) {
    return function(base) {
      return Math.pow (base, exp);
    };
  }
  _.pow = {
    consts: {},
    types: [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
    impl: pow
  };

  //# mean :: Foldable f => f FiniteNumber -> Maybe FiniteNumber
  //.
  //. Returns the mean of the given array of (finite) numbers.
  //.
  //. ```javascript
  //. > S.mean ([1, 2, 3, 4, 5])
  //. Just (3)
  //.
  //. > S.mean ([])
  //. Nothing
  //.
  //. > S.mean (S.Just (42))
  //. Just (42)
  //.
  //. > S.mean (S.Nothing)
  //. Nothing
  //. ```
  function mean(foldable) {
    var result = Z.reduce (
      function(acc, n) {
        acc.total += n;
        acc.count += 1;
        return acc;
      },
      {total: 0, count: 0},
      foldable
    );
    return result.count > 0 ? Just (result.total / result.count) : Nothing;
  }
  _.mean = {
    consts: {f: [Z.Foldable]},
    types: [f ($.FiniteNumber), $Maybe ($.FiniteNumber)],
    impl: mean
  };

  //. ### Integer

  //# even :: Integer -> Boolean
  //.
  //. Returns `true` if the given integer is even; `false` if it is odd.
  //.
  //. ```javascript
  //. > S.even (42)
  //. true
  //.
  //. > S.even (99)
  //. false
  //. ```
  function even(n) {
    return n % 2 === 0;
  }
  _.even = {
    consts: {},
    types: [$.Integer, $.Boolean],
    impl: even
  };

  //# odd :: Integer -> Boolean
  //.
  //. Returns `true` if the given integer is odd; `false` if it is even.
  //.
  //. ```javascript
  //. > S.odd (99)
  //. true
  //.
  //. > S.odd (42)
  //. false
  //. ```
  function odd(n) {
    return n % 2 !== 0;
  }
  _.odd = {
    consts: {},
    types: [$.Integer, $.Boolean],
    impl: odd
  };

  //. ### Parse

  //# parseDate :: String -> Maybe ValidDate
  //.
  //. Takes a string and returns Just the date represented by the string
  //. if it does in fact represent a date; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseDate ('2011-01-19T17:40:00Z')
  //. Just (new Date ('2011-01-19T17:40:00.000Z'))
  //.
  //. > S.parseDate ('today')
  //. Nothing
  //. ```
  function parseDate(s) {
    var date = new Date (s);
    return isNaN (date.valueOf ()) ? Nothing : Just (date);
  }
  _.parseDate = {
    consts: {},
    types: [$.String, $Maybe ($.ValidDate)],
    impl: parseDate
  };

  //  requiredNonCapturingGroup :: Array String -> String
  function requiredNonCapturingGroup(xs) {
    return '(?:' + xs.join ('|') + ')';
  }

  //  optionalNonCapturingGroup :: Array String -> String
  function optionalNonCapturingGroup(xs) {
    return requiredNonCapturingGroup (xs) + '?';
  }

  //  validFloatRepr :: RegExp
  var validFloatRepr = new RegExp (
    '^' +                     // start-of-string anchor
    '\\s*' +                  // any number of leading whitespace characters
    '[+-]?' +                 // optional sign
    requiredNonCapturingGroup ([
      'Infinity',             // "Infinity"
      'NaN',                  // "NaN"
      requiredNonCapturingGroup ([
        '[0-9]+',             // number
        '[0-9]+[.][0-9]+',    // number with interior decimal point
        '[0-9]+[.]',          // number with trailing decimal point
        '[.][0-9]+'           // number with leading decimal point
      ]) +
      optionalNonCapturingGroup ([
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
  //. > S.parseFloat ('-123.45')
  //. Just (-123.45)
  //.
  //. > S.parseFloat ('foo.bar')
  //. Nothing
  //. ```
  function parseFloat_(s) {
    return validFloatRepr.test (s) ? Just (parseFloat (s)) : Nothing;
  }
  _.parseFloat = {
    consts: {},
    types: [$.String, $Maybe ($.Number)],
    impl: parseFloat_
  };

  //  Radix :: Type
  var Radix = $.NullaryType
    ('sanctuary/Radix')
    ('')
    (function(x) { return $.Integer._test (x) && x >= 2 && x <= 36; });

  //# parseInt :: Radix -> String -> Maybe Integer
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
  //. > S.parseInt (10) ('-42')
  //. Just (-42)
  //.
  //. > S.parseInt (16) ('0xFF')
  //. Just (255)
  //.
  //. > S.parseInt (16) ('0xGG')
  //. Nothing
  //. ```
  function parseInt_(radix) {
    return function(s) {
      var charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice (0, radix);
      var pattern = new RegExp ('^[' + charset + ']+$', 'i');

      var t = s.replace (/^[+-]/, '');
      if (pattern.test (radix === 16 ? t.replace (/^0x/i, '') : t)) {
        var n = parseInt (s, radix);
        if ($.Integer._test (n)) return Just (n);
      }
      return Nothing;
    };
  }
  _.parseInt = {
    consts: {},
    types: [Radix, $.String, $Maybe ($.Integer)],
    impl: parseInt_
  };

  //# parseJson :: (Any -> Boolean) -> String -> Maybe a
  //.
  //. Takes a predicate and a string which may or may not be valid JSON, and
  //. returns Just the result of applying `JSON.parse` to the string *if* the
  //. result satisfies the predicate; Nothing otherwise.
  //.
  //. ```javascript
  //. > S.parseJson (S.is ($.Array ($.Integer))) ('[')
  //. Nothing
  //.
  //. > S.parseJson (S.is ($.Array ($.Integer))) ('["1","2","3"]')
  //. Nothing
  //.
  //. > S.parseJson (S.is ($.Array ($.Integer))) ('[0,1.5,3,4.5]')
  //. Nothing
  //.
  //. > S.parseJson (S.is ($.Array ($.Integer))) ('[1,2,3]')
  //. Just ([1, 2, 3])
  //. ```
  function parseJson(pred) {
    return B (filter (pred)) (encase (JSON.parse));
  }
  _.parseJson = {
    consts: {},
    types: [$.Predicate ($.Any), $.String, $Maybe (a)],
    impl: parseJson
  };

  //. ### RegExp

  //  Match :: Type
  var Match = $.RecordType ({
    match: $.String,
    groups: $.Array ($Maybe ($.String))
  });

  //  toMatch :: Array String? -> Match
  function toMatch(ss) {
    return {match: ss[0], groups: Z.map (toMaybe, ss.slice (1))};
  }

  //  withRegex :: (RegExp, () -> a) -> a
  function withRegex(pattern, thunk) {
    var lastIndex = pattern.lastIndex;
    var result = thunk ();
    pattern.lastIndex = lastIndex;
    return result;
  }

  //# regex :: RegexFlags -> String -> RegExp
  //.
  //. Takes a [RegexFlags][] and a pattern, and returns a RegExp.
  //.
  //. ```javascript
  //. > S.regex ('g') (':\\d+:')
  //. /:\d+:/g
  //. ```
  function regex(flags) {
    return function(source) {
      return new RegExp (source, flags);
    };
  }
  _.regex = {
    consts: {},
    types: [$.RegexFlags, $.String, $.RegExp],
    impl: regex
  };

  //# regexEscape :: String -> String
  //.
  //. Takes a string which may contain regular expression metacharacters,
  //. and returns a string with those metacharacters escaped.
  //.
  //. Properties:
  //.
  //.   - `forall s :: String.
  //.      S.test (S.regex ('') (S.regexEscape (s))) (s) = true`
  //.
  //. ```javascript
  //. > S.regexEscape ('-=*{XYZ}*=-')
  //. '\\-=\\*\\{XYZ\\}\\*=\\-'
  //. ```
  function regexEscape(s) {
    return s.replace (/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  _.regexEscape = {
    consts: {},
    types: [$.String, $.String],
    impl: regexEscape
  };

  //# test :: RegExp -> String -> Boolean
  //.
  //. Takes a pattern and a string, and returns `true` [iff][] the pattern
  //. matches the string.
  //.
  //. ```javascript
  //. > S.test (/^a/) ('abacus')
  //. true
  //.
  //. > S.test (/^a/) ('banana')
  //. false
  //. ```
  function test(pattern) {
    return function(s) {
      return withRegex (pattern, function() { return pattern.test (s); });
    };
  }
  _.test = {
    consts: {},
    types: [$.RegExp, $.String, $.Boolean],
    impl: test
  };

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
  //.      S.head (S.matchAll (S.regex ('g') (p)) (s))
  //.      = S.match (S.regex ('') (p)) (s)`
  //.
  //. See also [`matchAll`](#matchAll).
  //.
  //. ```javascript
  //. > S.match (/(good)?bye/) ('goodbye')
  //. Just ({match: 'goodbye', groups: [Just ('good')]})
  //.
  //. > S.match (/(good)?bye/) ('bye')
  //. Just ({match: 'bye', groups: [Nothing]})
  //. ```
  function match(pattern) {
    return function(s) {
      return Z.map (toMatch, toMaybe (s.match (pattern)));
    };
  }
  _.match = {
    consts: {},
    types: [$.NonGlobalRegExp, $.String, $Maybe (Match)],
    impl: match
  };

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
  //. > S.matchAll (/@([a-z]+)/g) ('Hello, world!')
  //. []
  //.
  //. > S.matchAll (/@([a-z]+)/g) ('Hello, @foo! Hello, @bar! Hello, @baz!')
  //. [ {match: '@foo', groups: [Just ('foo')]},
  //. . {match: '@bar', groups: [Just ('bar')]},
  //. . {match: '@baz', groups: [Just ('baz')]} ]
  //. ```
  function matchAll(pattern) {
    return function(s) {
      return withRegex (pattern, function() {
        return unfoldr (function(_) {
          return Z.map (function(ss) {
            return Pair (toMatch (ss)) (null);
          }, toMaybe (pattern.exec (s)));
        }) ([]);
      });
    };
  }
  _.matchAll = {
    consts: {},
    types: [$.GlobalRegExp, $.String, $.Array (Match)],
    impl: matchAll
  };

  //. ### String

  //# toUpper :: String -> String
  //.
  //. Returns the upper-case equivalent of its argument.
  //.
  //. See also [`toLower`](#toLower).
  //.
  //. ```javascript
  //. > S.toUpper ('ABC def 123')
  //. 'ABC DEF 123'
  //. ```
  _.toUpper = {
    consts: {},
    types: [$.String, $.String],
    impl: invoke0 ('toUpperCase')
  };

  //# toLower :: String -> String
  //.
  //. Returns the lower-case equivalent of its argument.
  //.
  //. See also [`toUpper`](#toUpper).
  //.
  //. ```javascript
  //. > S.toLower ('ABC def 123')
  //. 'abc def 123'
  //. ```
  _.toLower = {
    consts: {},
    types: [$.String, $.String],
    impl: invoke0 ('toLowerCase')
  };

  //# trim :: String -> String
  //.
  //. Strips leading and trailing whitespace characters.
  //.
  //. ```javascript
  //. > S.trim ('\t\t foo bar \n')
  //. 'foo bar'
  //. ```
  _.trim = {
    consts: {},
    types: [$.String, $.String],
    impl: invoke0 ('trim')
  };

  //# stripPrefix :: String -> String -> Maybe String
  //.
  //. Returns Just the portion of the given string (the second argument) left
  //. after removing the given prefix (the first argument) if the string starts
  //. with the prefix; Nothing otherwise.
  //.
  //. See also [`stripSuffix`](#stripSuffix).
  //.
  //. ```javascript
  //. > S.stripPrefix ('https://') ('https://sanctuary.js.org')
  //. Just ('sanctuary.js.org')
  //.
  //. > S.stripPrefix ('https://') ('http://sanctuary.js.org')
  //. Nothing
  //. ```
  function stripPrefix(prefix) {
    return function(s) {
      var idx = prefix.length;
      return s.slice (0, idx) === prefix ? Just (s.slice (idx)) : Nothing;
    };
  }
  _.stripPrefix = {
    consts: {},
    types: [$.String, $.String, $Maybe ($.String)],
    impl: stripPrefix
  };

  //# stripSuffix :: String -> String -> Maybe String
  //.
  //. Returns Just the portion of the given string (the second argument) left
  //. after removing the given suffix (the first argument) if the string ends
  //. with the suffix; Nothing otherwise.
  //.
  //. See also [`stripPrefix`](#stripPrefix).
  //.
  //. ```javascript
  //. > S.stripSuffix ('.md') ('README.md')
  //. Just ('README')
  //.
  //. > S.stripSuffix ('.md') ('README')
  //. Nothing
  //. ```
  function stripSuffix(suffix) {
    return function(s) {
      var idx = s.length - suffix.length;  // value may be negative
      return s.slice (idx) === suffix ? Just (s.slice (0, idx)) : Nothing;
    };
  }
  _.stripSuffix = {
    consts: {},
    types: [$.String, $.String, $Maybe ($.String)],
    impl: stripSuffix
  };

  //# words :: String -> Array String
  //.
  //. Takes a string and returns the array of words the string contains
  //. (words are delimited by whitespace characters).
  //.
  //. See also [`unwords`](#unwords).
  //.
  //. ```javascript
  //. > S.words (' foo bar baz ')
  //. ['foo', 'bar', 'baz']
  //. ```
  function words(s) {
    var words = s.split (/\s+/);
    var len = words.length;
    return words.slice (words[0] === '' ? 1 : 0,
                        words[len - 1] === '' ? len - 1 : len);
  }
  _.words = {
    consts: {},
    types: [$.String, $.Array ($.String)],
    impl: words
  };

  //# unwords :: Array String -> String
  //.
  //. Takes an array of words and returns the result of joining the words
  //. with separating spaces.
  //.
  //. See also [`words`](#words).
  //.
  //. ```javascript
  //. > S.unwords (['foo', 'bar', 'baz'])
  //. 'foo bar baz'
  //. ```
  _.unwords = {
    consts: {},
    types: [$.Array ($.String), $.String],
    impl: invoke1 ('join') (' ')
  };

  //# lines :: String -> Array String
  //.
  //. Takes a string and returns the array of lines the string contains
  //. (lines are delimited by newlines: `'\n'` or `'\r\n'` or `'\r'`).
  //. The resulting strings do not contain newlines.
  //.
  //. See also [`unlines`](#unlines).
  //.
  //. ```javascript
  //. > S.lines ('foo\nbar\nbaz\n')
  //. ['foo', 'bar', 'baz']
  //. ```
  function lines(s) {
    return s === '' ? []
                    : (s.replace (/\r\n?/g, '\n')).match (/^(?=[\s\S]).*/gm);
  }
  _.lines = {
    consts: {},
    types: [$.String, $.Array ($.String)],
    impl: lines
  };

  //# unlines :: Array String -> String
  //.
  //. Takes an array of lines and returns the result of joining the lines
  //. after appending a terminating line feed (`'\n'`) to each.
  //.
  //. See also [`lines`](#lines).
  //.
  //. ```javascript
  //. > S.unlines (['foo', 'bar', 'baz'])
  //. 'foo\nbar\nbaz\n'
  //. ```
  function unlines(xs) {
    return xs.reduce (function(s, x) { return s + x + '\n'; }, '');
  }
  _.unlines = {
    consts: {},
    types: [$.Array ($.String), $.String],
    impl: unlines
  };

  //# splitOn :: String -> String -> Array String
  //.
  //. Returns the substrings of its second argument separated by occurrences
  //. of its first argument.
  //.
  //. See also [`joinWith`](#joinWith) and [`splitOnRegex`](#splitOnRegex).
  //.
  //. ```javascript
  //. > S.splitOn ('::') ('foo::bar::baz')
  //. ['foo', 'bar', 'baz']
  //. ```
  _.splitOn = {
    consts: {},
    types: [$.String, $.String, $.Array ($.String)],
    impl: invoke1 ('split')
  };

  //# splitOnRegex :: GlobalRegExp -> String -> Array String
  //.
  //. Takes a pattern and a string, and returns the result of splitting the
  //. string at every non-overlapping occurrence of the pattern.
  //.
  //. Properties:
  //.
  //.   - `forall s :: String, t :: String.
  //.      S.joinWith (s)
  //.                 (S.splitOnRegex (S.regex ('g') (S.regexEscape (s))) (t))
  //.      = t`
  //.
  //. See also [`splitOn`](#splitOn).
  //.
  //. ```javascript
  //. > S.splitOnRegex (/[,;][ ]*/g) ('foo, bar, baz')
  //. ['foo', 'bar', 'baz']
  //.
  //. > S.splitOnRegex (/[,;][ ]*/g) ('foo;bar;baz')
  //. ['foo', 'bar', 'baz']
  //. ```
  function splitOnRegex(pattern) {
    return function(s) {
      return withRegex (pattern, function() {
        var result = [];
        var lastIndex = 0;
        var match;
        while ((match = pattern.exec (s)) != null) {
          if (pattern.lastIndex === lastIndex && match[0] === '') {
            if (pattern.lastIndex === s.length) return result;
            pattern.lastIndex += 1;
          } else {
            result.push (s.slice (lastIndex, match.index));
            lastIndex = match.index + match[0].length;
          }
        }
        result.push (s.slice (lastIndex));
        return result;
      });
    };
  }
  _.splitOnRegex = {
    consts: {},
    types: [$.GlobalRegExp, $.String, $.Array ($.String)],
    impl: splitOnRegex
  };

  return create ({
    checkTypes: (
      /* global process:false */
      typeof process === 'undefined'
      || process == null
      || process.env == null
      || process.env.NODE_ENV !== 'production'
    ),
    env: Z.concat ($.env, [
      $.FiniteNumber,
      $.NonZeroFiniteNumber,
      $Either ($.Unknown) ($.Unknown),
      Fn ($.Unknown) ($.Unknown),
      $.GlobalRegExp,
      $.NonGlobalRegExp,
      $.Integer,
      $.NonNegativeInteger,
      $Maybe ($.Unknown),
      $.Array2 ($.Unknown) ($.Unknown),
      $Pair ($.Unknown) ($.Unknown),
      $.RegexFlags,
      $.Type,
      $.TypeClass,
      $.ValidDate,
      $.ValidNumber
    ])
  });

}));

//. [Apply]:                v:fantasyland/fantasy-land#apply
//. [BinaryType]:           v:sanctuary-js/sanctuary-def#BinaryType
//. [Chain]:                v:fantasyland/fantasy-land#chain
//. [Either]:               #either-type
//. [Fantasy Land]:         v:fantasyland/fantasy-land
//. [Foldable]:             v:fantasyland/fantasy-land#foldable
//. [Haskell]:              https://www.haskell.org/
//. [Kleisli]:              https://en.wikipedia.org/wiki/Kleisli_category
//. [Maybe]:                #maybe-type
//. [Nullable]:             v:sanctuary-js/sanctuary-def#Nullable
//. [PureScript]:           http://www.purescript.org/
//. [Ramda]:                http://ramdajs.com/
//. [RegexFlags]:           v:sanctuary-js/sanctuary-def#RegexFlags
//. [Semigroupoid]:         v:fantasyland/fantasy-land#semigroupoid
//. [UnaryType]:            v:sanctuary-js/sanctuary-def#UnaryType
//. [`$.test`]:             v:sanctuary-js/sanctuary-def#test
//. [`Z.alt`]:              v:sanctuary-js/sanctuary-type-classes#alt
//. [`Z.ap`]:               v:sanctuary-js/sanctuary-type-classes#ap
//. [`Z.apFirst`]:          v:sanctuary-js/sanctuary-type-classes#apFirst
//. [`Z.apSecond`]:         v:sanctuary-js/sanctuary-type-classes#apSecond
//. [`Z.bimap`]:            v:sanctuary-js/sanctuary-type-classes#bimap
//. [`Z.chain`]:            v:sanctuary-js/sanctuary-type-classes#chain
//. [`Z.chainRec`]:         v:sanctuary-js/sanctuary-type-classes#chainRec
//. [`Z.compose`]:          v:sanctuary-js/sanctuary-type-classes#compose
//. [`Z.concat`]:           v:sanctuary-js/sanctuary-type-classes#concat
//. [`Z.contramap`]:        v:sanctuary-js/sanctuary-type-classes#contramap
//. [`Z.dropWhile`]:        v:sanctuary-js/sanctuary-type-classes#dropWhile
//. [`Z.duplicate`]:        v:sanctuary-js/sanctuary-type-classes#duplicate
//. [`Z.empty`]:            v:sanctuary-js/sanctuary-type-classes#empty
//. [`Z.equals`]:           v:sanctuary-js/sanctuary-type-classes#equals
//. [`Z.extend`]:           v:sanctuary-js/sanctuary-type-classes#extend
//. [`Z.extract`]:          v:sanctuary-js/sanctuary-type-classes#extract
//. [`Z.filter`]:           v:sanctuary-js/sanctuary-type-classes#filter
//. [`Z.flip`]:             v:sanctuary-js/sanctuary-type-classes#flip
//. [`Z.foldMap`]:          v:sanctuary-js/sanctuary-type-classes#foldMap
//. [`Z.gt`]:               v:sanctuary-js/sanctuary-type-classes#gt
//. [`Z.gte`]:              v:sanctuary-js/sanctuary-type-classes#gte
//. [`Z.id`]:               v:sanctuary-js/sanctuary-type-classes#id
//. [`Z.invert`]:           v:sanctuary-js/sanctuary-type-classes#invert
//. [`Z.join`]:             v:sanctuary-js/sanctuary-type-classes#join
//. [`Z.lt`]:               v:sanctuary-js/sanctuary-type-classes#lt
//. [`Z.lte`]:              v:sanctuary-js/sanctuary-type-classes#lte
//. [`Z.map`]:              v:sanctuary-js/sanctuary-type-classes#map
//. [`Z.mapLeft`]:          v:sanctuary-js/sanctuary-type-classes#mapLeft
//. [`Z.of`]:               v:sanctuary-js/sanctuary-type-classes#of
//. [`Z.promap`]:           v:sanctuary-js/sanctuary-type-classes#promap
//. [`Z.reject`]:           v:sanctuary-js/sanctuary-type-classes#reject
//. [`Z.sequence`]:         v:sanctuary-js/sanctuary-type-classes#sequence
//. [`Z.takeWhile`]:        v:sanctuary-js/sanctuary-type-classes#takeWhile
//. [`Z.traverse`]:         v:sanctuary-js/sanctuary-type-classes#traverse
//. [`Z.zero`]:             v:sanctuary-js/sanctuary-type-classes#zero
//. [`show`]:               v:sanctuary-js/sanctuary-show#show
//. [equivalence]:          https://en.wikipedia.org/wiki/Equivalence_relation
//. [iff]:                  https://en.wikipedia.org/wiki/If_and_only_if
//. [parseInt]:             https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
//. [sanctuary-def]:        v:sanctuary-js/sanctuary-def
//. [sanctuary-either]:     v:sanctuary-js/sanctuary-either
//. [sanctuary-maybe]:      v:sanctuary-js/sanctuary-maybe
//. [sanctuary-pair]:       v:sanctuary-js/sanctuary-pair
//. [stable sort]:          https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
//. [thrush]:               https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
//. [type identifier]:      v:sanctuary-js/sanctuary-type-identifiers
//. [type representative]:  v:fantasyland/fantasy-land#type-representatives
