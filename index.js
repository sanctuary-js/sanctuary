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
//. ### List pseudotype
//.
//. The List pseudotype represents non-Function values with numeric `length`
//. properties greater than or equal to zero, such as `[1, 2, 3]` and `'foo'`.
//.
//. ### RegexFlags pseudotype
//.
//. The RegexFlags pseudotype represents the set of canonical [RegExp][] flags:
//.
//.   - `''`
//.   - `'g'`
//.   - `'i'`
//.   - `'m'`
//.   - `'gi'`
//.   - `'gm'`
//.   - `'im'`
//.   - `'gim'`
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
//. ## API

/* global define, self */

;(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module !== 'undefined') {
    module.exports = f(require('ramda'));
  } else if (typeof define === 'function' && define.amd != null) {
    define(['ramda'], f);
  } else {
    self.sanctuary = f(self.R);
  }

}(function(R) {

  'use strict';

  var S = {};

  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;

  var _ = R.__;

  //  placeholder :: a -> Boolean
  var placeholder = function(x) {
    return x != null && x['@@functional/placeholder'] === true;
  };

  //  functionName :: TypeRep a -> String
  var functionName = R.compose(R.nth(1), R.match(/^function (\w*)/), String);

  var formatters = {
    '{}': R.identity,
    '{card}': R.ifElse(R.lte(_, 10),
                       R.nth(_, ['zero', 'one', 'two', 'three', 'four', 'five',
                                 'six', 'seven', 'eight', 'nine', 'ten']),
                       String),
    '{ord}': R.nth(_, ['first', 'second', 'third']),
    '{quote}': function(s) { return '\u2018' + s + '\u2019'; },
    '{repr}': R.toString,
    '{type}': functionName
  };

  //  format :: String -> [*] -> String
  var format = R.curry(function(template, values) {
    var idx = -1;
    return template.replace(/[{].*?[}]/g, function(match) {
      return formatters[match](values[idx += 1]);
    });
  });

  var Accessible = /* istanbul ignore next */ function Accessible() {};
  var Integer = /* istanbul ignore next */ function Integer() {};
  var List = /* istanbul ignore next */ function List() {};
  var RegexFlags = /* istanbul ignore next */ function RegexFlags() {};
  var TypeRep = /* istanbul ignore next */ function TypeRep() {};
  var a = {name: 'a'};
  var b = {name: 'b'};
  var c = {name: 'c'};

  //  _type :: a -> String
  var _type = function(x) {
    return x != null && R.type(x['@@type']) === 'String' ? x['@@type']
                                                         : R.type(x);
  };

  //  _is :: (TypeRep a, b) -> Boolean
  var _is = function(type, x) {
    return (
      x == null ?
        false :
      type === Accessible ?
        true :
      type === Integer ?
        R.type(x) === 'Number' &&
        Math.floor(x) === Number(x) &&
        x >= MIN_SAFE_INTEGER &&
        x <= MAX_SAFE_INTEGER :
      type === List ?
        R.type(x) !== 'Function' &&
        R.type(x.length) === 'Number' &&
        x.length >= 0 :
      type === RegexFlags ?
        R.test(/^g?i?m?$/, x) :
      type === TypeRep ?
        R.type(x) === 'Function' :
      R.type(type.prototype['@@type']) === 'String' ?
        x['@@type'] === type.prototype['@@type'] :
      // else
        R.type(x) === functionName(type)
    );
  };

  var arity = function(n, f) {
    switch (n) {
      case 0: return function() { return f.apply(this, arguments); };
      case 1: return function(a) { return f.apply(this, arguments); };
      case 2: return function(a, b) { return f.apply(this, arguments); };
      case 3: return function(a, b, c) { return f.apply(this, arguments); };
    }
  };

  //  curry :: (String, [TypeRep *], [*], Function) -> Function
  var curry = function(name, types, _values, f) {
    return arity(R.filter(placeholder, _values).length, function() {
      var values = _values;  // Locally scoped variable to update.

      //  The indexes of the parameters yet to be provided. For example,
      //  ternary(R.__, 'bar') awaits its first and third parameters, so
      //  paramIndexes would be [0, 2] in this case.
      var paramIndexes = [];
      for (var idx = 0; idx < values.length; idx += 1) {
        if (placeholder(values[idx])) {
          paramIndexes.push(idx);
        }
      }

      if (arguments.length > paramIndexes.length) {
        throw new TypeError(format(
          '{quote} requires {card} {}; received {card} arguments',
          [name, values.length, values.length === 1 ? 'argument' : 'arguments',
           values.length + arguments.length - paramIndexes.length]
        ));
      }

      for (var argIndex = 0; argIndex < arguments.length; argIndex += 1) {
        var arg = arguments[argIndex];
        var paramIndex = paramIndexes[argIndex];
        var type = types[paramIndex];

        if (placeholder(arg)) {
          continue;
        } else if (type === a || type === b || type === c) {
          for (idx = 0; idx < values.length; idx += 1) {
            var val = values[idx];
            if (types[idx] === type && !placeholder(val) &&
                _type(val) !== _type(arg)) {
              throw new TypeError(format(
                '{quote} requires its {ord} and {ord} arguments ' +
                'to be of the same type; {repr} and {repr} are not',
                paramIndex > idx ? [name, idx, paramIndex, val, arg]
                                 : [name, paramIndex, idx, arg, val]
              ));
            }
          }
        } else if (type === Accessible) {
          if (arg == null) {
            throw new TypeError(format(
              'The {ord} argument to {quote} cannot be null or undefined',
              [paramIndex, name]
            ));
          }
        } else if (!_is(type, arg)) {
          throw new TypeError(format(
            '{quote} requires a value of type {type} as its {ord} argument; ' +
            'received {repr}',
            [name, type, paramIndex, arg]
          ));
        }
        values = R.update(paramIndex, arg, values);
      }

      var args = R.reject(placeholder, values);
      return args.length === values.length ? f.apply(this, args)
                                           : curry(name, types, values, f);
    });
  };

  var def = function(name, types, f) {
    return curry(name, types, R.map(function() { return _; }, types), f);
  };

  var compose2 = function(f, g) {
    return function(x) {
      return f(g(x));
    };
  };

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

  var assertMethodExists = function(method, x) {
    if (x == null || typeof x[method] !== 'function') {
      throw new TypeError(format(
        '{repr} does not have {} {quote} method',
        [x, R.test(/^[aeiou]/i, method) ? 'an' : 'a', method]
      ));
    }
  };

  //  invoke :: String -> [*] -> Accessible -> *
  var invoke = R.curry(function(method, args, x) {
    assertMethodExists(method, x);
    return x[method].apply(x, args);
  });

  //  negativeZero :: a -> Boolean
  var negativeZero = R.either(R.equals(-0),
                              R.equals(new Number(-0)));  // jshint ignore:line

  var self = function() { return this; };

  var toString = function(name) {
    return def(name + '#toString', [], function() {
      return name + '(' + R.toString(this.value) + ')';
    });
  };

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
  S.type = def('type', [a], _type);

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
  var is = S.is = def('is', [TypeRep, a], _is);

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
  var I = S.I = def('I', [a], function(x) { return x; });

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
  S.K = def('K', [a, b], function(x, y) { return x; });

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
  //. See also [`pipe`](#pipe).
  //.
  //. ```javascript
  //. > S.compose(Math.sqrt, R.inc)(99)
  //. 10
  //. ```
  var compose = S.compose =
  def('compose', [Function, Function, a], function(f, g, x) {
    return f(g(x));
  });

  //# pipe :: [(a -> b), (b -> c), ..., (m -> n)] -> a -> n
  //.
  //. Takes a list of functions assumed to be unary and a value of any type,
  //. and returns the result of applying the sequence of transformations to
  //. the initial value.
  //.
  //. In general terms, `pipe` performs left-to-right composition of a list
  //. of functions. `pipe([f, g, h], x)` is equivalent to `h(g(f(x)))`.
  //.
  //. See also [`meld`](#meld).
  //.
  //. ```javascript
  //. > S.pipe([R.inc, Math.sqrt, R.dec])(99)
  //. 9
  //. ```
  S.pipe = def('pipe', [List, a], function(fs, x) {
    return R.reduceRight(compose2, I, fs)(x);
  });

  //# meld :: [** -> *] -> (* -> * -> ... -> *)
  //.
  //. Takes a list of non-nullary functions and returns a curried function
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
  //. > S.meld([Math.pow, R.subtract])(3, 4, 5)
  //. 76
  //.
  //. > S.meld([Math.pow, R.subtract])(3)(4)(5)
  //. 76
  //. ```
  S.meld = def('meld', [List], function(fs) {
    return R.curryN(1 + R.sum(R.map(R.length, fs)) - fs.length, function() {
      var args = Array.prototype.slice.call(arguments);
      for (var idx = 0; idx < fs.length; idx += 1) {
        args.unshift(fs[idx].apply(this, args.splice(0, fs[idx].length)));
      }
      return args[0];
    });
  });

  //. ### Maybe type

  //# Maybe :: TypeRep Maybe
  //.
  //. The Maybe type represents optional values: a value of type `Maybe a` is
  //. either a Just whose value is of type `a` or a Nothing (with no value).
  //.
  //. The Maybe type satisfies the [Monoid][], [Monad][], [Foldable][], and
  //. [Extend][] specifications.
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
  Maybe.empty = def('Maybe.empty', [], function() {
    return Nothing();
  });

  //# Maybe.of :: a -> Maybe a
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Maybe.of(42)
  //. Just(42)
  //. ```
  Maybe.of = def('Maybe.of', [a], function(x) {
    return Just(x);
  });

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
  Maybe.prototype.empty = def('Maybe#empty', [], Maybe.empty);

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
  Maybe.prototype.filter = def('Maybe#filter', [Function], function(pred) {
    return filter(pred, this);
  });

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
  //. > S.Just([1, 2, 3]).map(R.sum)
  //. Just(6)
  //. ```

  //# Maybe#of :: Maybe a ~> b -> Maybe b
  //.
  //. Takes a value of any type and returns a Just with the given value.
  //.
  //. ```javascript
  //. > S.Nothing().of(42)
  //. Just(42)
  //. ```
  Maybe.prototype.of = def('Maybe#of', [a], Maybe.of);

  //# Maybe#reduce :: Maybe a ~> (b -> a -> b) -> b -> b
  //.
  //. Takes a function and an initial value of any type, and returns:
  //.
  //.   - the initial value if `this` is a Nothing; otherwise
  //.
  //.   - the result of applying the function to the initial value and this
  //.     Just's value.
  //.
  //. ```javascript
  //. > S.Nothing().reduce(R.add, 10)
  //. 10
  //.
  //. > S.Just(5).reduce(R.add, 10)
  //. 15
  //. ```

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
  //. 'Nothing()'
  //.
  //. > S.Just([1, 2, 3]).toString()
  //. 'Just([1, 2, 3])'
  //. ```

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

  //  Nothing#isNothing :: Boolean
  Nothing.prototype.isNothing = true;

  //  Nothing#isJust :: Boolean
  Nothing.prototype.isJust = false;

  //  Nothing#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
  Nothing.prototype.ap = def('Nothing#ap', [Maybe], self);

  //  Nothing#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  Nothing.prototype.chain = def('Nothing#chain', [Function], self);

  //  Nothing#concat :: Maybe a ~> Maybe a -> Maybe a
  Nothing.prototype.concat = def('Nothing#concat', [Maybe], function(maybe) {
    if (maybe.isJust) {
      assertMethodExists('concat', maybe.value);
    }
    return maybe;
  });

  //  Nothing#equals :: Maybe a ~> b -> Boolean
  Nothing.prototype.equals = def('Nothing#equals', [a], function(x) {
    return _type(x) === 'sanctuary/Maybe' && x.isNothing;
  });

  //  Nothing#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
  Nothing.prototype.extend = def('Nothing#extend', [Function], self);

  //  Nothing#map :: Maybe a ~> (a -> b) -> Maybe b
  Nothing.prototype.map = def('Nothing#map', [Function], self);

  //  Nothing#reduce :: Maybe a ~> (b -> a -> b) -> b -> b
  Nothing.prototype.reduce =
    def('Nothing#reduce', [Function, a], function(f, z) { return z; });

  //  Nothing#toBoolean :: Maybe a ~> Boolean
  Nothing.prototype.toBoolean = def('Nothing#toBoolean', [], R.always(false));

  //  Nothing#toString :: Maybe a ~> String
  Nothing.prototype.toString = def('Nothing#toString', [],
                                   R.always('Nothing()'));

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

  //  Just#isNothing :: Boolean
  Just.prototype.isNothing = false;

  //  Just#isJust :: Boolean
  Just.prototype.isJust = true;

  //  Just#ap :: Maybe (a -> b) ~> Maybe a -> Maybe b
  Just.prototype.ap = def('Just#ap', [Maybe], function(maybe) {
    return maybe.map(this.value);
  });

  //  Just#chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  Just.prototype.chain = def('Just#chain', [Function], function(f) {
    return f(this.value);
  });

  //  Just#concat :: Maybe a ~> Maybe a -> Maybe a
  Just.prototype.concat = def('Just#concat', [Maybe], function(maybe) {
    assertMethodExists('concat', this.value);
    if (maybe.isJust) {
      assertMethodExists('concat', maybe.value);
      return Just(this.value.concat(maybe.value));
    } else {
      return this;
    }
  });

  //  Just#equals :: Maybe a ~> b -> Boolean
  Just.prototype.equals = def('Just#equals', [a], function(x) {
    return _type(x) === 'sanctuary/Maybe' && x.isJust &&
           R.eqProps('value', x, this);
  });

  //  Just#extend :: Maybe a ~> (Maybe a -> a) -> Maybe a
  Just.prototype.extend = def('Just#extend', [Function], function(f) {
    return Just(f(this));
  });

  //  Just#map :: Maybe a ~> (a -> b) -> Maybe b
  Just.prototype.map = def('Just#map', [Function], function(f) {
    return Just(f(this.value));
  });

  //  Just#reduce :: Maybe a ~> (b -> a -> b) -> b -> b
  Just.prototype.reduce = def('Just#reduce', [Function, a], function(f, z) {
    return f(z, this.value);
  });

  //  Just#toBoolean :: Maybe a ~> Boolean
  Just.prototype.toBoolean = def('Just#toBoolean', [], R.always(true));

  //  Just#toString :: Maybe a ~> String
  Just.prototype.toString = toString('Just');

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
  S.isNothing = def('isNothing', [Maybe], R.prop('isNothing'));

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
  S.isJust = def('isJust', [Maybe], R.prop('isJust'));

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
  var fromMaybe = S.fromMaybe =
  def('fromMaybe', [a, Maybe], function(x, maybe) {
    return maybe.isJust ? maybe.value : x;
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
  var toMaybe = S.toMaybe =
  def('toMaybe', [a], R.ifElse(R.isNil, Nothing, Just));

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
  def('maybe', [a, Function, Maybe], function(x, f, maybe) {
    return fromMaybe(x, maybe.map(f));
  });

  //# catMaybes :: [Maybe a] -> [a]
  //.
  //. Takes a list of Maybes and returns a list containing each Just's value.
  //.
  //. ```javascript
  //. > S.catMaybes([S.Just('foo'), S.Nothing(), S.Just('baz')])
  //. ['foo', 'baz']
  //. ```
  var catMaybes = S.catMaybes =
  def('catMaybes', [List], R.chain(maybe([], R.of)));

  //# mapMaybe :: (a -> Maybe b) -> [a] -> [b]
  //.
  //. Takes a function and a list, applies the function to each element of
  //. the list, and returns a list of "successful" results. If the result of
  //. applying the function to an element of the list is a Nothing, the result
  //. is discarded; if the result is a Just, the Just's value is included in
  //. the output list.
  //.
  //. In general terms, `mapMaybe` filters a list while mapping over it.
  //.
  //. ```javascript
  //. > S.mapMaybe(S.head, [[], [1, 2, 3], [], [4, 5, 6], []])
  //. [1, 4]
  //. ```
  S.mapMaybe = def('mapMaybe', [Function, List], R.compose(catMaybes, R.map));

  //# encase :: (* -> a) -> (* -> Maybe a)
  //.
  //. Takes a function `f` which may throw and returns a curried function
  //. `g` which will not throw. The result of applying `g` is determined by
  //. applying `f` to the same arguments: if this succeeds, `g` returns Just
  //. the result; otherwise `g` returns Nothing.
  //.
  //. See also [`encaseEither`](#encaseEither).
  //.
  //. ```javascript
  //. > S.encase(eval)('1 + 1')
  //. Just(2)
  //.
  //. > S.encase(eval)('1 +')
  //. Nothing()
  //. ```
  var encase = S.encase = def('encase', [Function], function(f) {
    return R.curryN(f.length, function() {
      try {
        return Just(f.apply(this, arguments));
      } catch (err) {
        return Nothing();
      }
    });
  });

  //. ### Either type

  //# Either :: TypeRep Either
  //.
  //. The Either type represents values with two possibilities: a value of type
  //. `Either a b` is either a Left whose value is of type `a` or a Right whose
  //. value is of type `b`.
  //.
  //. The Either type satisfies the [Semigroup][], [Monad][], and [Extend][]
  //. specifications.
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
  Either.of = def('Either.of', [a], function(x) {
    return Right(x);
  });

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
  //. > S.Right(R.inc).ap(S.Left('Cannot divide by zero'))
  //. Left('Cannot divide by zero')
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

  //# Either#map :: Either a b ~> (b -> c) -> Either a c
  //.
  //. Takes a function and returns `this` if `this` is a Left; otherwise it
  //. returns a Right whose value is the result of applying the function to
  //. this Right's value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').map(R.inc)
  //. Left('Cannot divide by zero')
  //.
  //. > S.Right([1, 2, 3]).map(R.sum)
  //. Right(6)
  //. ```

  //# Either#of :: Either a b ~> b -> Either a b
  //.
  //. Takes a value of any type and returns a Right with the given value.
  //.
  //. ```javascript
  //. > S.Left('Cannot divide by zero').of(42)
  //. Right(42)
  //. ```
  Either.prototype.of = def('Either#of', [a], Either.of);

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
  //. 'Left("Cannot divide by zero")'
  //.
  //. > S.Right([1, 2, 3]).toString()
  //. 'Right([1, 2, 3])'
  //. ```

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
  var Left = S.Left = function Left(value) {
    if (!(this instanceof Left)) {
      return new Left(value);
    }
    this.value = value;
  };
  extend(Left, Either);

  //  Left#isLeft :: Boolean
  Left.prototype.isLeft = true;

  //  Left#isRight :: Boolean
  Left.prototype.isRight = false;

  //  Left#ap :: Either a (b -> c) ~> Either a b -> Either a c
  Left.prototype.ap = def('Left#ap', [Either], self);

  //  Left#chain :: Either a b ~> (b -> Either a c) -> Either a c
  Left.prototype.chain = def('Left#chain', [Function], self);

  //  Left#concat :: Either a b ~> Either a b -> Either a b
  Left.prototype.concat = def('Left#concat', [Either], function(either) {
    assertMethodExists('concat', this.value);
    assertMethodExists('concat', either.value);
    return either.isLeft ? Left(this.value.concat(either.value)) : either;
  });

  //  Left#equals :: Either a b ~> c -> Boolean
  Left.prototype.equals = def('Left#equals', [a], function(x) {
    return _type(x) === 'sanctuary/Either' && x.isLeft &&
           R.eqProps('value', x, this);
  });

  //  Left#extend :: Either a b ~> (Either a b -> b) -> Either a b
  Left.prototype.extend = def('Left#extend', [Function], self);

  //  Left#map :: Either a b ~> (b -> c) -> Either a c
  Left.prototype.map = def('Left#map', [Function], self);

  //  Left#toBoolean :: Either a b ~> Boolean
  Left.prototype.toBoolean = def('Left#toBoolean', [], R.always(false));

  //  Left#toString :: Either a b ~> String
  Left.prototype.toString = toString('Left');

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

  //  Right#isLeft :: Boolean
  Right.prototype.isLeft = false;

  //  Right#isRight :: Boolean
  Right.prototype.isRight = true;

  //  Right#ap :: Either a (b -> c) ~> Either a b -> Either a c
  Right.prototype.ap = def('Right#ap', [Either], function(either) {
    return either.map(this.value);
  });

  //  Right#chain :: Either a b ~> (b -> Either a c) -> Either a c
  Right.prototype.chain = def('Right#chain', [Function], function(f) {
    return f(this.value);
  });

  //  Right#concat :: Either a b ~> Either a b -> Either a b
  Right.prototype.concat = def('Right#concat', [Either], function(either) {
    assertMethodExists('concat', this.value);
    assertMethodExists('concat', either.value);
    return either.isRight ? Right(this.value.concat(either.value)) : this;
  });

  //  Right#equals :: Either a b ~> c -> Boolean
  Right.prototype.equals = def('Right#equals', [a], function(x) {
    return _type(x) === 'sanctuary/Either' && x.isRight &&
           R.eqProps('value', x, this);
  });

  //  Right#extend :: Either a b ~> (Either a b -> b) -> Either a b
  Right.prototype.extend = def('Right#extend', [Function], function(f) {
    return Right(f(this));
  });

  //  Right#map :: Either a b ~> (b -> c) -> Either a c
  Right.prototype.map = def('Right#map', [Function], function(f) {
    return Right(f(this.value));
  });

  //  Right#toBoolean :: Either a b ~> Boolean
  Right.prototype.toBoolean = def('Right#toBoolean', [], R.always(true));

  //  Right#toString :: Either a b ~> String
  Right.prototype.toString = toString('Right');

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
  S.isLeft = def('isLeft', [Either], R.prop('isLeft'));

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
  S.isRight = def('isRight', [Either], R.prop('isRight'));

  //# either :: (a -> c) -> (b -> c) -> Either a b -> c
  //.
  //. Takes two functions and an Either, and returns the result of
  //. applying the first function to the Left's value, if the Either
  //. is a Left, or the result of applying the second function to the
  //. Right's value, if the Either is a Right.
  //.
  //. ```javascript
  //. > S.either(R.toUpper, R.toString, S.Left('Cannot divide by zero'))
  //. 'CANNOT DIVIDE BY ZERO'
  //.
  //. > S.either(R.toUpper, R.toString, S.Right(42))
  //. '42'
  //. ```
  S.either =
  def('either', [Function, Function, Either], function(l, r, either) {
    return either.isLeft ? l(either.value) : r(either.value);
  });

  //# encaseEither :: (Error -> a) -> (* -> b) -> (* -> Either a b)
  //.
  //. Takes two functions, `f` and `g`, the second of which may throw,
  //. and returns a curried function of the same arity as `g` which will
  //. not throw. The result of applying this function is determined by
  //. applying `g` to the same arguments: if this succeeds, the return
  //. value is a Right whose value is the result; otherwise the return
  //. value is a Left whose value is the result of applying `f` to the
  //. caught Error object.
  //.
  //. See also [`encase`](#encase).
  //.
  //. ```javascript
  //. > S.encaseEither(R.identity, Array)(0)
  //. Right([])
  //.
  //. > S.encaseEither(R.identity, Array)(-1)
  //. Left(new RangeError('Invalid array length'))
  //.
  //. > S.encaseEither(R.prop('message'), Array)(-1)
  //. Left('Invalid array length')
  //. ```
  S.encaseEither = def('encaseEither', [Function, Function], function(f, g) {
    return R.curryN(g.length, function() {
      try {
        return Right(g.apply(this, arguments));
      } catch (err) {
        return Left(f(err));
      }
    });
  });

  //# maybeToEither :: a -> Maybe b -> Either a b
  //.
  //. Takes a value of any type and a Maybe, and returns an Either.
  //. If the second argument is a Nothing, a Left containing the first
  //. argument is returned. If the second argument is a Just, a Right
  //. containing the Just's value is returned.
  //.
  //. ```javascript
  //. > S.maybeToEither('Expecting an integer', S.parseInt(10, 'xyz'))
  //. Left('Expecting an integer')
  //.
  //. > S.maybeToEither('Expecting an integer', S.parseInt(10, '42'))
  //. Right(42)
  //. ```
  S.maybeToEither = def('maybeToEither', [a, Maybe], function(x, maybe) {
    return maybe.isNothing ? Left(x) : Right(maybe.value);
  });

  //. ### Control

  //  toBoolean :: * -> Boolean
  var toBoolean = function(x) {
    switch (R.type(x)) {
      case 'Array':     return x.length > 0;
      case 'Boolean':   return x.valueOf();
      default:          return invoke('toBoolean', [], x);
    }
  };

  //  empty :: a -> a
  var empty = function(x) {
    switch (R.type(x)) {
      case 'Array':     return [];
      case 'Boolean':   return false;
      default:          return invoke('empty', [], x);
    }
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
  S.and = def('and', [a, a], function(x, y) {
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
  var or = S.or = def('or', [a, a], function(x, y) {
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
  S.xor = def('xor', [a, a], function(x, y) {
    var xBool = toBoolean(x);
    var yBool = toBoolean(y);
    var xEmpty = empty(x);
    return xBool !== yBool ? or(x, y) : xEmpty;
  });

  //. ### Number
  //. divide :: Number -> Number -> Maybe Number
  //.
  //. Divides two numbers, returns Nothing if the divisor is zero; Just
  //. the result otherwise.
  //.
  //. ```javascript
  //. > S.divide(20, 5)
  //. Just(4)
  //.
  //. > S.divide(21, 5)
  //. Just(4.2)
  //. ```
  //. > S.divide(5, 0)
  //. Nothing()
  //. ```
  S.divide = R.curry(function(a, b) {
    return b === 0 ? Nothing() : Just(a / b);
  });

  //. ### List

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
  def('slice', [Integer, Integer, List], function(start, end, xs) {
    var len = xs.length;
    var startIdx = negativeZero(start) ? len : start < 0 ? start + len : start;
    var endIdx = negativeZero(end) ? len : end < 0 ? end + len : end;

    return (Math.abs(start) <= len && Math.abs(end) <= len && startIdx <= endIdx) ?
      Just(R.slice(startIdx, endIdx, xs)) :
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
  var at = S.at = def('at', [Integer, List], function(n, xs) {
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
  S.head = def('head', [List], at(0));

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
  S.last = def('last', [List], at(-1));

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
  S.tail = def('tail', [List], slice(1, -0));

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
  S.init = def('init', [List], slice(0, -1));

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
  S.take = def('take', [Integer, List], function(n, xs) {
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
  S.takeLast = def('takeLast', [Integer, List], function(n, xs) {
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
  S.drop = def('drop', [Integer, List], function(n, xs) {
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
  S.dropLast = def('dropLast', [Integer, List], function(n, xs) {
    return n < 0 || negativeZero(n) ? Nothing() : slice(0, -n, xs);
  });

  //# find :: (a -> Boolean) -> [a] -> Maybe a
  //.
  //. Takes a predicate and a list and returns Just the leftmost element of
  //. the list which satisfies the predicate; Nothing if none of the list's
  //. elements satisfies the predicate.
  //.
  //. ```javascript
  //. > S.find(n => n < 0, [1, -2, 3, -4, 5])
  //. Just(-2)
  //.
  //. > S.find(n => n < 0, [1, 2, 3, 4, 5])
  //. Nothing()
  //. ```
  S.find = def('find', [Function, List], function(pred, xs) {
    for (var idx = 0, len = xs.length; idx < len; idx += 1) {
      if (pred(xs[idx])) {
        return Just(xs[idx]);
      }
    }
    return Nothing();
  });

  var sanctifyIndexOf = function(name) {
    return def(name, [a, List], R.pipe(R[name], Just, R.filter(R.gte(_, 0))));
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

  //# pluck :: TypeRep a -> String -> [Accessible] -> [Maybe a]
  //.
  //. Takes a [type representative](#type-representatives), a property name,
  //. and a list of objects and returns a list of equal length. Each element
  //. of the output list is Just the value of the specified property of the
  //. corresponding object if the value is of the specified type (according
  //. to [`is`](#is)); Nothing otherwise.
  //.
  //. See also [`get`](#get).
  //.
  //. ```javascript
  //. > S.pluck(Number, 'x', [{x: 1}, {x: 2}, {x: '3'}, {x: null}, {}])
  //. [Just(1), Just(2), Nothing(), Nothing(), Nothing()]
  //. ```
  S.pluck = def('pluck', [TypeRep, String, List], function(type, key, xs) {
    return R.map(get(type, key), xs);
  });

  //# unfoldr :: (b -> Maybe (a, b)) -> b -> [a]
  //.
  //. Takes a function and a seed value, and returns a list generated by
  //. applying the function repeatedly. The list is initially empty. The
  //. function is initially applied to the seed value. Each application
  //. of the function should result in either:
  //.
  //.   - a Nothing, in which case the list is returned; or
  //.
  //.   - Just a pair, in which case the first element is appended to
  //.     the list and the function is applied to the second element.
  //.
  //. ```javascript
  //. > S.unfoldr(n => n < 5 ? S.Just([n, n + 1]) : S.Nothing(), 1)
  //. [1, 2, 3, 4]
  //. ```
  S.unfoldr = def('unfoldr', [Function, a], function(f, x) {
    var result = [];
    var m = f(x);
    while (m.isJust) {
      result.push(m.value[0]);
      m = f(m.value[1]);
    }
    return result;
  });

  //. ### Object

  //# get :: TypeRep a -> String -> Accessible -> Maybe a
  //.
  //. Takes a [type representative](#type-representatives), a property
  //. name, and an object and returns Just the value of the specified object
  //. property if it is of the specified type (according to [`is`](#is));
  //. Nothing otherwise.
  //.
  //. The `Object` type representative may be used as a catch-all since most
  //. values have `Object.prototype` in their prototype chains.
  //.
  //. See also [`gets`](#gets).
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
  def('get', [TypeRep, String, Accessible], function(type, key, obj) {
    return filter(is(type), Just(obj[key]));
  });

  //# gets :: TypeRep a -> [String] -> Accessible -> Maybe a
  //.
  //. Takes a [type representative](#type-representatives), a list of property
  //. names, and an object and returns Just the value at the path specified by
  //. the list of property names if such a path exists and the value is of the
  //. specified type; Nothing otherwise.
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
  S.gets = def('gets', [TypeRep, List, Accessible], function(type, keys, obj) {
    var f = function(m, k) { return R.chain(get(Accessible, k), m); };
    return filter(is(type), R.reduce(f, Just(obj), keys));
  });

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
  S.parseDate = def('parseDate', [String], function(s) {
    var d = new Date(s);
    return d.valueOf() === d.valueOf() ? Just(d) : Nothing();
  });

  //  requiredNonCapturingGroup :: [String] -> String
  var requiredNonCapturingGroup = function(xs) {
    return '(?:' + xs.join('|') + ')';
  };

  //  optionalNonCapturingGroup :: [String] -> String
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
  def('parseFloat', [String],
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
  S.parseInt = def('parseInt', [Integer, String], function(radix, s) {
    if (radix < 2 || radix > 36) {
      throw new RangeError('Radix not in [2 .. 36]');
    }

    var charset = R.take(radix, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');

    return R.pipe(
      Just,
      R.filter(R.pipe(R.replace(/^[+-]/, ''),
                      radix === 16 ? R.replace(/^0x/i, '') : I,
                      R.split(''),
                      R.all(R.pipe(R.toUpper,
                                   R.indexOf(_, charset),
                                   R.gte(_, 0))))),
      R.map(R.partialRight(parseInt, radix)),
      R.filter(is(Integer))
    )(s);
  });

  //# parseJson :: String -> Maybe *
  //.
  //. Takes a string which may or may not be valid JSON, and returns Just
  //. the result of applying `JSON.parse` to the string if valid; Nothing
  //. otherwise.
  //.
  //. ```javascript
  //. > S.parseJson('["foo","bar","baz"]')
  //. Just(['foo', 'bar', 'baz'])
  //.
  //. > S.parseJson('[')
  //. Nothing()
  //. ```
  S.parseJson = def('parseJson', [String], encase(function(s) {
    return JSON.parse(s);
  }));

  //. ### RegExp

  //# regex :: RegexFlags -> String -> RegExp
  //.
  //. Takes a [RegexFlags](#regexflags-pseudotype) and a pattern, and returns
  //. a RegExp.
  //.
  //. ```javascript
  //. > S.regex('g', ':\\d+:')
  //. /:\d+:/g
  //. ```
  S.regex = def('regex', [RegexFlags, String], function(flags, source) {
    return new RegExp(source, flags);
  });

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
  S.test = def('test', [RegExp, String], function(pattern, s) {
    return pattern.test(s);
  });

  //# match :: RegExp -> String -> Maybe [Maybe String]
  //.
  //. Takes a pattern and a string, and returns Just a list of matches
  //. if the pattern matches the string; Nothing otherwise. Each match
  //. has type `Maybe String`, where a Nothing represents an unmatched
  //. optional capturing group.
  //.
  //. ```javascript
  //. > S.match(/(good)?bye/, 'goodbye')
  //. Just([Just('goodbye'), Just('good')])
  //.
  //. > S.match(/(good)?bye/, 'bye')
  //. Just([Just('bye'), Nothing()])
  //. ```
  S.match = def('match', [RegExp, String], function(pattern, s) {
    return R.map(R.map(toMaybe), toMaybe(s.match(pattern)));
  });

  //. ### String

  //# words :: String -> [String]
  //.
  //. Takes a string and returns the list of words the string contains
  //. (words are delimited by whitespace characters).
  //.
  //. See also [`unwords`](#unwords).
  //.
  //. ```javascript
  //. > S.words(' foo bar baz ')
  //. ['foo', 'bar', 'baz']
  //. ```
  S.words =
  def('words', [String], compose(R.reject(R.isEmpty), R.split(/\s+/)));

  //# unwords :: [String] -> String
  //.
  //. Takes a list of words and returns the result of joining the words
  //. with separating spaces.
  //.
  //. See also [`words`](#words).
  //.
  //. ```javascript
  //. > S.unwords(['foo', 'bar', 'baz'])
  //. 'foo bar baz'
  //. ```
  S.unwords = def('unwords', [List], R.join(' '));

  //# lines :: String -> [String]
  //.
  //. Takes a string and returns the list of lines the string contains
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
  def('lines', [String],
      compose(R.match(/^(?=[\s\S]).*/gm), R.replace(/\r\n?/g, '\n')));

  //# unlines :: [String] -> String
  //.
  //. Takes a list of lines and returns the result of joining the lines
  //. after appending a terminating line feed (`'\n'`) to each.
  //.
  //. See also [`lines`](#lines).
  //.
  //. ```javascript
  //. > S.unlines(['foo', 'bar', 'baz'])
  //. 'foo\nbar\nbaz\n'
  //. ```
  S.unlines =
  def('unlines', [List], compose(R.join(''), R.map(R.concat(_, '\n'))));

  return S;

}));

//. [Extend]:       https://github.com/fantasyland/fantasy-land#extend
//. [Foldable]:     https://github.com/fantasyland/fantasy-land#foldable
//. [Monad]:        https://github.com/fantasyland/fantasy-land#monad
//. [Monoid]:       https://github.com/fantasyland/fantasy-land#monoid
//. [R.equals]:     http://ramdajs.com/docs/#equals
//. [R.map]:        http://ramdajs.com/docs/#map
//. [R.type]:       http://ramdajs.com/docs/#type
//. [Ramda]:        http://ramdajs.com/
//. [RegExp]:       https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
//. [Semigroup]:    https://github.com/fantasyland/fantasy-land#semigroup
//. [parseInt]:     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
