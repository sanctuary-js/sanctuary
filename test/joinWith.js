'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('joinWith', function() {

  it('is a binary function', function() {
    eq(typeof S.joinWith, 'function');
    eq(S.joinWith.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.joinWith(null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'joinWith :: String -> Array String -> String\n' +
                   '            ^^^^^^\n' +
                   '              1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));

    throws(function() { S.joinWith('', [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'joinWith :: String -> Array String -> String\n' +
                   '                            ^^^^^^\n' +
                   '                              1\n' +
                   '\n' +
                   '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));
  });

  it('joins an array of strings with a separator', function() {
    eq(S.joinWith('', ['a', 'b', 'c']), 'abc');
    eq(S.joinWith(':', []), '');
    eq(S.joinWith(':', ['']), '');
    eq(S.joinWith(':', ['', '']), ':');
    eq(S.joinWith(':', ['', 'foo', '']), ':foo:');
    eq(S.joinWith(':', ['foo', 'bar', 'baz']), 'foo:bar:baz');
    eq(S.joinWith('::', ['foo', 'bar', 'baz']), 'foo::bar::baz');
  });

});
