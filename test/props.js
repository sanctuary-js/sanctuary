'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('props', function() {

  eq(typeof S.props, 'function');
  eq(S.props.length, 2);

  throws(function() { S.props(1); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'props :: Accessible a => Array String -> a -> b\n' +
         '                         ^^^^^^^^^^^^\n' +
         '                              1\n' +
         '\n' +
         '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Array String’.\n');

  throws(function() { S.props(['a', 'b', 'c'], null); },
         TypeError,
         'Type-class constraint violation\n' +
         '\n' +
         'props :: Accessible a => Array String -> a -> b\n' +
         '         ^^^^^^^^^^^^                    ^\n' +
         '                                         1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         '‘props’ requires ‘a’ to satisfy the Accessible type-class constraint; the value at position 1 does not.\n');

  throws(function() { S.props([true, false], {a: {b: {c: 1}}}); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'props :: Accessible a => Array String -> a -> b\n' +
         '                               ^^^^^^\n' +
         '                                 1\n' +
         '\n' +
         '1)  true :: Boolean\n' +
         '\n' +
         'The value at position 1 is not a member of ‘String’.\n');

  throws(function() { S.props(['a', 'b', 'c'], true); },
         TypeError,
         '‘props’ expected object to have a property at ["a", "b", "c"]; true does not');

  throws(function() { S.props(['a', 'b', 'c'], 1); },
         TypeError,
         '‘props’ expected object to have a property at ["a", "b", "c"]; 1 does not');

  throws(function() { S.props(['a', 'b', 'd'], {a: {b: {c: 1}}}); },
         TypeError,
         '‘props’ expected object to have a property at ["a", "b", "d"]; {"a": {"b": {"c": 1}}} does not');

  throws(function() { S.props(['a', 'b', 'c'], [1, 2, 3]); },
         TypeError,
         '‘props’ expected object to have a property at ["a", "b", "c"]; [1, 2, 3] does not');

  eq(S.props(['a', 'b', 'c'], {a: {b: {c: 1}}}), 1);
  eq(S.props(['a', 'b', 'c', '0'], {a: {b: {c: [2, 4, 6]}}}), 2);
  eq(S.props(['a', 'b', 'c'], Object.create({a: {b: {c: 1}}})), 1);

});
