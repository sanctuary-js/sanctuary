'use strict';

var throws = require('assert').throws;
var vm = require('vm');

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('gets', function() {

  it('is a ternary function', function() {
    eq(typeof S.gets, 'function');
    eq(S.gets.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.gets([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'gets :: Accessible a => TypeRep -> Array String -> a -> Maybe b\n' +
                   '                        ^^^^^^^\n' +
                   '                           1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘TypeRep’.\n'));

    throws(function() { S.gets(Number, null); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'gets :: Accessible a => TypeRep -> Array String -> a -> Maybe b\n' +
                   '                                   ^^^^^^^^^^^^\n' +
                   '                                        1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array String’.\n'));

    throws(function() { S.gets(Number, [], null); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'gets :: Accessible a => TypeRep -> Array String -> a -> Maybe b\n' +
                   '        ^^^^^^^^^^^^                               ^\n' +
                   '                                                   1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   '‘gets’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n'));
  });

  it('returns a Maybe', function() {
    var obj = {x: {z: 0}, y: 42};
    eq(S.gets(Number, ['x'], obj), S.Nothing);
    eq(S.gets(Number, ['y'], obj), S.Just(42));
    eq(S.gets(Number, ['z'], obj), S.Nothing);
    eq(S.gets(Number, ['x', 'z'], obj), S.Just(0));
    eq(S.gets(Number, ['a', 'b', 'c'], obj), S.Nothing);
    eq(S.gets(Number, [], obj), S.Nothing);
    eq(S.gets(Object, [], obj), S.Just({x: {z: 0}, y: 42}));
  });

  it('does not rely on constructor identity', function() {
    eq(S.gets(RegExp, ['x'], {x: vm.runInNewContext('/.*/')}), S.Just(/.*/));
    eq(S.gets(vm.runInNewContext('RegExp'), ['x'], {x: /.*/}), S.Just(/.*/));
  });

  it('is curried', function() {
    eq(S.gets(Number).length, 2);
    eq(S.gets(Number)(['x']).length, 1);
    eq(S.gets(Number)(['x'])({x: 42}), S.Just(42));
  });

});
