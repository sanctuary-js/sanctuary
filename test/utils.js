'use strict';

var assert = require('assert');

var R = require('ramda');

var S = require('../index.js');


//      area :: Number -> Number -> Number -> Number !
exports.area = function(a) {
  return function(b) {
    return function(c) {
      if (Math.max(a, b, c) < (a + b + c) / 2) {
        var s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
      } else {
        throw new Error('Impossible triangle');
      }
    };
  };
};

var eq = exports.eq = function(actual, expected) {
  assert.strictEqual(arguments.length, 2);
  assert.strictEqual(R.toString(actual), R.toString(expected));
};

//      errorEq :: TypeRep a -> String -> Error -> Boolean
exports.errorEq = R.curry(function(type, message, error) {
  return error.constructor === type && error.message === message;
});

//      factorial :: Number -> Number !
var factorial = exports.factorial = function(n) {
  if (n < 0) {
    throw new Error('Cannot determine factorial of negative number');
  } else if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
};

//      parseHex :: String -> Either String Number
exports.parseHex = function(s) {
  var n = parseInt(s, 16);
  return n !== n ? S.Left('Invalid hexadecimal string') : S.Right(n);
};

//      rem :: Number -> Number -> Number !
exports.rem = function(x) {
  return function(y) {
    if (y === 0) {
      throw new Error('Cannot divide by zero');
    } else {
      return x % y;
    }
  };
};

//      highArity :: a -> ((b, c, d) -> b)
exports.highArity = function(a) {
  return function(b, c, d) {
    return b;
  };
};

exports.runCompositionTests = function(compose) {

  /* globals it */
  it('is a ternary function', function() {
    eq(typeof compose, 'function');
    eq(compose.length, 3);
  });

  it('composes two functions assumed to be unary', function() {
    eq(compose(R.map(Math.sqrt), JSON.parse, '[1, 4, 9]'), [1, 2, 3]);
  });

  it('is curried', function() {
    eq(compose(R.map(Math.sqrt)).length, 2);
    eq(compose(R.map(Math.sqrt))(JSON.parse).length, 1);
    eq(compose(R.map(Math.sqrt))(JSON.parse)('[1, 4, 9]'), [1, 2, 3]);
  });

};

//      square :: Number -> Number
exports.square = function(n) { return n * n; };

//      squareRoot :: Number -> Either String Number
exports.squareRoot = function(n) {
  return n < 0 ? S.Left('Cannot represent square root of negative number')
    : S.Right(Math.sqrt(n));
};

