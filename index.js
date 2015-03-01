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

  var hasOwnProperty_ = Object.prototype.hasOwnProperty;
  var slice_ = Array.prototype.slice;
  var toString_ = Object.prototype.toString;

  var isArray = function(x) {
    return toString_.call(x) === '[object Array]';
  };

  var curry = function(f) {
    var arity = f.length;
    var recurry = function(args) {
      return function() {
        var args2 = args.concat(slice_.call(arguments));
        return args2.length >= arity ? f.apply(this, args2) : recurry(args2);
      };
    };
    return recurry([]);
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

  //  maybe  /////////////////////////////////////////////////////////////////

  function Maybe() {
    throw new Error('Cannot instantiate Maybe');
  }

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

  function Nothing() {
    if (!(this instanceof Nothing)) {
      return new Nothing();
    }
  }
  extend(Nothing, Maybe);

  //  Nothing#ap :: m a -> m b
  Nothing.prototype.ap = function(x) {  // jshint ignore:line
    return this;
  };

  //  Nothing#chain :: (a -> m b) -> m b
  Nothing.prototype.chain = function(f) {  // jshint ignore:line
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

  //  Nothing#or :: Maybe a -> Maybe a
  Nothing.prototype.or = function(maybe) {
    return maybe;
  };

  //  Nothing#map :: (a -> b) -> Maybe b
  Nothing.prototype.map = function(f) {  // jshint ignore:line
    return this;
  };

  function Just(value) {
    if (!(this instanceof Just)) {
      return new Just(value);
    } else {
      this.value = value;
    }
  }
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
    return maybe instanceof Just && maybe.value === this.value;
  };

  //  Just#or :: Maybe a -> Maybe a
  Just.prototype.or = function(maybe) {  // jshint ignore:line
    return this;
  };

  //  Just#map :: (a -> b) -> Maybe b
  Just.prototype.map = function(f) {
    return new Just(f(this.value));
  };

  //  fromMaybe :: a -> Maybe a -> a
  var fromMaybe = curry(function(x, maybe) {
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
  var toMaybe = function(x) {
    return x == null ? Nothing() : Just(x);
  };

  //  encase :: (* -> a) -> (* -> Maybe a)
  var encase = function(f) {
    return function() {
      try {
        return Just(f.apply(this, arguments));
      } catch (err) {
        return Nothing();
      }
    };
  };

  //  either  ////////////////////////////////////////////////////////////////

  function Either() {
    throw new Error('Cannot instantiate Either');
  }

  Either.prototype.type = Either;

  function Left(value) {
    if (!(this instanceof Left)) {
      return new Left(value);
    }
    this.value = value;
  }
  extend(Left, Either);

  //  Left#equals :: Either a b -> Boolean
  Left.prototype.equals = function(either) {
    return either instanceof Left && either.value === this.value;
  };

  //  Left#map :: (b -> c) -> Either a c
  Left.prototype.map = function(f) {  // jshint ignore:line
    return this;
  };

  function Right(value) {
    if (!(this instanceof Right)) {
      return new Right(value);
    }
    this.value = value;
  }
  extend(Right, Either);

  //  Right#equals :: Either a b -> Boolean
  Right.prototype.equals = function(either) {
    return either instanceof Right && either.value === this.value;
  };

  //  Right#map :: (b -> c) -> Either a c
  Right.prototype.map = function(f) {
    return new Right(f(this.value));
  };

  //  either :: (a -> c) -> (b -> c) -> Either a b -> c
  var either = curry(function(l, r, either) {
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

  //  or :: f a -> f a -> f a
  var or = curry(function(x, y) {
    if (toString_.call(x) !== toString_.call(y) || x.type !== y.type) {
      throw new TypeError('Type mismatch');
    } else if (typeof x.or === 'function') {
      return x.or(y);
    } else if (isArray(x)) {
      return x.length > 0 ? x : y;
    } else {
      throw new TypeError('"or" unspecified for ' + x.constructor.name);
    }
  });

  //  list  //////////////////////////////////////////////////////////////////

  //  at :: Number -> [a] -> Maybe a
  var at = curry(function(n, xs) {
    var len = xs.length;
    var idx = n < 0 ? len + n : n;
    return idx >= 0 && idx < len ? Just(xs[idx]) : Nothing();
  });

  //  head :: [a] -> Maybe a
  var head = at(0);

  //  last :: [a] -> Maybe a
  var last = at(-1);

  //  tail :: [a] -> Maybe [a]
  var tail = function(xs) {
    return xs.length > 0 ? Just(slice_.call(xs, 1)) : Nothing();
  };

  //  init :: [a] -> Maybe [a]
  var init = function(xs) {
    return xs.length > 0 ? Just(slice_.call(xs, 0, -1)) : Nothing();
  };

  //  find :: (a -> Boolean) -> [a] -> Maybe a
  var find = curry(function(pred, xs) {
    for (var idx = 0, len = xs.length; idx < len; idx += 1) {
      if (pred(xs[idx])) {
        return Just(xs[idx]);
      }
    }
    return Nothing();
  });

  //  object  ////////////////////////////////////////////////////////////////

  //  get :: String -> Object -> Maybe *
  var get = curry(function(key, obj) {
    return hasOwnProperty_.call(obj, key) ? Just(obj[key]) : Nothing();
  });

  //  parse  /////////////////////////////////////////////////////////////////

  //  parseDate :: String -> Maybe Date
  var parseDate = function(s) {
    var d = new Date(s);
    return d.valueOf() === d.valueOf() ? Just(d) : Nothing();
  };

  //  parseFloat_ :: String -> Maybe Number
  var parseFloat_ = function(s) {
    var n = parseFloat(s);
    return n === n ? Just(n) : Nothing();
  };

  //  parseInt_ :: Number -> String -> Maybe Number
  var parseInt_ = curry(function(radix, s) {
    var n = parseInt(s, radix);
    return n === n ? Just(n) : Nothing();
  });

  //  parseJson :: String -> Maybe *
  var parseJson = encase(JSON.parse);

  //  exports  ///////////////////////////////////////////////////////////////

  var sanctuary = {
    Either: Either,
    Just: Just,
    Left: Left,
    Maybe: Maybe,
    Nothing: Nothing,
    Right: Right,
    at: at,
    either: either,
    encase: encase,
    find: find,
    get: get,
    head: head,
    init: init,
    fromMaybe: fromMaybe,
    last: last,
    or: or,
    parseDate: parseDate,
    parseFloat: parseFloat_,
    parseInt: parseInt_,
    parseJson: parseJson,
    tail: tail,
    toMaybe: toMaybe,
  };

  /* global define, window */

  /* istanbul ignore else */
  if (typeof module !== 'undefined') {
    module.exports = sanctuary;
  } else if (typeof define === 'function' && define.amd) {
    define(sanctuary);
  } else {
    window.sanctuary = sanctuary;
  }

}());
