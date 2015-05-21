/*    #######
   ####     ####
 ####   ###   ####
#####   ###########   sanctuary
########   ########   noun
###########   #####   1 [ mass noun ] refuge from unsafe JavaScript
 ####   ###   ####
   ####     ####
      #######    */

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

  //  combinator  ////////////////////////////////////////////////////////////

  //  K :: a -> b -> a
  S.K = R.curry(function(x, y) {
    return x;
  });

  //  maybe  /////////////////////////////////////////////////////////////////

  var Maybe = S.Maybe = function Maybe() {
    throw new Error('Cannot instantiate Maybe');
  };

  //  Maybe.empty :: -> m a
  Maybe.empty = function() {
    return new Nothing();
  };

  //  Maybe.of :: a -> m a
  Maybe.of = function(x) {
    return new Just(x);
  };

  Maybe.prototype.empty = Maybe.empty;

  //  Maybe#filter :: (a -> Boolean) -> m a
  Maybe.prototype.filter = function(pred) {
    return filter(pred, this);
  };

  Maybe.prototype.of = Maybe.of;

  Maybe.prototype.type = Maybe;

  var Nothing = S.Nothing = function Nothing() {
    if (!(this instanceof Nothing)) {
      return new Nothing();
    }
  };
  extend(Nothing, Maybe);

  //  Nothing#ap :: m a -> m b
  Nothing.prototype.ap = function(x) {
    return this;
  };

  //  Nothing#chain :: (a -> m b) -> m b
  Nothing.prototype.chain = function(f) {
    return this;
  };

  //  Nothing#concat :: m a -> m a
  Nothing.prototype.concat = function(maybe) {
    return maybe;
  };

  //  Nothing#equals :: Maybe a -> Boolean
  Nothing.prototype.equals = function(maybe) {
    return maybe instanceof Nothing;
  };

  //  Nothing#map :: (a -> b) -> Maybe b
  Nothing.prototype.map = function(f) {
    return this;
  };

  //  Nothing#toBoolean :: -> Boolean
  Nothing.prototype.toBoolean = function() {
    return false;
  };

  //  Nothing#toString :: -> String
  Nothing.prototype.toString = function() {
    return 'Nothing()';
  };

  var Just = S.Just = function Just(value) {
    if (!(this instanceof Just)) {
      return new Just(value);
    } else {
      this.value = value;
    }
  };
  extend(Just, Maybe);

  //  Just#ap :: m a -> m b
  Just.prototype.ap = function(x) {
    return x.map(this.value);
  };

  //  Just#chain :: (a -> m b) -> m b
  Just.prototype.chain = function(f) {
    return f(this.value);
  };

  //  Just#concat :: m a -> m a
  Just.prototype.concat = function(maybe) {
    return maybe instanceof Just ? Just(this.value.concat(maybe.value)) : this;
  };

  //  Just#equals :: Maybe a -> Boolean
  Just.prototype.equals = function(maybe) {
    return maybe instanceof Just && R.eqProps('value', maybe, this);
  };

  //  Just#map :: (a -> b) -> Maybe b
  Just.prototype.map = function(f) {
    return new Just(f(this.value));
  };

  //  Just#toBoolean :: -> Boolean
  Just.prototype.toBoolean = function() {
    return true;
  };

  //  Just#toString :: -> String
  Just.prototype.toString = function() {
    return 'Just(' + R.toString(this.value) + ')';
  };

  //  fromMaybe :: a -> Maybe a -> a
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

  //  toMaybe :: a? -> Maybe a
  S.toMaybe = R.ifElse(R.isNil, Nothing, Just);

  //  encase :: (* -> a) -> (* -> Maybe a)
  var encase = S.encase = R.curry(function(f) {
    return R.curryN(f.length, function() {
      try {
        return Just(f.apply(this, arguments));
      } catch (err) {
        return Nothing();
      }
    });
  });

  //  either  ////////////////////////////////////////////////////////////////

  var Either = S.Either = function Either() {
    throw new Error('Cannot instantiate Either');
  };

  //  Either.of :: b -> m a b
  Either.of = function(x) {
    return new Right(x);
  };

  Either.prototype.of = Either.of;

  Either.prototype.type = Either;

  var Left = S.Left = function Left(value) {
    if (!(this instanceof Left)) {
      return new Left(value);
    }
    this.value = value;
  };
  extend(Left, Either);

  //  Left#ap :: m a -> m b
  Left.prototype.ap = function(x) {
    return this;
  };

  //  Left#chain :: (a -> m b) -> m b
  Left.prototype.chain = function(f) {
    return this;
  };

  //  Left#concat :: Either a b -> Either a b
  Left.prototype.concat = function(either) {
    return R.is(Left, either) ? Left(this.value.concat(either.value)) : either;
  };

  //  Left#equals :: Either a b -> Boolean
  Left.prototype.equals = function(either) {
    return either instanceof Left && R.eqProps('value', either, this);
  };

  //  Left#map :: (b -> c) -> Either a c
  Left.prototype.map = function(f) {
    return this;
  };

  //  Left#toBoolean :: -> Boolean
  Left.prototype.toBoolean = function() {
    return false;
  };

  //  Left#toString :: -> String
  Left.prototype.toString = function() {
    return 'Left(' + R.toString(this.value) + ')';
  };

  var Right = S.Right = function Right(value) {
    if (!(this instanceof Right)) {
      return new Right(value);
    }
    this.value = value;
  };
  extend(Right, Either);

  //  Right#ap :: m a -> m b
  Right.prototype.ap = function(x) {
    return x.map(this.value);
  };

  //  Right#chain :: (a -> m b) -> m b
  Right.prototype.chain = function(f) {
    return f(this.value);
  };

  //  Right#concat :: Either a b -> Either a b
  Right.prototype.concat = function(either) {
    return R.is(Right, either) ? Right(this.value.concat(either.value)) : this;
  };

  //  Right#equals :: Either a b -> Boolean
  Right.prototype.equals = function(either) {
    return either instanceof Right && R.eqProps('value', either, this);
  };

  //  Right#map :: (b -> c) -> Either a c
  Right.prototype.map = function(f) {
    return new Right(f(this.value));
  };

  //  Right#toBoolean :: -> Boolean
  Right.prototype.toBoolean = function() {
    return true;
  };

  //  Right#toString :: -> String
  Right.prototype.toString = function() {
    return 'Right(' + R.toString(this.value) + ')';
  };

  //  either :: (a -> c) -> (b -> c) -> Either a b -> c
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

  //  control  ///////////////////////////////////////////////////////////////

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

  //  and :: a -> a -> a
  S.and = R.curry(function(x, y) {
    assertTypeMatch(x, y);
    return toBoolean(x) ? y : x;
  });

  //  or :: a -> a -> a
  var or = S.or = R.curry(function(x, y) {
    assertTypeMatch(x, y);
    return toBoolean(x) ? x : y;
  });

  //  xor :: a -> a -> a
  S.xor = R.curry(function(x, y) {
    assertTypeMatch(x, y);
    var xBool = toBoolean(x);
    var yBool = toBoolean(y);
    var xEmpty = empty(x);
    return xBool !== yBool ? or(x, y) : xEmpty;
  });

  //  list  //////////////////////////////////////////////////////////////////

  //  at :: Number -> [a] -> Maybe a
  var at = S.at = R.curry(function(n, xs) {
    var len = xs.length;
    var idx = n < 0 ? len + n : n;
    return idx >= 0 && idx < len ? Just(xs[idx]) : Nothing();
  });

  //  head :: [a] -> Maybe a
  S.head = at(0);

  //  last :: [a] -> Maybe a
  S.last = at(-1);

  //  tail :: [a] -> Maybe [a]
  S.tail = R.ifElse(R.isEmpty, Nothing, R.compose(Just, R.tail));

  //  init :: [a] -> Maybe [a]
  S.init = R.ifElse(R.isEmpty, Nothing, R.compose(Just, R.init));

  //  find :: (a -> Boolean) -> [a] -> Maybe a
  S.find = R.curry(function(pred, xs) {
    for (var idx = 0, len = xs.length; idx < len; idx += 1) {
      if (pred(xs[idx])) {
        return Just(xs[idx]);
      }
    }
    return Nothing();
  });

  //. pluck :: String -> [{String: *}] -> [Maybe *]
  //.
  //. Takes a list of objects and plucks the value of the specified key
  //. for each object in the list. Returns the value wrapped in a Just
  //. if an object has the key and a Nothing if it does not.
  //.
  //. ```javascript
  //. > pluck('a', [{a: 1, b: 2}, {a: 4, b: 5}, {b: 3, c: 7}])
  //. [Just(1), Just(4), Nothing()]
  //. ```
  S.pluck = R.curry(function(key, xs) {
    return R.map(get(key), xs);
  });

  //  object  ////////////////////////////////////////////////////////////////

  //  get :: String -> Object -> Maybe *
  var get = S.get = R.ifElse(R.has, R.compose(Just, R.prop), Nothing);

  //  gets :: [String] -> Object -> Maybe *
  S.gets = R.curry(function(keys, obj) {
    return R.reduce(function(acc, key) {
      return R.chain(get(key), acc);
    }, Just(obj), keys);
  });

  //  parse  /////////////////////////////////////////////////////////////////

  //  parseDate :: String -> Maybe Date
  S.parseDate = R.curry(function(s) {
    var d = new Date(s);
    return d.valueOf() === d.valueOf() ? Just(d) : Nothing();
  });

  //  parseFloat :: String -> Maybe Number
  S.parseFloat = R.curry(function(s) {
    var n = parseFloat(s);
    return n === n ? Just(n) : Nothing();
  });

  //  parseInt :: Number -> String -> Maybe Number
  S.parseInt = R.curry(function(radix, s) {
    var n = parseInt(s, radix);
    return n === n ? Just(n) : Nothing();
  });

  //  parseJson :: String -> Maybe *
  S.parseJson = encase(function(s) {
    return JSON.parse(s);
  });

  //  regexp  ////////////////////////////////////////////////////////////////

  //. match :: RegExp -> String -> Maybe [Maybe String]
  //.
  //. Takes a regular expression and tests it against the supplied string
  //. returning a Nothing if there are no matches or a Just containing an
  //. array of Maybe types corresponding to the matches found.
  //.
  //. ```javascript
  //. > S.match(/abcd/, 'abcdefg')
  //. Just([Just("abcd")])
  //.
  //. > S.match(/(good)?bye/, 'bye')
  //. Just([Just("bye"), Nothing()])
  //. ```
  S.match = R.curry(R.compose(R.map(R.map(S.toMaybe)), S.toMaybe, R.match));

}.call(this));
