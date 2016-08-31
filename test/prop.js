'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('prop', function() {

  it('is a binary function', function() {
    eq(typeof S.prop, 'function');
    eq(S.prop.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.prop(1); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'prop :: Accessible a => String -> a -> b\n' +
                   '                        ^^^^^^\n' +
                   '                          1\n' +
                   '\n' +
                   '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘String’.\n'));

    throws(function() { S.prop('a', null); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'prop :: Accessible a => String -> a -> b\n' +
                   '        ^^^^^^^^^^^^              ^\n' +
                   '                                  1\n' +
                   '\n' +
                   '1)  null :: Null\n' +
                   '\n' +
                   '‘prop’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.prop('a', true); },
           errorEq(TypeError,
                   '‘prop’ expected object to have a property named ‘a’; true does not'));

    throws(function() { S.prop('a', 1); },
           errorEq(TypeError,
                   '‘prop’ expected object to have a property named ‘a’; 1 does not'));
  });

  it('throws when the property is not present', function() {
    throws(function() { S.prop('map', 'abcd'); },
           errorEq(TypeError,
                   '‘prop’ expected object to have a property named ‘map’; "abcd" does not'));

    throws(function() { S.prop('c', {a: 0, b: 1}); },
           errorEq(TypeError,
                   '‘prop’ expected object to have a property named ‘c’; {"a": 0, "b": 1} does not'));

    throws(function() { S.prop('xxx', [1, 2, 3]); },
           errorEq(TypeError,
                   '‘prop’ expected object to have a property named ‘xxx’; [1, 2, 3] does not'));
  });

  it('it returns the value of the specified object property', function() {
    eq(S.prop('a', {a: 0, b: 1}), 0);
    eq(S.prop('0', [1, 2, 3]), 1);
    eq(S.prop('length', 'abc'), 3);
    eq(S.prop('x', Object.create({x: 1, y: 2})), 1);
    eq(S.prop('global', /x/g), true);
  });

  it('is curried', function() {
    eq(S.prop('a').length, 1);
    eq(S.prop('a')({a: 0, b: 1}), 0);
  });

});
