'use strict';
var throws = require('assert').throws;
var vm = require('vm');

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('get', function() {

  it('is a ternary function', function() {
    eq(typeof S.get, 'function');
    eq(S.get.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.get([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'get :: Accessible a => TypeRep -> String -> a -> Maybe b\n' +
                   '                       ^^^^^^^\n' +
                   '                          1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘TypeRep’.\n'));

    throws(function() { S.get(Number, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'get :: Accessible a => TypeRep -> String -> a -> Maybe b\n' +
                   '                                  ^^^^^^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));

    throws(function() { S.get(Number, 'x', null); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'get :: Accessible a => TypeRep -> String -> a -> Maybe b\n' +
                   '       ^^^^^^^^^^^^                         ^\n' +
                   '                                            1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   '‘get’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n'));
  });

  it('returns a Maybe', function() {
    var obj = {x: 0, y: 42};
    eq(S.get(Number, 'x', obj), S.Just(0));
    eq(S.get(Number, 'y', obj), S.Just(42));
    eq(S.get(Number, 'z', obj), S.Nothing());
    eq(S.get(String, 'x', obj), S.Nothing());
  });

  it('does not rely on constructor identity', function() {
    eq(S.get(RegExp, 'x', {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
    eq(S.get(vm.runInNewContext('RegExp'), 'x', {x: /.*/}), S.Just(/.*/));
  });

  it('is curried', function() {
    eq(S.get(Number).length, 2);
    eq(S.get(Number)('x').length, 1);
    eq(S.get(Number)('x')({x: 42}), S.Just(42));
  });

});
