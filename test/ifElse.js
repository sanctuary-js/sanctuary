'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('ifElse', function() {

  var lt0 = function(x) { return x < 0; };

  it('is a quaternary function', function() {
    eq(typeof S.ifElse, 'function');
    eq(S.ifElse.length, 4);
  });

  it('type checks its arguments', function() {
    throws(function() { S.ifElse('wrong'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'ifElse :: Function -> Function -> Function -> a -> b\n' +
                   '          ^^^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  "wrong" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.ifElse(lt0, 'wrong'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'ifElse :: Function -> Function -> Function -> a -> b\n' +
                   '                      ^^^^^^^^\n' +
                   '                         1\n' +
                   '\n' +
                   '1)  "wrong" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.ifElse(lt0, Math.abs, 'wrong'); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'ifElse :: Function -> Function -> Function -> a -> b\n' +
                   '                                  ^^^^^^^^\n' +
                   '                                     1\n' +
                   '\n' +
                   '1)  "wrong" :: String\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));
  });

  it('applies the first function when the predicate returns true', function() {
    eq(S.ifElse(lt0, Math.abs, Math.sqrt, -1), 1);
  });

  it('applies the second function when the predicate returns false', function() {
    eq(S.ifElse(lt0, Math.abs, Math.sqrt, 16), 4);
  });

});
