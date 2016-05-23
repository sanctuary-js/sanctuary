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
//. There are actually two versions of the Sanctuary module: one with type
//. checking; one without. The latter is accessible via the `unchecked`
//. property of the former.
//.
//. When application of `S.unchecked.<name>` honours the function's type
//. signature the result will be the same as if `S.<name>` had been used
//. instead. Otherwise, the behaviour is unspecified.
//.
//. In Node, one could use an environment variable to determine which version
//. of the Sanctuary module to use:
//.
//. ```javascript
//. const S = process.env.NODE_ENV === 'production' ?
//.             require('sanctuary').unchecked :
//.             require('sanctuary');
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

  var _ = R.__;

  var sentinel = {};

  //  _type :: a -> String
  var _type = function(x) {
    return x != null && R.type(x['@@type']) === 'String' ? x['@@type']
                                                         : R.type(x);
  };

  //  compose2 :: ((b -> c), (a -> b)) -> a -> c
  var compose2 = function(f, g) {
    return function(x) {
      return f(g(x));
    };
  };

  //  compose3 :: ((b -> c), (a -> b), a) -> c
  var compose3 = function(f, g, x) {
    return f(g(x));
  };

  //  filter :: (Monad m, Monoid m) => ((a -> Boolean), m a) -> m a
  var filter = function(pred, m) {
    return m.chain(function(x) {
      return pred(x) ? m.of(x) : m.empty();
    });
  };

  //  hasMethod :: String -> Any -> Boolean
  var hasMethod = function(name) {
    return function(x) {
      return x != null && typeof x[name] === 'function';
    };
  };

  //  inspect :: -> String
  var inspect = /* istanbul ignore next */ function() {
    return this.toString();
  };

  //  negativeZero :: a -> Boolean
  var negativeZero = R.either(R.equals(-0), R.equals(new Number(-0)));

  //  Accessible :: TypeClass
  var Accessible = $.TypeClass(
    'sanctuary/Accessible',
    function(x) { return x != null; }
  );

  //  Applicative :: TypeClass
  var Applicative = $.TypeClass(
    'sanctuary/Applicative',
    function(x) {
      return _type(x) === 'Array' ||
             Apply._test(x) && (hasMethod('of')(x) ||
                                hasMethod('of')(x.constructor));
    }
  );

  //  Apply :: TypeClass
  var Apply = $.TypeClass(
    'sanctuary/Apply',
    function(x) {
      return R.contains(_type(x), ['Array', 'Function']) ||
             Functor._test(x) && hasMethod('ap')(x);
    }
  );

  //  Foldable :: TypeClass
  var Foldable = $.TypeClass(
    'sanctuary/Foldable',
    function(x) {
      return _type(x) === 'Array' || hasMethod('reduce')(x);
    }
  );

  //  Functor :: TypeClass
  var Functor = $.TypeClass(
    'sanctuary/Functor',
    function(x) {
      return R.contains(_type(x), ['Array', 'Function']) ||
             hasMethod('map')(x);
    }
  );

  //  Monoid :: TypeClass
  var Monoid = $.TypeClass(
    'sanctuary/Monoid',
    function(x) {
      return R.contains(_type(x), ['Array', 'Boolean', 'Object', 'String']) ||
             hasMethod('empty')(x);
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
      return x != null &&
             R.type(x) !== 'Function' &&
             $.Integer._test(x.length) &&
             x.length >= 0;
    },
    function(list) {
      return list.length > 0 && R.type(list) !== 'String' ? [list[0]] : [];
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

  //  env :: Array Type
  var env = $.env.concat([
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

  //  createSanctuary :: Boolean -> Module
  var createSanctuary = function(checkTypes) {

  /* eslint-disable indent */

  var S = {EitherType: $Either, MaybeType: $Maybe};

  var def = $.create({checkTypes: checkTypes, env: env});

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
               function() { return R.apply(f, R.prepend(this, arguments)); });
  };

  //  prop :: Accessible a => String -> a -> b
  var prop =
  def('prop',
      {a: [Accessible]},
      [$.String, a, b],
      function(key, obj) {
        var boxed = Object(obj);
        if (key in boxed) {
          return boxed[key];
        } else {
          throw new TypeError('‘prop’ expected object to have a property ' +
                              'named ‘' + key + '’; ' +
                              R.toString(obj) + ' does not');
        }
      });

  //. ### Classify

  //# type :: a -> String
  //.
  //. Takes a value, `x`, of any type and returns its type identifier. If
  //. `x` has a `'@@type'` property whose value is a string, `x['@@type']`
  //. is the type identifier. Otherwise, the type identifier is the result
  //. of applying [`R.type`][R.type] to `x`.
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
  S.type =
  def('type',
      {},
      [$.Any, $.String],
      _type);

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
  var is = S.is =
  def('is',
      {},
      [TypeRep, $.Any, $.Boolean],
      function(type, x) {
        return x != null && (
          R.type(type.prototype['@@type']) === 'String' ?
            x['@@type'] === type.prototype['@@type'] :
            R.type(x) === R.nth(1, R.match(/function (\w*)/, String(type)))
        );
      });

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
  var I = S.I =
  def('I',
      {},
      [a, a],
      function(x) { return x; });

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
  S.K =
  def('K',
      {},
      [a, b, a],
      function(x, y) { return x; });

  //# A :: (a -> b) -> a -> b
  //.
  //. The A combinator. Takes a function and a value, and returns the result
  //. of applying the function to the value. Equivalent to Haskell's `($)`
  //. function.
  //.
  //. ```javascript
  //. > S.A(S.inc, 1)
  //. 2
  //.
  //. > R.map(S.A(R.__, 100), [S.inc, Math.sqrt])
  //. [101, 10]
  //. ```
  S.A =
  def('A',
      {},
      [$.Function, a, b],
      function(f, x) { return f(x); });

  //# C :: (a -> b -> c) -> b -> a -> c
  //.
  //. The C combinator. Takes a curried binary function and two values, and
  //. returns the result of applying the function to the values in reverse.
  //. Equivalent to Haskell's `flip` function.
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
  S.C =
  def('C',
      {},
      [$.Function, b, a, c],
      function(f, x, y) { return f(y)(x); });

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
  S.B =
  def('B',
      {},
      [$.Function, $.Function, a, c],
      compose3);

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
  S.S =
  def('S',
      {},
      [$.Function, $.Function, a, c],
      function(f, g, x) { return f(x)(g(x)); });

  //. ### Function

  //# flip :: ((a, b) -> c) -> b -> a -> c
  //.
  //. Takes a binary function and two values and returns the result of
  //. applying the function - with its argument order reversed - to the
  //. values. `flip` may also be applied to a Ramda-style curried
  //. function with arity greater than two.
  //.
  //. See also [`C`](#C).
  //.
  //. ```javascript
  //. > R.map(S.flip(Math.pow)(2), [1, 2, 3, 4, 5])
  //. [1, 4, 9, 16, 25]
  //. ```
  S.flip =
  def('flip',
      {},
      [$.Function, b, a, c],
      function(f, x, y) { return f(y, x); });

  //# lift :: Functor f => (a -> b) -> f a -> f b
  //.
  //. Promotes a unary function to a function which operates on a [Functor][].
  //.
  //. ```javascript
  //. > S.lift(S.inc, S.Just(2))
  //. Just(3)
  //.
  //. > S.lift(S.inc, S.Nothing())
  //. Nothing()
  //. ```
  S.lift =
  def('lift',
      {a: [Functor], b: [Functor]},
      [$.Function, a, b],
      R.map);

  //# lift2 :: Apply f => (a -> b -> c) -> f a -> f b -> f c
  //.
  //. Promotes a binary function to a function which operates on two
  //. [Apply][]s.
  //.
  //. ```javascript
  //. > S.lift2(S.add, S.Just(2), S.Just(3))
  //. Just(5)
  //.
  //. > S.lift2(S.add, S.Just(2), S.Nothing())
  //. Nothing()
  //.
  //. > S.lift2(S.and, S.Just(true), S.Just(true))
  //. Just(true)
  //.
  //. > S.lift2(S.and, S.Just(true), S.Just(false))
  //. Just(false)
  //. ```
  S.lift2 =
  def('lift2',
      {a: [Apply], b: [Apply], c: [Apply]},
      [$.Function, a, b, c],
      function(f, x, y) { return R.ap(R.map(f, x), y); });

  //# lift3 :: Apply f => (a -> b -> c -> d) -> f a -> f b -> f c -> f d
  //.
  //. Promotes a ternary function to a function which operates on three
  //. [Apply][]s.
  //.
  //. ```javascript
  //. > S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Just([1, 2, 3]))
  //. Just(6)
  //.
  //. > S.lift3(S.reduce, S.Just(S.add), S.Just(0), S.Nothing())
  //. Nothing()
  //. ```
  S.lift3 =
  def('lift3',
      {a: [Apply], b: [Apply], c: [Apply], d: [Apply]},
      [$.Function, a, b, c, d],
      function(f, x, y, z) { return R.ap(R.ap(R.map(f, x), y), z); });

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
  var compose = S.compose =
  def('compose',
      {},
      [$.Function, $.Function, a, c],
      compose3);

  //# pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n
  //.
  //. Takes an array of functions assumed to be unary and a value of any type,
  //. and returns the result of applying the sequence of transformations to
  //. the initial value.
  //.
  //. In general terms, `pipe` performs left-to-right composition of an array
  //. of functions. `pipe([f, g, h], x)` is equivalent to `h(g(f(x)))`.
  //.
  //. See also [`meld`](#meld).
  //.
  //. ```javascript
  //. > S.pipe([S.inc, Math.sqrt, S.dec])(99)
  //. 9
  //. ```
  S.pipe =
  def('pipe',
      {},
      [$.Array($.Function), a, b],
      function(fs, x) { return R.reduceRight(compose2, I, fs)(x); });

  //# meld :: [** -> *] -> (* -> * -> ... -> *)
  //.
  //. Takes an array of non-nullary functions and returns a curried function
  //. whose arity is one greater than the sum of the arities of the given
  //. functions less the number of functions.
  //.
  //. The behaviour of `meld` is best conveyed diagrammatically. The following
  //. diagram depicts the "melding" of binary functions `f` and `g`:
  //.
  //.               +-------+
  //.     --- a --->|       |
  //.               |   f   |                +-------+
  //.     --- b --->|       |--- f(a, b) --->|       |
  //.               +-------+                |   g   |
  //.     --- c ---------------------------->|       |--- g(f(a, b), c) --->
  //.                                        +-------+
  //.
  //. See also [`pipe`](#pipe).
  //.
  //. ```javascript
  //. > S.meld([Math.pow, S.sub])(3, 4, 5)
  //. 76
  //.
  //. > S.meld([Math.pow, S.sub])(3)(4)(5)
  //. 76
  //. ```
  S.meld =
  def('meld',
      {},
      [$.Array($.Function), $.Function],
      function(fs) {
        var n = 1 + sum(R.map(R.length, fs)) - fs.length;
        return R.curryN(n, function() {
          var args = Array.prototype.slice.call(arguments);
          for (var idx = 0; idx < fs.length; idx += 1) {
            args.unshift(fs[idx].apply(this, args.splice(0, fs[idx].length)));
          }
          return args[0];
        });
      });

  //. ### Maybe type
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either a Just whose value is of type `a` or a Nothing (with no value).
  //.
  //. The Maybe type satisfies the [Monoid][], [Monad][], [Traversable][],
  //. and [Extend][] specifications.

  //# MaybeType :: Type -> Type
  //.
  //. A [`UnaryType`][UnaryType] for use with [sanctuary-def][].

  //# Maybe :: TypeRep Maybe
  //.
  //. The [type representative](#type-representatives) for the Maybe type.
  var Maybe = S.Maybe = function Maybe() {
    if (arguments[0] !== sentinel) {
      throw new Error('Cannot instantiate Maybe');
    }
  };

  //# Maybe.empty :: -> Maybe a
  //.
  //. Returns a Nothing.
  //.
  //. ```javascript
  //. > S.Maybe.empty()
  //. Nothing()
  //. ```
  Maybe.empty =
  def('Maybe.empty',
      {},
      [$Maybe(a)],
      function() { return Nothing(); });

  //# Maybe.of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Maybe.of(42)
  //. Just(42)
  //. ```
  Maybe.of =
  def('Maybe.of',
      {},
      [a, $Maybe(a)],
      function(x) { return Just(x); });

  //# Maybe#@@type :: String
  //.
  //. Maybe type identifier, `'sanctuary/Maybe'`.
  Maybe.prototype['@@type'] = 'sanctuary/Maybe';

  //# Maybe#isNothing :: Boolean
  //.
  //. `true` if `this` is a Nothing; `false` if `this` is a Just.
  //.
  //. ```javascript
  //. > S.Nothing().isNothing
  //. true
  //.
  //. > S.Just(42).isNothing
  //. false
  //. ```

  //# Maybe#isJust :: Boolean
  //.
  //. `true` if `this` is a Just; `false` if `this` is a Nothing.
  //.
  //. ```javascript
  //. > S.Just(42).isJust
  //. true
  //.
  //. > S.Nothing().isJust
  //. false
  //. ```

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
  //. > S.Just(S.inc).ap(S.Nothing())
  //. Nothing()
  //.
  //. > S.Just(S.inc).ap(S.Just(42))
  //. Just(43)
  //. ```
  Maybe.prototype.ap =
  method('Maybe#ap',
         {},
         [$Maybe($.Function), $Maybe(a), $Maybe(b)],
         function(mf, mx) { return mf.isJust ? mx.map(mf.value) : mf; });

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
  Maybe.prototype.chain =
  method('Maybe#chain',
         {},
         [$Maybe(a), $.Function, $Maybe(b)],
         function(maybe, f) { return maybe.isJust ? f(maybe.value) : maybe; });

  //# Maybe#concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
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
  Maybe.prototype.concat =
  method('Maybe#concat',
         {a: [Semigroup]},
         [$Maybe(a), $Maybe(a), $Maybe(a)],
         function(mx, my) {
           return mx.isNothing ? my :
                  my.isNothing ? mx : Just(mx.value.concat(my.value));
         });

  //# Maybe#empty :: Maybe a ~> Maybe a
  //.
  //. Returns a Nothing.
  //.
  //. ```javascript
  //. > S.Just(42).empty()
  //. Nothing()
  //. ```
  Maybe.prototype.empty =
  def('Maybe#empty',
      {},
      [$Maybe(a)],
      Maybe.empty);

  //# Maybe#equals :: Maybe a ~> b -> Boolean
  //.
  //. Takes a value of any type and returns `true` if:
  //.
  //.   - it is a Nothing and `this` is a Nothing; or
  //.
  //.   - it is a Just and `this` is a Just, and their values are equal
  //.     according to [`R.equals`][R.equals].
  //.
  //. ```javascript
  //. > S.Nothing().equals(S.Nothing())
  //. true
  //.
  //. > S.Nothing().equals(null)
  //. false
  //.
  //. > S.Just([1, 2, 3]).equals(S.Just([1, 2, 3]))
  //. true
  //.
  //. > S.Just([1, 2, 3]).equals(S.Just([3, 2, 1]))
  //. false
  //.
  //. > S.Just([1, 2, 3]).equals(S.Nothing())
  //. false
  //. ```
  Maybe.prototype.equals =
  method('Maybe#equals',
         {},
         [$Maybe(a), b, $.Boolean],
         function(maybe, x) {
           return _type(x) === 'sanctuary/Maybe' &&
                  (maybe.isNothing && x.isNothing ||
                   maybe.isJust && x.isJust && R.eqProps('value', maybe, x));
         });

  //# Maybe#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
  //.
  //. Takes a function and returns `this` if `this` is a Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function to
  //. `this`.
  //.
  //. ```javascript
  //. > S.Nothing().extend(x => x.value + 1)
  //. Nothing()
  //.
  //. > S.Just(42).extend(x => x.value + 1)
  //. Just(43)
  //. ```
  Maybe.prototype.extend =
  method('Maybe#extend',
         {},
         [$Maybe(a), $.Function, $Maybe(a)],
         function(maybe, f) { return maybe.isJust ? Just(f(maybe)) : maybe; });

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
  //. Nothing()
  //. ```
  Maybe.prototype.filter =
  method('Maybe#filter',
         {},
         [$Maybe(a), $.Function, $Maybe(a)],
         function(maybe, pred) { return filter(pred, maybe); });

  //# Maybe#map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //. Takes a function and returns `this` if `this` is a Nothing; otherwise
  //. it returns a Just whose value is the result of applying the function to
  //. this Just's value.
  //.
  //. ```javascript
  //. > S.Nothing().map(S.inc)
  //. Nothing()
  //.
  //. > S.Just([1, 2, 3]).map(S.sum)
  //. Just(6)
  //. ```
  Maybe.prototype.map =
  method('Maybe#map',
         {},
         [$Maybe(a), $.Function, $Maybe(b)],
         function(maybe, f) {
           return maybe.isJust ? Just(f(maybe.value)) : maybe;
         });

  //# Maybe#of :: Maybe a ~> b -> Maybe b
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Nothing().of(42)
  //. Just(42)
  //. ```
  Maybe.prototype.of =
  def('Maybe#of',
      {},
      [b, $Maybe(b)],
      Maybe.of);

  //# Maybe#reduce :: Maybe a ~> ((b, a) -> b) -> b -> b
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is a Nothing; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Just's value.
  //.
  //. ```javascript
  //. > S.Nothing().reduce(S.add, 10)
  //. 10
  //.
  //. > S.Just(5).reduce(S.add, 10)
  //. 15
  //. ```
  Maybe.prototype.reduce =
  method('Maybe#reduce',
         {},
         [$Maybe(a), $.Function, b, b],
         function(maybe, f, x) {
           return maybe.isJust ? f(x, maybe.value) : x;
         });

  //# Maybe#sequence :: Applicative f => Maybe (f a) ~> (a -> f a) -> f (Maybe a)
  //.
  //. Evaluates an applicative action contained within the Maybe, resulting in:
  //.
  //.   - a pure applicative of a Nothing if `this` is a Nothing; otherwise
  //.
  //.   - an applicative of Just the value of the evaluated action.
  //.
  //. ```javascript
  //. > S.Nothing().sequence(S.Either.of)
  //. Right(Nothing())
  //.
  //. > S.Just(S.Right(42)).sequence(S.Either.of)
  //. Right(Just(42))
  //.
  //. > S.Just(S.Left('Cannot divide by zero')).sequence(S.Either.of)
  //. Left('Cannot divide by zero')
  //. ```
  Maybe.prototype.sequence =
  method('Maybe#sequence',
         {a: [Applicative], b: [Applicative]},
         [$Maybe(a), $.Function, b],
         function(maybe, of) {
           return maybe.isJust ? R.map(Just, maybe.value) : of(maybe);
         });

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
  Maybe.prototype.toBoolean =
  method('Maybe#toBoolean',
         {},
         [$Maybe(a), $.Boolean],
         prop('isJust'));

  //# Maybe#toString :: Maybe a ~> String
  //.
  //. Returns the string representation of the Maybe.
  //.
  //. ```javascript
  //. > S.Nothing().toString()
  //. 'Nothing()'
  //.
  //. > S.Just([1, 2, 3]).toString()
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.toString =
  method('Maybe#toString',
         {},
         [$Maybe(a), $.String],
         function(maybe) {
           return maybe.isJust ? 'Just(' + R.toString(maybe.value) + ')'
                               : 'Nothing()';
         });

  //# Maybe#inspect :: Maybe a ~> String
  //.
  //. Returns the string representation of the Maybe. This method is used by
  //. `util.inspect` and the REPL to format a Maybe for display.
  //.
  //. See also [`Maybe#toString`](#Maybe.prototype.toString).
  //.
  //. ```javascript
  //. > S.Nothing().inspect()
  //. 'Nothing()'
  //.
  //. > S.Just([1, 2, 3]).inspect()
  //. 'Just([1, 2, 3])'
  //. ```
  Maybe.prototype.inspect = inspect;

  //# Nothing :: -> Maybe a
  //.
  //. Returns a Nothing. Though this is a constructor function the `new`
  //. keyword needn't be used.
  //.
  //. ```javascript
  //. > S.Nothing()
  //. Nothing()
  //. ```
  var Nothing = S.Nothing = function() {
    var nothing = new Maybe(sentinel);
    nothing.isNothing = true;
    nothing.isJust = false;
    return nothing;
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
  var Just = S.Just = function(value) {
    var just = new Maybe(sentinel);
    just.isNothing = false;
    just.isJust = true;
    just.value = value;
    return just;
  };

  //# isNothing :: Maybe a -> Boolean
  //.
  //. Returns `true` if the given Maybe is a Nothing; `false` if it is a Just.
  //.
  //. ```javascript
  //. > S.isNothing(S.Nothing())
  //. true
  //.
  //. > S.isNothing(S.Just(42))
  //. false
  //. ```
  S.isNothing =
  def('isNothing',
      {},
      [$Maybe(a), $.Boolean],
      prop('isNothing'));

  //# isJust :: Maybe a -> Boolean
  //.
  //. Returns `true` if the given Maybe is a Just; `false` if it is a Nothing.
  //.
  //. ```javascript
  //. > S.isJust(S.Just(42))
  //. true
  //.
  //. > S.isJust(S.Nothing())
  //. false
  //. ```
  S.isJust =
  def('isJust',
      {},
      [$Maybe(a), $.Boolean],
      prop('isJust'));

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
  //. > S.fromMaybe(0, S.Nothing())
  //. 0
  //. ```
  var fromMaybe = S.fromMaybe =
  def('fromMaybe',
      {},
      [a, $Maybe(a), a],
      function(x, maybe) { return maybe.isJust ? maybe.value : x; });

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
  //. > S.maybeToNullable(S.Nothing())
  //. null
  //. ```
  S.maybeToNullable =
  def('maybeToNullable',
      {},
      [$Maybe(a), $.Nullable(a)],
      function(maybe) { return maybe.isJust ? maybe.value : null; });

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
  var toMaybe = S.toMaybe =
  def('toMaybe',
      {},
      [a, $Maybe(a)],
      function(x) { return x == null ? Nothing() : Just(x); });

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
  //. > S.maybe(0, R.length, S.Nothing())
  //. 0
  //. ```
  var maybe = S.maybe =
  def('maybe',
      {},
      [b, $.Function, $Maybe(a), b],
      function(x, f, maybe) { return fromMaybe(x, maybe.map(f)); });

  //# justs :: Array (Maybe a) -> Array a
  //.
  //. Takes an array of Maybes and returns an array containing each Just's
  //. value. Equivalent to Haskell's `catMaybes` function.
  //.
  //. See also [`lefts`](#lefts) and [`rights`](#rights).
  //.
  //. ```javascript
  //. > S.justs([S.Just('foo'), S.Nothing(), S.Just('baz')])
  //. ['foo', 'baz']
  //. ```
  var justs = S.justs =
  def('justs',
      {},
      [$.Array($Maybe(a)), $.Array(a)],
      R.chain(maybe([], R.of)));

  //# mapMaybe :: (a -> Maybe b) -> Array a -> Array b
  //.
  //. Takes a function and an array, applies the function to each element of
  //. the array, and returns an array of "successful" results. If the result of
  //. applying the function to an element of the array is a Nothing, the result
  //. is discarded; if the result is a Just, the Just's value is included in
  //. the output array.
  //.
  //. In general terms, `mapMaybe` filters an array while mapping over it.
  //.
  //. ```javascript
  //. > S.mapMaybe(S.head, [[], [1, 2, 3], [], [4, 5, 6], []])
  //. [1, 4]
  //. ```
  S.mapMaybe =
  def('mapMaybe',
      {},
      [$.Function, $.Array(a), $.Array(b)],
      function(f, xs) { return justs(R.map(f, xs)); });

  //# encase :: (a -> b) -> a -> Maybe b
  //.
  //. Takes a unary function `f` which may throw and a value `x` of any type,
  //. and applies `f` to `x` inside a `try` block. If an exception is caught,
  //. the return value is a Nothing; otherwise the return value is Just the
  //. result of applying `f` to `x`.
  //.
  //. See also [`encaseEither`](#encaseEither).
  //.
  //. ```javascript
  //. > S.encase(eval, '1 + 1')
  //. Just(2)
  //.
  //. > S.encase(eval, '1 +')
  //. Nothing()
  //. ```
  var encase = S.encase =
  def('encase',
      {},
      [$.Function, a, $Maybe(b)],
      function(f, x) {
        try {
          return Just(f(x));
        } catch (err) {
          return Nothing();
        }
      });

  //# encase2 :: (a -> b -> c) -> a -> b -> Maybe c
  //.
  //. Binary version of [`encase`](#encase).
  //.
  //. See also [`encase2_`](#encase2_).
  var encase2 = S.encase2 =
  def('encase2',
      {},
      [$.Function, a, b, $Maybe(c)],
      function(f, x, y) {
        try {
          return Just(f(x)(y));
        } catch (err) {
          return Nothing();
        }
      });

  //# encase2_ :: ((a, b) -> c) -> a -> b -> Maybe c
  //.
  //. Version of [`encase2`](#encase2) accepting uncurried functions.
  S.encase2_ =
  def('encase2_',
      {},
      [$.Function, a, b, $Maybe(c)],
      function(f_, x, y) {
        var f = function(x) {
          return function(y) {
            return f_(x, y);
          };
        };
        return encase2(f, x, y);
      });

  //# encase3 :: (a -> b -> c -> d) -> a -> b -> c -> Maybe d
  //.
  //. Ternary version of [`encase`](#encase).
  //.
  //. See also [`encase3_`](#encase3_).
  var encase3 = S.encase3 =
  def('encase3',
      {},
      [$.Function, a, b, c, $Maybe(d)],
      function(f, x, y, z) {
        try {
          return Just(f(x)(y)(z));
        } catch (err) {
          return Nothing();
        }
      });

  //# encase3_ :: ((a, b, c) -> d) -> a -> b -> c -> Maybe d
  //.
  //. Version of [`encase3`](#encase3) accepting uncurried functions.
  S.encase3_ =
  def('encase3_',
      {},
      [$.Function, a, b, c, $Maybe(d)],
      function(f_, x, y, z) {
        var f = function(x) {
          return function(y) {
            return function(z) {
              return f_(x, y, z);
            };
          };
        };
        return encase3(f, x, y, z);
      });

  //# maybeToEither :: a -> Maybe b -> Either a b
  //.
  //. Converts a Maybe to an Either. A Nothing becomes a Left (containing the
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
  S.maybeToEither =
  def('maybeToEither',
      {},
      [a, $Maybe(b), $Either(a, b)],
      function(x, maybe) {
        return maybe.isNothing ? Left(x) : Right(maybe.value);
      });

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
  var Either = S.Either = function Either() {
    if (arguments[0] !== sentinel) {
      throw new Error('Cannot instantiate Either');
    }
  };

  //# Either.of :: b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Either.of(42)
  //. Right(42)
  //. ```
  Either.of =
  def('Either.of',
      {},
      [b, $Either(a, b)],
      function(x) { return Right(x); });

  //# Either#@@type :: String
  //.
  //. Either type identifier, `'sanctuary/Either'`.
  Either.prototype['@@type'] = 'sanctuary/Either';

  //# Either#isLeft :: Boolean
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

  //# Either#isRight :: Boolean
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
  Either.prototype.ap =
  method('Either#ap',
         {},
         [$Either(a, $.Function), $Either(a, b), $Either(a, c)],
         function(ef, ex) { return ef.isRight ? ex.map(ef.value) : ef; });

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
  Either.prototype.chain =
  method('Either#chain',
         {},
         [$Either(a, b), $.Function, $Either(a, c)],
         function(either, f) {
           return either.isRight ? f(either.value) : either;
         });

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
  Either.prototype.concat =
  method('Either#concat',
         {a: [Semigroup], b: [Semigroup]},
         [$Either(a, b), $Either(a, b), $Either(a, b)],
         function(ex, ey) {
           return ex.isLeft && ey.isLeft ? Left(ex.value.concat(ey.value)) :
                  ex.isRight && ey.isRight ? Right(ex.value.concat(ey.value)) :
                  ex.isRight ? ex : ey;
         });

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
  Either.prototype.equals =
  method('Either#equals',
         {},
         [$Either(a, b), c, $.Boolean],
         function(either, x) {
           return _type(x) === 'sanctuary/Either' &&
                  either.isLeft === x.isLeft && R.eqProps('value', either, x);
         });

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
  Either.prototype.extend =
  method('Either#extend',
         {},
         [$Either(a, b), $.Function, $Either(a, b)],
         function(either, f) {
           return either.isLeft ? either : Right(f(either));
         });

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
  Either.prototype.map =
  method('Either#map',
         {},
         [$Either(a, b), $.Function, $Either(a, c)],
         function(either, f) {
           return either.isRight ? Right(f(either.value)) : either;
         });

  //# Either#of :: Either a b ~> c -> Either a c
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').of(42)
  //. Right(42)
  //. ```
  Either.prototype.of =
  def('Either#of',
      {},
      [c, $Either(a, c)],
      Either.of);

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
  Either.prototype.reduce =
  method('Either#reduce',
         {},
         [$Either(a, b), $.Function, c, c],
         function(either, f, x) {
           return either.isRight ? f(x, either.value) : x;
         });

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
  //. > S.Right(S.Nothing()).sequence(S.Maybe.of)
  //. Nothing()
  //. ```
  Either.prototype.sequence =
  method('Either#sequence',
         {b: [Applicative], c: [Applicative]},
         [$Either(a, b), $.Function, c],
         function(either, of) {
           return either.isRight ? R.map(Right, either.value) : of(either);
         });

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
  Either.prototype.toBoolean =
  method('Either#toBoolean',
         {},
         [$Either(a, b), $.Boolean],
         prop('isRight'));

  //# Either#toString :: Either a b ~> String
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
  Either.prototype.toString =
  method('Either#toString',
         {},
         [$Either(a, b), $.String],
         function(either) {
           return (either.isLeft ? 'Left' : 'Right') +
                  '(' + R.toString(either.value) + ')';
         });

  //# Either#inspect :: Either a b ~> String
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
  Either.prototype.inspect = inspect;

  //# Left :: a -> Either a b
  //.
  //. Takes a value of any type and returns a Left with the given value.
  //. Though this is a constructor function the `new` keyword needn't be
  //. used.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero')
  //. Left('Cannot divide by zero')
  //. ```
  var Left = S.Left = function(value) {
    var left = new Either(sentinel);
    left.isLeft = true;
    left.isRight = false;
    left.value = value;
    return left;
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
  var Right = S.Right = function(value) {
    var right = new Either(sentinel);
    right.isLeft = false;
    right.isRight = true;
    right.value = value;
    return right;
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
  S.isLeft =
  def('isLeft',
      {},
      [$Either(a, b), $.Boolean],
      prop('isLeft'));

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
  S.isRight =
  def('isRight',
      {},
      [$Either(a, b), $.Boolean],
      prop('isRight'));

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
  S.either =
  def('either',
      {},
      [$.Function, $.Function, $Either(a, b), c],
      function(l, r, either) {
        return either.isLeft ? l(either.value) : r(either.value);
      });

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
  S.lefts =
  def('lefts',
      {},
      [$.Array($Either(a, b)), $.Array(a)],
      R.chain(function(either) {
        return either.isLeft ? [either.value] : [];
      }));

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
  S.rights =
  def('rights',
      {},
      [$.Array($Either(a, b)), $.Array(b)],
      R.chain(function(either) {
        return either.isRight ? [either.value] : [];
      }));

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
  //. Left(new SyntaxError('Unexpected end of input'))
  //.
  //. > S.encaseEither(S.prop('message'), JSON.parse, '[')
  //. Left('Unexpected end of input')
  //. ```
  S.encaseEither =
  def('encaseEither',
      {},
      [$.Function, $.Function, a, $Either(l, r)],
      function(f, g, x) {
        try {
          return Right(g(x));
        } catch (err) {
          return Left(f(err));
        }
      });

  //# encaseEither2 :: (Error -> l) -> (a -> b -> r) -> a -> b -> Either l r
  //.
  //. Binary version of [`encaseEither`](#encaseEither).
  //.
  //. See also [`encaseEither2_`](#encaseEither2_).
  var encaseEither2 = S.encaseEither2 =
  def('encaseEither2',
      {},
      [$.Function, $.Function, a, b, $Either(l, r)],
      function(f, g, x, y) {
        try {
          return Right(g(x)(y));
        } catch (err) {
          return Left(f(err));
        }
      });

  //# encaseEither2_ :: (Error -> l) -> ((a, b) -> r) -> a -> b -> Either l r
  //.
  //. Version of [`encaseEither2`](#encaseEither2) accepting uncurried
  //. functions.
  S.encaseEither2_ =
  def('encaseEither2_',
      {},
      [$.Function, $.Function, a, b, $Either(l, r)],
      function(f, g_, x, y) {
        var g = function(x) {
          return function(y) {
            return g_(x, y);
          };
        };
        return encaseEither2(f, g, x, y);
      });

  //# encaseEither3 :: (Error -> l) -> (a -> b -> c -> r) -> a -> b -> c -> Either l r
  //.
  //. Ternary version of [`encaseEither`](#encaseEither).
  //.
  //. See also [`encaseEither3_`](#encaseEither3_).
  var encaseEither3 = S.encaseEither3 =
  def('encaseEither3',
      {},
      [$.Function, $.Function, a, b, c, $Either(l, r)],
      function(f, g, x, y, z) {
        try {
          return Right(g(x)(y)(z));
        } catch (err) {
          return Left(f(err));
        }
      });

  //# encaseEither3_ :: (Error -> l) -> ((a, b, c) -> r) -> a -> b -> c -> Either l r
  //.
  //. Version of [`encaseEither3`](#encaseEither3) accepting uncurried
  //. functions.
  S.encaseEither3_ =
  def('encaseEither3',
      {},
      [$.Function, $.Function, a, b, c, $Either(l, r)],
      function(f, g_, x, y, z) {
        var g = function(x) {
          return function(y) {
            return function(z) {
              return g_(x, y, z);
            };
          };
        };
        return encaseEither3(f, g, x, y, z);
      });

  //# eitherToMaybe :: Either a b -> Maybe b
  //.
  //. Converts an Either to a Maybe. A Left becomes a Nothing; a Right becomes
  //. a Just.
  //.
  //. See also [`maybeToEither`](#maybeToEither).
  //.
  //. ```javascript
  //. > S.eitherToMaybe(S.Left('Cannot divide by zero'))
  //. Nothing()
  //.
  //. > S.eitherToMaybe(S.Right(42))
  //. Just(42)
  //. ```
  S.eitherToMaybe =
  def('eitherToMaybe',
      {},
      [$Either(a, b), $Maybe(b)],
      function(either) {
        return either.isLeft ? Nothing() : Just(either.value);
      });

  //. ### Alternative

  //  Alternative :: TypeClass
  var Alternative = $.TypeClass(
    'Alternative',
    function(x) {
      return R.contains(R.type(x), ['Array', 'Boolean']) ||
             hasMethod('toBoolean')(x);
    }
  );

  //  toBoolean :: Alternative a => a -> Boolean
  var toBoolean = function(x) {
    switch (R.type(x)) {
      case 'Array':     return x.length > 0;
      case 'Boolean':   return x.valueOf();
      default:          return x.toBoolean();
    }
  };

  //  empty :: Monoid a => a -> a
  var empty = function(x) {
    switch (R.type(x)) {
      case 'Array':     return [];
      case 'Boolean':   return false;
      default:          return x.empty();
    }
  };

  //# and :: Alternative a => a -> a -> a
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
  S.and =
  def('and',
      {a: [Alternative]},
      [a, a, a],
      function(x, y) { return toBoolean(x) ? y : x; });

  //# or :: Alternative a => a -> a -> a
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
  var or = S.or =
  def('or',
      {a: [Alternative]},
      [a, a, a],
      function(x, y) { return toBoolean(x) ? x : y; });

  //# xor :: (Alternative a, Monoid a) => a -> a -> a
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
  S.xor =
  def('xor',
      {a: [Alternative, Monoid]},
      [a, a, a],
      function(x, y) {
        return toBoolean(x) === toBoolean(y) ? empty(x) : or(x, y);
      });

  //. ### Logic

  //# not :: Boolean -> Boolean
  //.
  //. Takes a Boolean and returns the negation of that value
  //. (`false` for `true`; `true` for `false`).
  //.
  //. ```javascript
  //. > S.not(true)
  //. false
  //.
  //. > S.not(false)
  //. true
  //. ```
  S.not =
  def('not',
      {},
      [$.Boolean, $.Boolean],
      function(x) { return !x.valueOf(); });

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
  S.ifElse =
  def('ifElse',
      {},
      [$.Function, $.Function, $.Function, a, b],
      function(pred, f, g, x) { return pred(x) ? f(x) : g(x); });

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
  S.allPass =
  def('allPass',
      {},
      [$.Array($.Function), a, $.Boolean],
      function(preds, x) {
        for (var idx = 0; idx < preds.length; idx += 1) {
          if (!preds[idx](x)) return false;
        }
        return true;
      });

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
  S.anyPass =
  def('anyPass',
      {},
      [$.Array($.Function), a, $.Boolean],
      function(preds, x) {
        for (var idx = 0; idx < preds.length; idx += 1) {
          if (preds[idx](x)) return true;
        }
        return false;
      });

  //. ### List
  //.
  //. The List type represents non-Function values with integer `length`
  //. properties greater than or equal to zero, such as `[1, 2, 3]` and
  //. `'foo'`.
  //.
  //. `[a]` is the notation used to represent a List of values of type `a`.

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
  var concat = S.concat =
  def('concat',
      {a: [Semigroup]},
      [a, a, a],
      function(x, y) { return x.concat(y); });

  //# slice :: Integer -> Integer -> [a] -> Maybe [a]
  //.
  //. Returns Just a list containing the elements from the supplied list
  //. from a beginning index (inclusive) to an end index (exclusive).
  //. Returns Nothing unless the start interval is less than or equal to
  //. the end interval, and the list contains both (half-open) intervals.
  //. Accepts negative indices, which indicate an offset from the end of
  //. the list.
  //.
  //. Dispatches to its third argument's `slice` method if present. As a
  //. result, one may replace `[a]` with `String` in the type signature.
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
  //. Nothing()
  //.
  //. > S.slice(2, 6, 'banana')
  //. Just('nana')
  //. ```
  var slice = S.slice =
  def('slice',
      {},
      [$.Integer, $.Integer, List(a), $Maybe(List(a))],
      function(start, end, xs) {
        var len = xs.length;
        var A = negativeZero(start) ? len : start < 0 ? start + len : start;
        var Z = negativeZero(end) ? len : end < 0 ? end + len : end;

        return Math.abs(start) <= len && Math.abs(end) <= len && A <= Z ?
          Just(R.slice(A, Z, xs)) :
          Nothing();
      });

  //# at :: Integer -> [a] -> Maybe a
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
  //. Nothing()
  //.
  //. > S.at(-2, ['a', 'b', 'c', 'd', 'e'])
  //. Just('d')
  //. ```
  var at = S.at =
  def('at',
      {},
      [$.Integer, List(a), $Maybe(a)],
      function(n, xs) {
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
  S.head =
  def('head',
      {},
      [List(a), $Maybe(a)],
      at(0));

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
  S.last =
  def('last',
      {},
      [List(a), $Maybe(a)],
      at(-1));

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
  S.tail =
  def('tail',
      {},
      [List(a), $Maybe(List(a))],
      slice(1, -0));

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
  S.init =
  def('init',
      {},
      [List(a), $Maybe(List(a))],
      slice(0, -1));

  //# take :: Integer -> [a] -> Maybe [a]
  //.
  //. Returns Just the first N elements of the given collection if N is
  //. greater than or equal to zero and less than or equal to the length
  //. of the collection; Nothing otherwise. Supports Array, String, and
  //. any other collection type which provides a `slice` method.
  //.
  //. ```javascript
  //. > S.take(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['a', 'b'])
  //.
  //. > S.take(4, 'abcdefg')
  //. Just('abcd')
  //.
  //. > S.take(4, ['a', 'b', 'c'])
  //. Nothing()
  //. ```
  S.take =
  def('take',
      {},
      [$.Integer, List(a), $Maybe(List(a))],
      function(n, xs) {
        return n < 0 || negativeZero(n) ? Nothing() : slice(0, n, xs);
      });

  //# takeLast :: Integer -> [a] -> Maybe [a]
  //.
  //. Returns Just the last N elements of the given collection if N is
  //. greater than or equal to zero and less than or equal to the length
  //. of the collection; Nothing otherwise. Supports Array, String, and
  //. any other collection type which provides a `slice` method.
  //.
  //. ```javascript
  //. > S.takeLast(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['d', 'e'])
  //.
  //. > S.takeLast(4, 'abcdefg')
  //. Just('defg')
  //.
  //. > S.takeLast(4, ['a', 'b', 'c'])
  //. Nothing()
  //. ```
  S.takeLast =
  def('takeLast',
      {},
      [$.Integer, List(a), $Maybe(List(a))],
      function(n, xs) {
        return n < 0 || negativeZero(n) ? Nothing() : slice(-n, -0, xs);
      });

  //# drop :: Integer -> [a] -> Maybe [a]
  //.
  //. Returns Just all but the first N elements of the given collection
  //. if N is greater than or equal to zero and less than or equal to the
  //. length of the collection; Nothing otherwise. Supports Array, String,
  //. and any other collection type which provides a `slice` method.
  //.
  //. ```javascript
  //. > S.drop(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['c', 'd', 'e'])
  //.
  //. > S.drop(4, 'abcdefg')
  //. Just('efg')
  //.
  //. > S.drop(4, 'abc')
  //. Nothing()
  //. ```
  S.drop =
  def('drop',
      {},
      [$.Integer, List(a), $Maybe(List(a))],
      function(n, xs) {
        return n < 0 || negativeZero(n) ? Nothing() : slice(n, -0, xs);
      });

  //# dropLast :: Integer -> [a] -> Maybe [a]
  //.
  //. Returns Just all but the last N elements of the given collection
  //. if N is greater than or equal to zero and less than or equal to the
  //. length of the collection; Nothing otherwise. Supports Array, String,
  //. and any other collection type which provides a `slice` method.
  //.
  //. ```javascript
  //. > S.dropLast(2, ['a', 'b', 'c', 'd', 'e'])
  //. Just(['a', 'b', 'c'])
  //.
  //. > S.dropLast(4, 'abcdefg')
  //. Just('abc')
  //.
  //. > S.dropLast(4, 'abc')
  //. Nothing()
  //. ```
  S.dropLast =
  def('dropLast',
      {},
      [$.Integer, List(a), $Maybe(List(a))],
      function(n, xs) {
        return n < 0 || negativeZero(n) ? Nothing() : slice(0, -n, xs);
      });

  //# reverse :: [a] -> [a]
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
  S.reverse =
  def('reverse',
      {},
      [List(a), List(a)],
      function reverse(xs) {
        if (_type(xs) === 'String') return reverse(xs.split('')).join('');
        var result = [];
        for (var idx = xs.length - 1; idx >= 0; idx -= 1) result.push(xs[idx]);
        return result;
      });

  //  ArrayLike :: TypeClass
  var ArrayLike = $.TypeClass(
    'ArrayLike',
    function(x) {
      return x != null &&
             typeof x !== 'function' &&
             $.Integer._test(x.length) &&
             x.length >= 0;
    }
  );

  var sanctifyIndexOf = function(name) {
    return def(name,
               {b: [ArrayLike]},
               [a, b, $Maybe($.Integer)],
               R.pipe(R[name], Just, R.filter(R.gte(_, 0))));
  };

  //# indexOf :: a -> [a] -> Maybe Integer
  //.
  //. Takes a value of any type and a list, and returns Just the index
  //. of the first occurrence of the value in the list, if applicable;
  //. Nothing otherwise.
  //.
  //. Dispatches to its second argument's `indexOf` method if present.
  //. As a result, `String -> String -> Maybe Integer` is an alternative
  //. type signature.
  //.
  //. ```javascript
  //. > S.indexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Just(1)
  //.
  //. > S.indexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Nothing()
  //.
  //. > S.indexOf('an', 'banana')
  //. Just(1)
  //.
  //. > S.indexOf('ax', 'banana')
  //. Nothing()
  //. ```
  S.indexOf = sanctifyIndexOf('indexOf');

  //# lastIndexOf :: a -> [a] -> Maybe Integer
  //.
  //. Takes a value of any type and a list, and returns Just the index
  //. of the last occurrence of the value in the list, if applicable;
  //. Nothing otherwise.
  //.
  //. Dispatches to its second argument's `lastIndexOf` method if present.
  //. As a result, `String -> String -> Maybe Integer` is an alternative
  //. type signature.
  //.
  //. ```javascript
  //. > S.lastIndexOf('a', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Just(5)
  //.
  //. > S.lastIndexOf('x', ['b', 'a', 'n', 'a', 'n', 'a'])
  //. Nothing()
  //.
  //. > S.lastIndexOf('an', 'banana')
  //. Just(3)
  //.
  //. > S.lastIndexOf('ax', 'banana')
  //. Nothing()
  //. ```
  S.lastIndexOf = sanctifyIndexOf('lastIndexOf');

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
  S.append =
  def('append',
      {},
      [a, $.Array(a), $.Array(a)],
      function(x, xs) { return xs.concat([x]); });

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
  S.prepend =
  def('prepend',
      {},
      [a, $.Array(a), $.Array(a)],
      function(x, xs) { return [x].concat(xs); });

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
  //. Nothing()
  //. ```
  S.find =
  def('find',
      {},
      [$.Function, $.Array(a), $Maybe(a)],
      function(pred, xs) {
        for (var idx = 0, len = xs.length; idx < len; idx += 1) {
          if (pred(xs[idx])) {
            return Just(xs[idx]);
          }
        }
        return Nothing();
      });

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
  //. [Just(1), Just(2), Nothing(), Nothing(), Nothing()]
  //. ```
  S.pluck =
  def('pluck',
      {a: [Accessible]},
      [TypeRep, $.String, $.Array(a), $.Array($Maybe(b))],
      function(type, key, xs) { return R.map(get(type, key), xs); });

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
  var reduce = S.reduce =
  def('reduce',
      {b: [Foldable]},
      [$.Function, a, b, a],
      function(f_, initial, foldable) {
        var f = function(a, b) {
          return f_(a)(b);
        };
        return reduce_(f, initial, foldable);
      });

  //# reduce_ :: Foldable f => ((a, b) -> a) -> a -> f b -> a
  //.
  //. Version of [`reduce`](#reduce) accepting uncurried functions.
  var reduce_ = S.reduce_ =
  def('reduce_',
      {b: [Foldable]},
      [$.Function, a, b, a],
      function(f, initial, foldable) {
        if (_type(foldable) === 'Array') {
          var acc = initial;
          for (var idx = 0; idx < foldable.length; idx += 1) {
            acc = f(acc, foldable[idx]);
          }
          return acc;
        } else {
          return foldable.reduce(f, initial);
        }
      });

  //# unfoldr :: (b -> Maybe (Pair a b)) -> b -> Array a
  //.
  //. Takes a function and a seed value, and returns an array generated by
  //. applying the function repeatedly. The array is initially empty. The
  //. function is initially applied to the seed value. Each application
  //. of the function should result in either:
  //.
  //.   - a Nothing, in which case the array is returned; or
  //.
  //.   - Just a pair, in which case the first element is appended to
  //.     the array and the function is applied to the second element.
  //.
  //. ```javascript
  //. > S.unfoldr(n => n < 5 ? S.Just([n, n + 1]) : S.Nothing(), 1)
  //. [1, 2, 3, 4]
  //. ```
  S.unfoldr =
  def('unfoldr',
      {},
      [$.Function, b, $.Array(a)],
      function(f, x) {
        var result = [];
        var m = f(x);
        while (m.isJust) {
          result.push(m.value[0]);
          m = f(m.value[1]);
        }
        return result;
      });

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
  S.range =
  def('range',
      {},
      [$.Integer, $.Integer, $.Array($.Integer)],
      function(from, to) {
        var result = [];
        for (var n = from; n < to; n += 1) result.push(n);
        return result;
      });

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
  S.prop = prop;

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
  //. Nothing()
  //.
  //. > S.get(Number, 'x', {})
  //. Nothing()
  //. ```
  var get = S.get =
  def('get',
      {a: [Accessible]},
      [TypeRep, $.String, a, $Maybe(b)],
      function(type, key, obj) { return filter(is(type), Just(obj[key])); });

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
  //. Nothing()
  //.
  //. > S.gets(Number, ['a', 'b', 'c'], {})
  //. Nothing()
  //. ```
  S.gets =
  def('gets',
      {a: [Accessible]},
      [TypeRep, $.Array($.String), a, $Maybe(b)],
      function(type, keys, obj) {
        var x = obj;
        for (var idx = 0; idx < keys.length; idx += 1) {
          if (x == null) {
            return Nothing();
          }
          x = x[keys[idx]];
        }
        return filter(is(type), Just(x));
      });

  //# keys :: StrMap a -> Array String
  //.
  //. Returns the keys of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.keys({b: 2, c: 3, a: 1}).sort()
  //. ['a', 'b', 'c']
  //. ```
  S.keys =
  def('keys',
      {},
      [$.StrMap(a), $.Array($.String)],
      Object.keys);

  //# values :: StrMap a -> Array a
  //.
  //. Returns the values of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.values({a: 1, c: 3, b: 2}).sort()
  //. [1, 2, 3]
  //. ```
  S.values =
  def('values',
      {},
      [$.StrMap(a), $.Array(a)],
      function(strMap) {
        return Object.keys(strMap).map(function(key) { return strMap[key]; });
      });

  //# toPairs :: StrMap a -> Array (Pair String a)
  //.
  //. Returns the key–value pairs of the given string map, in arbitrary order.
  //.
  //. ```javascript
  //. > S.pairs({b: 2, a: 1, c: 3}).sort()
  //. [['a', 1], ['b', 2], ['c', 3]]
  //. ```
  S.pairs =
  def('pairs',
      {},
      [$.StrMap(a), $.Array($.Pair($.String, a))],
      function(strMap) {
        return Object.keys(strMap).map(function(k) { return [k, strMap[k]]; });
      });

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
  S.negate =
  def('negate',
      {},
      [$.ValidNumber, $.ValidNumber],
      function(n) { return -n; });

  //# add :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the sum of two (finite) numbers.
  //.
  //. ```javascript
  //. > S.add(1, 1)
  //. 2
  //. ```
  S.add =
  def('add',
      {},
      [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
      function(a, b) { return a + b; });

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
  //. > S.sum(S.Nothing())
  //. 0
  //. ```
  var sum = S.sum =
  def('sum',
      {f: [Foldable]},
      [f, $.FiniteNumber],
      reduce(function(a) { return function(b) { return a + b; }; }, 0));

  //# sub :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the difference between two (finite) numbers.
  //.
  //. ```javascript
  //. > S.sub(4, 2)
  //. 2
  //. ```
  S.sub =
  def('sub',
      {},
      [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
      function(a, b) { return a - b; });

  //# inc :: FiniteNumber -> FiniteNumber
  //.
  //. Increments a (finite) number by one.
  //.
  //. ```javascript
  //. > S.inc(1)
  //. 2
  //. ```
  S.inc =
  def('inc',
      {},
      [$.FiniteNumber, $.FiniteNumber],
      function(a) { return a + 1; });

  //# dec :: FiniteNumber -> FiniteNumber
  //.
  //. Decrements a (finite) number by one.
  //.
  //. ```javascript
  //. > S.dec(2)
  //. 1
  //. ```
  S.dec =
  def('dec',
      {},
      [$.FiniteNumber, $.FiniteNumber],
      function(a) { return a - 1; });

  //# mult :: FiniteNumber -> FiniteNumber -> FiniteNumber
  //.
  //. Returns the product of two (finite) numbers.
  //.
  //. ```javascript
  //. > S.mult(4, 2)
  //. 8
  //. ```
  S.mult =
  def('mult',
      {},
      [$.FiniteNumber, $.FiniteNumber, $.FiniteNumber],
      function(a, b) { return a * b; });

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
  //. > S.product(S.Nothing())
  //. 1
  //. ```
  S.product =
  def('product',
      {f: [Foldable]},
      [f, $.FiniteNumber],
      reduce(function(a) { return function(b) { return a * b; }; }, 1));

  //# div :: FiniteNumber -> NonZeroFiniteNumber -> FiniteNumber
  //.
  //. Returns the result of dividing its first argument (a finite number) by
  //. its second argument (a non-zero finite number).
  //.
  //. ```javascript
  //. > S.div(7, 2)
  //. 3.5
  //. ```
  S.div =
  def('div',
      {},
      [$.FiniteNumber, $.NonZeroFiniteNumber, $.FiniteNumber],
      function(a, b) { return a / b; });

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
  S.min =
  def('min',
      {a: [Ord]},
      [a, a, a],
      function(x, y) { return x < y ? x : y; });

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
  S.max =
  def('max',
      {a: [Ord]},
      [a, a, a],
      function(x, y) { return x > y ? x : y; });

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
  S.even =
  def('even',
      {},
      [$.Integer, $.Boolean],
      function(n) { return n % 2 === 0; });

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
  S.odd =
  def('odd',
      {},
      [$.Integer, $.Boolean],
      function(n) { return n % 2 !== 0; });

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
  //. Nothing()
  //. ```
  S.parseDate =
  def('parseDate',
      {},
      [$.String, $Maybe($.Date)],
      function(s) {
        var d = new Date(s);
        return d.valueOf() === d.valueOf() ? Just(d) : Nothing();
      });

  //  requiredNonCapturingGroup :: Array String -> String
  var requiredNonCapturingGroup = function(xs) {
    return '(?:' + xs.join('|') + ')';
  };

  //  optionalNonCapturingGroup :: Array String -> String
  var optionalNonCapturingGroup = function(xs) {
    return requiredNonCapturingGroup(xs) + '?';
  };

  //  validFloatRepr :: String -> Boolean
  var validFloatRepr = R.test(new RegExp(
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
  ));

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
  S.parseFloat =
  def('parseFloat',
      {},
      [$.String, $Maybe($.Number)],
      R.pipe(Just, R.filter(validFloatRepr), R.map(parseFloat)));

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
  //. Nothing()
  //. ```
  S.parseInt =
  def('parseInt',
      {},
      [$.Integer, $.String, $Maybe($.Integer)],
      function(radix, s) {
        if (radix < 2 || radix > 36) {
          throw new RangeError('Radix not in [2 .. 36]');
        }

        var charset = R.take(radix, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

        return R.pipe(
          Just,
          R.filter(R.pipe(R.replace(/^[+-]/, ''),
                          radix === 16 ? R.replace(/^0x/i, '') : I,
                          R.split(''),
                          R.all(R.pipe(toUpper,
                                       R.indexOf(_, charset),
                                       R.gte(_, 0))))),
          R.map(R.partialRight(parseInt, [radix])),
          R.filter($.Integer._test)
        )(s);
      });

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
  //. Nothing()
  //.
  //. > S.parseJson(Object, '["foo","bar","baz"]')
  //. Nothing()
  //. ```
  S.parseJson =
  def('parseJson',
      {},
      [TypeRep, $.String, $Maybe(a)],
      function(type, s) { return filter(is(type), encase(JSON.parse, s)); });

  //. ### RegExp

  //# regex :: RegexFlags -> String -> RegExp
  //.
  //. Takes a [RegexFlags][] and a pattern, and returns a RegExp.
  //.
  //. ```javascript
  //. > S.regex('g', ':\\d+:')
  //. /:\d+:/g
  //. ```
  S.regex =
  def('regex',
      {},
      [$.RegexFlags, $.String, $.RegExp],
      function(flags, source) { return new RegExp(source, flags); });

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
  S.regexEscape =
  def('regexEscape',
      {},
      [$.String, $.String],
      function(s) { return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); });

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
  S.test =
  def('test',
      {},
      [$.RegExp, $.String, $.Boolean],
      function(pattern, s) {
        var lastIndex = pattern.lastIndex;
        var result = pattern.test(s);
        pattern.lastIndex = lastIndex;
        return result;
      });

  //# match :: RegExp -> String -> Maybe (Array (Maybe String))
  //.
  //. Takes a pattern and a string, and returns Just an array of matches
  //. if the pattern matches the string; Nothing otherwise. Each match has
  //. type `Maybe String`, where a Nothing represents an unmatched optional
  //. capturing group.
  //.
  //. ```javascript
  //. > S.match(/(good)?bye/, 'goodbye')
  //. Just([Just('goodbye'), Just('good')])
  //.
  //. > S.match(/(good)?bye/, 'bye')
  //. Just([Just('bye'), Nothing()])
  //. ```
  S.match =
  def('match',
      {},
      [$.RegExp, $.String, $Maybe($.Array($Maybe($.String)))],
      function(pattern, s) {
        var match = s.match(pattern);
        return match == null ? Nothing() : Just(R.map(toMaybe, match));
      });

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
  var toUpper = S.toUpper =
  def('toUpper',
      {},
      [$.String, $.String],
      function(s) { return s.toUpperCase(); });

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
  S.toLower =
  def('toLower',
      {},
      [$.String, $.String],
      function(s) { return s.toLowerCase(); });

  //# trim :: String -> String
  //.
  //. Strips leading and trailing whitespace characters.
  //.
  //. ```javascript
  //. > S.trim('\t\t foo bar \n')
  //. 'foo bar'
  //. ```
  S.trim =
  def('trim',
      {},
      [$.String, $.String],
      function(s) { return s.trim(); });

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
  S.words =
  def('words',
      {},
      [$.String, $.Array($.String)],
      compose(R.reject(R.isEmpty), R.split(/\s+/)));

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
  S.unwords =
  def('unwords',
      {},
      [$.Array($.String), $.String],
      function(xs) { return xs.join(' '); });

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
  S.lines =
  def('lines',
      {},
      [$.String, $.Array($.String)],
      compose(R.match(/^(?=[\s\S]).*/gm), R.replace(/\r\n?/g, '\n')));

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
  S.unlines =
  def('unlines',
      {},
      [$.Array($.String), $.String],
      compose(R.join(''), R.map(concat(_, '\n'))));

  return S;

  /* eslint-enable indent */

  };

  //  Export two versions of the Sanctuary module: one with type checking;
  //  one without.
  var S       = createSanctuary(true);
  S.unchecked = createSanctuary(false);
  return S;

}));

//. [Apply]:          https://github.com/fantasyland/fantasy-land#apply
//. [BinaryType]:     https://github.com/sanctuary-js/sanctuary-def#binarytype
//. [Extend]:         https://github.com/fantasyland/fantasy-land#extend
//. [Foldable]:       https://github.com/fantasyland/fantasy-land#foldable
//. [Functor]:        https://github.com/fantasyland/fantasy-land#functor
//. [Monad]:          https://github.com/fantasyland/fantasy-land#monad
//. [Monoid]:         https://github.com/fantasyland/fantasy-land#monoid
//. [Nullable]:       https://github.com/sanctuary-js/sanctuary-def#nullable
//. [R.equals]:       http://ramdajs.com/docs/#equals
//. [R.map]:          http://ramdajs.com/docs/#map
//. [R.type]:         http://ramdajs.com/docs/#type
//. [Ramda]:          http://ramdajs.com/
//. [RegExp]:         https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
//. [RegexFlags]:     https://github.com/sanctuary-js/sanctuary-def#regexflags
//. [Semigroup]:      https://github.com/fantasyland/fantasy-land#semigroup
//. [Traversable]:    https://github.com/fantasyland/fantasy-land#traversable
//. [UnaryType]:      https://github.com/sanctuary-js/sanctuary-def#unarytype
//. [parseInt]:       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
//. [sanctuary-def]:  https://github.com/sanctuary-js/sanctuary-def
