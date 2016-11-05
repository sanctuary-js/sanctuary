'use strict';

var throws = require('assert').throws;
var vm = require('vm');

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('pluck', function() {

  it('is a ternary function', function() {
    eq(typeof S.pluck, 'function');
    eq(S.pluck.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.pluck([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'pluck :: Accessible a => TypeRep -> String -> Array a -> Array (Maybe b)\n' +
                   '                         ^^^^^^^\n' +
                   '                            1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘TypeRep’.\n'));

    throws(function() { S.pluck(Number, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'pluck :: Accessible a => TypeRep -> String -> Array a -> Array (Maybe b)\n' +
                   '                                    ^^^^^^\n' +
                   '                                      1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));

    throws(function() { S.pluck(Number, 'x', {length: 0}); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'pluck :: Accessible a => TypeRep -> String -> Array a -> Array (Maybe b)\n' +
                   '                                              ^^^^^^^\n' +
                   '                                                 1\n' +
                   '\n' +
                   '1)  {"length": 0} :: Object, StrMap Number, StrMap FiniteNumber, StrMap Integer, StrMap ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Array a’.\n'));
  });

  it('returns a list of satisfactory plucked values', function() {
    var xs = [{x: '1'}, {x: 2}, {x: null}, {x: undefined}, {}];
    eq(S.pluck(Number, 'x', []), []);
    eq(S.pluck(Number, 'x', xs),
       [S.Nothing, S.Just(2), S.Nothing, S.Nothing, S.Nothing]);
  });

  it('does not rely on constructor identity', function() {
    eq(S.pluck(Array, 'x', [{x: vm.runInNewContext('[0]')}]), [S.Just([0])]);
    eq(S.pluck(vm.runInNewContext('Array'), 'x', [{x: [0]}]), [S.Just([0])]);
  });

});
