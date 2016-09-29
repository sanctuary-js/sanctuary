
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
//. `[1, 2, 3]` has type `Array Number`. The arrow (`->`) is used to express
//. a function's type. `Math.abs`, for example, has type `Number -> Number`.
//. That is, it takes an argument of type `Number` and returns a value of
//. type `Number`.
//.
//. [`R.map`][R.map] has type `(a -> b) -> Array a -> Array b`. That is,
//. it takes an argument of type `a -> b` and returns a value of type
//. `Array a -> Array b`. `a` and `b` are type variables: applying `R.map`
//. to a value of type `String -> Number` will result in a value of type
//. `Array String -> Array Number`.
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

//. ## API

export {
  $Either as EitherType,
  $Maybe as MaybeType
} from './_internal/Types'
export {
  env
} from './env'
export {
  and,
  or,
  xor
} from './Alternative'
export {
  append,
  find,
  pluck,
  prepend,
  range,
  reduce,
  reduce_,
  unfoldr
} from './Array'
export {
  is,
  type
} from './Classify'
export {
  A,
  B,
  C,
  I,
  K,
  S,
  T
} from './Combinator'
export {
  compose,
  meld,
  pipe
} from './Composition'
export {
  either,
  Either,
  eitherToMaybe,
  encaseEither,
  encaseEither2_,
  encaseEither2,
  encaseEither3_,
  encaseEither3,
  fromEither,
  isLeft,
  isRight,
  Left,
  lefts,
  Right,
  rights,
  toEither,
} from './Either'
export {
  flip,
  lift,
  lift2,
  lift3
} from './Function'
export {
  even,
  odd
} from './Integer'
export {
  at,
  concat,
  drop,
  dropLast,
  head,
  indexOf,
  init,
  last,
  lastIndexOf,
  reverse,
  slice,
  tail,
  take,
  takeLast
} from './List'
export {
  allPass,
  anyPass,
  ifElse,
  not
} from './Logic'
export {
  encase,
  encase2,
  encase2_,
  encase3,
  encase3_,
  fromMaybe,
  isJust,
  isNothing,
  justs,
  Just,
  mapMaybe,
  Maybe,
  maybe,
  maybeToEither,
  maybeToNullable,
  Nothing,
  toMaybe
} from './Maybe'
export {
  add,
  dec,
  div,
  inc,
  max,
  mean,
  min,
  mult,
  negate,
  product,
  sub,
  sum
} from './Number'
export {
  get,
  gets,
  keys,
  pairs,
  prop,
  values
} from './Object'
export {
  parseDate,
  parseFloat,
  parseInt,
  parseJson
} from './Parse'
export {
  match,
  regex,
  regexEscape,
  test
} from './RegExp'
export {
  lines,
  toLower,
  toUpper,
  trim,
  unlines,
  unwords,
  words
} from './String'

// export default {
//   //
//   EitherType: $Either,
//   MaybeType: $Maybe,
//
//   // Alternative
//   and,
//   or,
//   xor,
//
//   // Array
//   append,
//   find,
//   pluck,
//   prepend,
//   range,
//   reduce,
//   reduce_,
//   unfoldr,
//
//   // Classify,
//   is,
//   type,
//
//   // Combinator,
//   A,
//   B,
//   C,
//   I,
//   K,
//   S,
//   T,
//
//   // Composition,
//   compose,
//   meld,
//   pipe,
//
//   // Either,
//   either,
//   Either,
//   eitherToMaybe,
//   encaseEither,
//   encaseEither2_,
//   encaseEither2,
//   encaseEither3_,
//   encaseEither3,
//   fromEither,
//   isLeft,
//   isRight,
//   Left,
//   lefts,
//   Right,
//   rights,
//
//   // Function
//   flip,
//   lift,
//   lift2,
//   lift3,
//
//   // Integer
//   even,
//   odd,
//
//   // List,
//   at,
//   concat,
//   drop,
//   dropLast,
//   head,
//   indexOf,
//   init,
//   last,
//   lastIndexOf,
//   reverse,
//   slice,
//   tail,
//   take,
//   takeLast,
//
//   // Logic,
//   allPass,
//   anyPass,
//   ifElse,
//   not,
//
//   // Maybe,
//   encase,
//   encase2,
//   encase2_,
//   encase3,
//   encase3_,
//   fromMaybe,
//   isJust,
//   isNothing,
//   Just,
//   justs,
//   mapMaybe,
//   maybe,
//   Maybe,
//   maybeToEither,
//   maybeToNullable,
//   Nothing,
//   toMaybe,
//
//   // Number
//   add,
//   dec,
//   div,
//   inc,
//   max,
//   mean,
//   min,
//   mult,
//   negate,
//   product,
//   sub,
//   sum,
//
//   // Object
//   get,
//   gets,
//   keys,
//   pairs,
//   prop,
//   values,
//
//   // Parse
//   parseDate,
//   parseFloat: _parseFloat,
//   parseInt: _parseInt,
//   parseJson,
//
//   // RegExp
//   match,
//   regex,
//   regexEscape,
//   test,
//
//   // String
//   lines,
//   toLower,
//   toUpper,
//   trim,
//   unlines,
//   unwords,
//   words
// }


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
//. [thrush]:         https://github.com/raganwald-deprecated/homoiconic/blob/master/2008-10-30/thrush.markdown
