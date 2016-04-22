'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('unfoldr', function() {

  it('is a binary function', function() {
    eq(typeof S.unfoldr, 'function');
    eq(S.unfoldr.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.unfoldr(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'unfoldr :: Function -> b -> Array a\n' +
                   '           ^^^^^^^^\n' +
                   '              1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('correctly unfolds a value into a list', function() {
    var f = function(n) {
      return n >= 5 ? S.Nothing() : S.Just([n, n + 1]);
    };
    eq(S.unfoldr(f, 5), []);
    eq(S.unfoldr(f, 4), [4]);
    eq(S.unfoldr(f, 1), [1, 2, 3, 4]);
  });

});
